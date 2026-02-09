import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import * as WebBrowser from 'expo-web-browser';
import { criarPagamento, fetchPagamentoById } from '../services/api';
import { showErrorAlert } from '../utils/errorHandler';

type PaymentMethod = 'pix' | 'card';

export default function Payment({ navigation, route }: any) {
  const [method, setMethod] = useState<PaymentMethod>('pix');
  const [loading, setLoading] = useState(false);
  const [creatingPayment, setCreatingPayment] = useState(false);
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [qrImageUri, setQrImageUri] = useState<string>('');
  const [pixCopyCode, setPixCopyCode] = useState<string>('');
  const pollingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pollingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  const consultaId: string | undefined = useMemo(() => {
    const value = route?.params?.consultaId;
    return typeof value === 'string' ? value : undefined;
  }, [route?.params?.consultaId]);

  const amount: number = useMemo(() => {
    const value = route?.params?.amount;
    return typeof value === 'number' ? value : 150;
  }, [route?.params?.amount]);

  const isRealFlow = Boolean(consultaId);

  function cleanupPolling() {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
    if (pollingTimeoutRef.current) {
      clearTimeout(pollingTimeoutRef.current);
      pollingTimeoutRef.current = null;
    }
  }

  function normalizeQrImageUri(value: unknown): string {
    if (typeof value !== 'string') return '';
    const trimmed = value.trim();
    if (!trimmed) return '';
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
    if (trimmed.startsWith('data:image/')) return trimmed;
    // assume base64 png
    return `data:image/png;base64,${trimmed}`;
  }

  function normalizePixCopyCode(data: any): string {
    return (
      data?.copiaECola ??
      data?.copiaCola ??
      data?.pixCopiaECola ??
      data?.pixCode ??
      ''
    );
  }

  async function startPollingStatus(id: string) {
    cleanupPolling();

    pollingIntervalRef.current = setInterval(async () => {
      try {
        const data = await fetchPagamentoById(id);
        const status = (data?.status ?? '').toString().toLowerCase();

        if (status === 'aprovado' || status === 'approved' || status === 'paid' || status === 'pago') {
          cleanupPolling();
          Alert.alert('Sucesso', 'Pagamento confirmado!', [
            { text: 'OK', onPress: () => navigation.goBack() },
          ]);
        }
      } catch (error) {
        if (__DEV__) console.error('Erro ao checar pagamento:', error);
      }
    }, 5000);

    pollingTimeoutRef.current = setTimeout(() => {
      cleanupPolling();
    }, 10 * 60 * 1000);
  }

  async function createPixPayment() {
    if (!consultaId) return;

    setCreatingPayment(true);
    try {
      const data = await criarPagamento({ consultaId, metodoPagamento: 'pix' });
      const id = data?.id;
      if (id) setPaymentId(id);

      const qr = normalizeQrImageUri(data?.qrCodeBase64 ?? data?.qrCode);
      setQrImageUri(qr);
      setPixCopyCode(normalizePixCopyCode(data));

      if (id) {
        await startPollingStatus(id);
      }
    } catch (error) {
      showErrorAlert(error, 'Não foi possível gerar pagamento');
    } finally {
      setCreatingPayment(false);
    }
  }

  useEffect(() => {
    if (!isRealFlow) return;

    if (method === 'pix') {
      createPixPayment();
    } else {
      cleanupPolling();
    }

    return () => {
      cleanupPolling();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRealFlow, method, consultaId]);

  async function handlePayment() {
    if (isRealFlow) {
      // Card flow: request payment and open the checkout URL.
      if (!consultaId) return;

      setLoading(true);
      try {
        const data = await criarPagamento({ consultaId, metodoPagamento: 'cartao' });
        const url: string | undefined = data?.linkPagamento ?? data?.paymentUrl;

        if (!url) {
          Alert.alert('Erro', 'Link de pagamento não retornado pelo servidor.');
          return;
        }

        await WebBrowser.openBrowserAsync(url);
      } catch (error) {
        showErrorAlert(error, 'Não foi possível iniciar pagamento');
      } finally {
        setLoading(false);
      }

      return;
    }

    // Simulated fallback
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert('Pagamento Confirmado!', 'Seu pagamento foi processado com sucesso.', [
        { text: 'OK', onPress: () => navigation.navigate('Dashboard') },
      ]);
    }, 2000);
  }

  async function copyPixCode() {
    if (isRealFlow) {
      if (!pixCopyCode) {
        Alert.alert('Erro', 'Código PIX ainda não disponível.');
        return;
      }

      await Clipboard.setStringAsync(pixCopyCode);
      Alert.alert('Código PIX', 'Código copiado para a área de transferência!');
      return;
    }

    Alert.alert('Código PIX', 'Código copiado para a área de transferência!');
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pagamento</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView style={styles.content}>
        {/* Amount Card */}
        <View style={styles.amountCard}>
          <Text style={styles.amountLabel}>Valor da Consulta</Text>
          <Text style={styles.amountValue}>R$ {amount.toFixed(2)}</Text>
        </View>

        {/* Payment Method Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, method === 'pix' && styles.tabActive]}
            onPress={() => setMethod('pix')}
          >
            <Text style={[styles.tabText, method === 'pix' && styles.tabTextActive]}>
              💎 PIX
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, method === 'card' && styles.tabActive]}
            onPress={() => setMethod('card')}
          >
            <Text style={[styles.tabText, method === 'card' && styles.tabTextActive]}>
              💳 Cartão
            </Text>
          </TouchableOpacity>
        </View>

        {/* PIX Payment */}
        {method === 'pix' && (
          <View style={styles.paymentSection}>
            <View style={styles.qrContainer}>
              {isRealFlow ? (
                creatingPayment ? (
                  <View style={styles.qrPlaceholder}>
                    <ActivityIndicator />
                    <Text style={styles.qrLabel}>Gerando pagamento…</Text>
                  </View>
                ) : qrImageUri ? (
                  <Image
                    source={{ uri: qrImageUri }}
                    style={styles.qrImage}
                    resizeMode="contain"
                  />
                ) : (
                  <View style={styles.qrPlaceholder}>
                    <Text style={styles.qrText}>📱</Text>
                    <Text style={styles.qrLabel}>QR Code indisponível</Text>
                  </View>
                )
              ) : (
                <View style={styles.qrPlaceholder}>
                  <Text style={styles.qrText}>📱</Text>
                  <Text style={styles.qrLabel}>QR Code PIX</Text>
                </View>
              )}
            </View>

            <Text style={styles.pixInstructions}>
              Escaneie o QR Code acima no app do seu banco ou copie o código PIX.
            </Text>

            <TouchableOpacity style={styles.copyButton} onPress={copyPixCode}>
              <Text style={styles.copyButtonText}>📋 Copiar código PIX</Text>
            </TouchableOpacity>

            {!isRealFlow && (
              <TouchableOpacity
                style={[styles.payButton, loading && styles.payButtonDisabled]}
                onPress={handlePayment}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.payButtonText}>Confirmar Pagamento</Text>
                )}
              </TouchableOpacity>
            )}

            {isRealFlow && paymentId ? (
              <Text style={styles.waitingText}>Aguardando confirmação do pagamento…</Text>
            ) : null}
          </View>
        )}

        {/* Card Payment */}
        {method === 'card' && (
          <View style={styles.paymentSection}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Número do cartão</Text>
              <TextInput
                style={styles.input}
                placeholder="0000 0000 0000 0000"
                value={cardNumber}
                onChangeText={setCardNumber}
                keyboardType="numeric"
                maxLength={19}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Nome no cartão</Text>
              <TextInput
                style={styles.input}
                placeholder="Nome como está no cartão"
                value={cardName}
                onChangeText={setCardName}
                autoCapitalize="characters"
              />
            </View>

            <View style={styles.rowInputs}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                <Text style={styles.inputLabel}>Validade</Text>
                <TextInput
                  style={styles.input}
                  placeholder="MM/AA"
                  value={expiry}
                  onChangeText={setExpiry}
                  keyboardType="numeric"
                  maxLength={5}
                />
              </View>
              <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                <Text style={styles.inputLabel}>CVV</Text>
                <TextInput
                  style={styles.input}
                  placeholder="123"
                  value={cvv}
                  onChangeText={setCvv}
                  keyboardType="numeric"
                  maxLength={4}
                  secureTextEntry
                />
              </View>
            </View>

            <TouchableOpacity
              style={[styles.payButton, loading && styles.payButtonDisabled]}
              onPress={handlePayment}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.payButtonText}>
                  💳 Pagar R$ {amount.toFixed(2)}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        )}

        {/* Security Info */}
        <View style={styles.securityInfo}>
          <Text style={styles.securityText}>🔒 Pagamento 100% seguro</Text>
          <Text style={styles.securitySubtext}>
            Seus dados são protegidos com criptografia de ponta a ponta.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#007AFF',
    padding: 16,
    paddingTop: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    color: '#fff',
    fontSize: 16,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  amountCard: {
    backgroundColor: '#007AFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
  },
  amountLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
  },
  amountValue: {
    color: '#fff',
    fontSize: 36,
    fontWeight: 'bold',
    marginTop: 4,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 10,
  },
  tabActive: {
    backgroundColor: '#007AFF',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  tabTextActive: {
    color: '#fff',
  },
  paymentSection: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  qrContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  qrPlaceholder: {
    width: 200,
    height: 200,
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrImage: {
    width: 240,
    height: 240,
    alignSelf: 'center',
  },
  qrText: {
    fontSize: 64,
  },
  qrLabel: {
    marginTop: 8,
    color: '#666',
    fontSize: 14,
  },
  pixInstructions: {
    textAlign: 'center',
    color: '#666',
    marginBottom: 20,
    lineHeight: 20,
  },
  copyButton: {
    backgroundColor: '#f0f0f0',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  copyButtonText: {
    color: '#333',
    fontWeight: '600',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  rowInputs: {
    flexDirection: 'row',
  },
  payButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginTop: 8,
  },
  payButtonDisabled: {
    opacity: 0.6,
  },
  payButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  waitingText: {
    marginTop: 16,
    textAlign: 'center',
    color: '#666',
  },
  securityInfo: {
    alignItems: 'center',
    padding: 20,
  },
  securityText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4CAF50',
  },
  securitySubtext: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
    textAlign: 'center',
  },
});
