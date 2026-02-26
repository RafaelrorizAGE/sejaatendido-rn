import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import * as WebBrowser from 'expo-web-browser';
import { criarPagamento, fetchPagamentoById, PagamentoResponse } from '../services/api';
import { showErrorAlert } from '../utils/errorHandler';
import Colors from '../theme/colors';

type PaymentMethod = 'pix' | 'cartao';

export default function Payment({ route, navigation }: any) {
  const { consultaId, valor } = route.params || {};
  const [method, setMethod] = useState<PaymentMethod>('pix');
  const [loading, setLoading] = useState(false);
  const [pagamento, setPagamento] = useState<PagamentoResponse | null>(null);
  const [status, setStatus] = useState<string>('');
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Card form
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  const startPolling = useCallback(
    (paymentId: string) => {
      if (pollRef.current) clearInterval(pollRef.current);
      pollRef.current = setInterval(async () => {
        try {
          const data = await fetchPagamentoById(paymentId);
          if (data.status === 'APROVADO' || data.status === 'approved') {
            setStatus('APROVADO');
            if (pollRef.current) clearInterval(pollRef.current);
            Alert.alert('Pagamento Aprovado!', 'Sua consulta foi confirmada.');
          }
        } catch {
          // polling error, ignore
        }
      }, 5000);
    },
    []
  );

  async function handlePixPayment() {
    if (!consultaId) {
      Alert.alert('Erro', 'ID da consulta não encontrado');
      return;
    }
    setLoading(true);
    try {
      const data = await criarPagamento({
        consultaId,
        metodoPagamento: 'pix',
      });
      setPagamento(data);
      setStatus(data.status || 'PENDENTE');
      startPolling(data.id);
    } catch (error) {
      showErrorAlert(error, 'Erro ao gerar pagamento PIX');
    } finally {
      setLoading(false);
    }
  }

  async function handleCardPayment() {
    if (!consultaId) {
      Alert.alert('Erro', 'ID da consulta não encontrado');
      return;
    }
    if (!cardNumber || !cardName || !cardExpiry || !cardCvv) {
      Alert.alert('Atenção', 'Preencha todos os dados do cartão');
      return;
    }
    setLoading(true);
    try {
      const data = await criarPagamento({
        consultaId,
        metodoPagamento: 'card',
      });
      setPagamento(data);

      if (data.linkPagamento || data.paymentUrl) {
        const url = data.linkPagamento || data.paymentUrl || '';
        await WebBrowser.openBrowserAsync(url);
      }

      setStatus(data.status || 'PROCESSANDO');
      startPolling(data.id);
    } catch (error) {
      showErrorAlert(error, 'Erro ao processar pagamento');
    } finally {
      setLoading(false);
    }
  }

  async function handleCopyPix() {
    const code = pagamento?.copiaCola || pagamento?.copiaECola || '';
    if (code) {
      await Clipboard.setStringAsync(code);
      Alert.alert('Copiado!', 'Código PIX copiado para a área de transferência');
    }
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pagamento</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Amount */}
        <View style={styles.amountCard}>
          <Text style={styles.amountLabel}>Valor da consulta</Text>
          <Text style={styles.amountValue}>
            R$ {valor ? Number(valor).toFixed(2) : '150,00'}
          </Text>
        </View>

        {/* Method tabs */}
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, method === 'pix' && styles.tabActive]}
            onPress={() => setMethod('pix')}
          >
            <Text style={[styles.tabText, method === 'pix' && styles.tabTextActive]}>
              PIX
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, method === 'cartao' && styles.tabActive]}
            onPress={() => setMethod('cartao')}
          >
            <Text style={[styles.tabText, method === 'cartao' && styles.tabTextActive]}>
              Cartão
            </Text>
          </TouchableOpacity>
        </View>

        {/* Status banner */}
        {status === 'APROVADO' && (
          <View style={styles.approvedBanner}>
            <Text style={styles.approvedText}>Pagamento Aprovado!</Text>
          </View>
        )}

        {/* PIX Method */}
        {method === 'pix' && (
          <View style={styles.methodCard}>
            {!pagamento ? (
              <>
                <Text style={styles.methodTitle}>Pagamento via PIX</Text>
                <Text style={styles.methodDesc}>
                  Clique abaixo para gerar o código PIX. O pagamento é confirmado automaticamente.
                </Text>
                <TouchableOpacity
                  style={[styles.payButton, loading && styles.payButtonDisabled]}
                  onPress={handlePixPayment}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.payButtonText}>Gerar PIX</Text>
                  )}
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={styles.methodTitle}>PIX Gerado</Text>

                {(pagamento.qrCode || pagamento.qrCodeBase64) && (
                  <View style={styles.qrPlaceholder}>
                    <Text style={styles.qrPlaceholderText}>QR Code</Text>
                    <Text style={styles.qrHint}>
                      Escaneie com o app do seu banco
                    </Text>
                  </View>
                )}

                {(pagamento.copiaCola || pagamento.copiaECola) && (
                  <View style={styles.pixCodeSection}>
                    <Text style={styles.pixCodeLabel}>Código Copia e Cola:</Text>
                    <View style={styles.pixCodeBox}>
                      <Text style={styles.pixCode} numberOfLines={3}>
                        {pagamento.copiaCola || pagamento.copiaECola}
                      </Text>
                    </View>
                    <TouchableOpacity style={styles.copyButton} onPress={handleCopyPix}>
                      <Text style={styles.copyButtonText}>Copiar Código</Text>
                    </TouchableOpacity>
                  </View>
                )}

                <Text style={styles.pollingHint}>
                  Aguardando confirmação do pagamento...
                </Text>
              </>
            )}
          </View>
        )}

        {/* Card Method */}
        {method === 'cartao' && (
          <View style={styles.methodCard}>
            <Text style={styles.methodTitle}>Dados do Cartão</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Número do Cartão</Text>
              <TextInput
                style={styles.input}
                value={cardNumber}
                onChangeText={setCardNumber}
                placeholder="0000 0000 0000 0000"
                placeholderTextColor={Colors.textMuted}
                keyboardType="number-pad"
                maxLength={19}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Nome do Titular</Text>
              <TextInput
                style={styles.input}
                value={cardName}
                onChangeText={setCardName}
                placeholder="Como aparece no cartão"
                placeholderTextColor={Colors.textMuted}
                autoCapitalize="characters"
              />
            </View>

            <View style={styles.rowInputs}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
                <Text style={styles.inputLabel}>Validade</Text>
                <TextInput
                  style={styles.input}
                  value={cardExpiry}
                  onChangeText={setCardExpiry}
                  placeholder="MM/AA"
                  placeholderTextColor={Colors.textMuted}
                  keyboardType="number-pad"
                  maxLength={5}
                />
              </View>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.inputLabel}>CVV</Text>
                <TextInput
                  style={styles.input}
                  value={cardCvv}
                  onChangeText={setCardCvv}
                  placeholder="000"
                  placeholderTextColor={Colors.textMuted}
                  keyboardType="number-pad"
                  maxLength={4}
                  secureTextEntry
                />
              </View>
            </View>

            <TouchableOpacity
              style={[styles.payButton, loading && styles.payButtonDisabled]}
              onPress={handleCardPayment}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.payButtonText}>Pagar com Cartão</Text>
              )}
            </TouchableOpacity>
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  header: {
    backgroundColor: Colors.primary,
    padding: 16,
    paddingTop: 52,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  backButton: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  /* Amount */
  amountCard: {
    backgroundColor: Colors.primary,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  amountLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
  },
  amountValue: {
    color: '#fff',
    fontSize: 36,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  /* Tabs */
  tabs: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 4,
    marginBottom: 20,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 12,
  },
  tabActive: {
    backgroundColor: Colors.primary,
  },
  tabText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  tabTextActive: {
    color: '#fff',
  },
  /* Approved */
  approvedBanner: {
    backgroundColor: Colors.successLight,
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.success,
  },
  approvedText: {
    color: Colors.success,
    fontSize: 16,
    fontWeight: '800',
  },
  /* Method Card */
  methodCard: {
    backgroundColor: Colors.card,
    borderRadius: 20,
    padding: 20,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  methodTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 10,
    letterSpacing: -0.3,
  },
  methodDesc: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: 20,
  },
  /* QR */
  qrPlaceholder: {
    backgroundColor: Colors.inputBg,
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
    marginBottom: 16,
  },
  qrPlaceholderText: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  qrHint: {
    fontSize: 13,
    color: Colors.textMuted,
  },
  pixCodeSection: {
    marginBottom: 16,
  },
  pixCodeLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textSecondary,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  pixCodeBox: {
    backgroundColor: Colors.inputBg,
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  pixCode: {
    fontSize: 12,
    color: Colors.textPrimary,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  copyButton: {
    backgroundColor: Colors.accent,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
  },
  copyButtonText: {
    color: Colors.primary,
    fontSize: 15,
    fontWeight: '700',
  },
  pollingHint: {
    textAlign: 'center',
    color: Colors.textMuted,
    fontSize: 13,
    marginTop: 12,
  },
  /* Card inputs */
  inputGroup: {
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textSecondary,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: Colors.inputBg,
    borderRadius: 14,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    color: Colors.textPrimary,
  },
  rowInputs: {
    flexDirection: 'row',
  },
  /* Pay button */
  payButton: {
    backgroundColor: Colors.success,
    borderRadius: 14,
    padding: 18,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: Colors.success,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  payButtonDisabled: {
    opacity: 0.6,
  },
  payButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '800',
  },
});
