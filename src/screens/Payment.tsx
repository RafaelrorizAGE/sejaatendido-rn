import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';

type PaymentMethod = 'pix' | 'card';

export default function Payment({ navigation, route }: any) {
  const [method, setMethod] = useState<PaymentMethod>('pix');
  const [loading, setLoading] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  const amount = route?.params?.amount || 150;

  const pixCode = '00020126BR.GOV.BCB.PIX...EXEMPLO';

  async function handlePayment() {
    setLoading(true);
    
    // Simular processamento
    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        'Pagamento Confirmado!',
        'Seu pagamento foi processado com sucesso.',
        [{ text: 'OK', onPress: () => navigation.navigate('Dashboard') }]
      );
    }, 2000);
  }

  function copyPixCode() {
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
              <View style={styles.qrPlaceholder}>
                <Text style={styles.qrText}>📱</Text>
                <Text style={styles.qrLabel}>QR Code PIX</Text>
              </View>
            </View>

            <Text style={styles.pixInstructions}>
              Escaneie o QR Code acima no app do seu banco ou copie o código PIX.
            </Text>

            <TouchableOpacity style={styles.copyButton} onPress={copyPixCode}>
              <Text style={styles.copyButtonText}>📋 Copiar código PIX</Text>
            </TouchableOpacity>

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
