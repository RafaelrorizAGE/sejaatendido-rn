import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { confirmEmailRequest } from '../services/api';
import Colors from '../theme/colors';

type Status = 'loading' | 'success' | 'error';

export default function ConfirmEmail({ route, navigation }: any) {
  const { token } = route.params || {};
  const [status, setStatus] = useState<Status>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (token) {
      confirmEmail();
    } else {
      setStatus('error');
      setMessage('Token de confirmação não encontrado.');
    }
  }, [token]);

  async function confirmEmail() {
    setStatus('loading');
    try {
      await confirmEmailRequest(token);
      setStatus('success');
      setMessage('Seu email foi confirmado com sucesso!');
    } catch (error: any) {
      setStatus('error');
      const serverMsg =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        'Não foi possível confirmar o email. Tente novamente.';
      setMessage(serverMsg);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {status === 'loading' && (
          <>
            <ActivityIndicator size="large" color={Colors.primary} style={styles.icon} />
            <Text style={styles.title}>Confirmando email...</Text>
            <Text style={styles.subtitle}>Aguarde um momento</Text>
          </>
        )}

        {status === 'success' && (
          <>
            <View style={[styles.iconCircle, { backgroundColor: Colors.successLight }]}>
              <Text style={styles.iconEmoji}>✓</Text>
            </View>
            <Text style={styles.title}>Email Confirmado!</Text>
            <Text style={styles.subtitle}>{message}</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.replace('Login')}
            >
              <Text style={styles.buttonText}>Ir para Login</Text>
            </TouchableOpacity>
          </>
        )}

        {status === 'error' && (
          <>
            <View style={[styles.iconCircle, { backgroundColor: Colors.errorLight }]}>
              <Text style={styles.iconEmoji}>✗</Text>
            </View>
            <Text style={styles.title}>Erro na Confirmação</Text>
            <Text style={styles.subtitle}>{message}</Text>
            <TouchableOpacity style={styles.button} onPress={confirmEmail}>
              <Text style={styles.buttonText}>Tentar Novamente</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.linkButton}
              onPress={() => navigation.replace('Login')}
            >
              <Text style={styles.linkText}>Voltar para Login</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: Colors.card,
    borderRadius: 24,
    padding: 36,
    alignItems: 'center',
    width: '100%',
    maxWidth: 380,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 5,
  },
  icon: {
    marginBottom: 20,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconEmoji: {
    fontSize: 36,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 10,
    letterSpacing: -0.3,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  button: {
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 40,
    width: '100%',
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  linkButton: {
    marginTop: 16,
    padding: 8,
  },
  linkText: {
    color: Colors.primary,
    fontSize: 15,
    fontWeight: '600',
  },
});
