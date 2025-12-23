import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { confirmEmailRequest } from '../services/api';

export default function ConfirmEmail({ route, navigation }: any) {
  const token: string | undefined = useMemo(() => {
    const value = route?.params?.token;
    return typeof value === 'string' ? value : undefined;
  }, [route?.params?.token]);

  const [loading, setLoading] = useState(true);
  const [done, setDone] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      if (!token) {
        setLoading(false);
        setErrorMessage('Token inválido ou ausente no link.');
        return;
      }

      try {
        await confirmEmailRequest(token);
        if (cancelled) return;
        setDone(true);
      } catch (error: any) {
        if (cancelled) return;
        const message =
          error?.response?.data?.erro ||
          error?.response?.data?.message ||
          'Não foi possível confirmar seu email.';
        setErrorMessage(message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [token]);

  function goToLogin() {
    navigation.replace('Login');
  }

  function retry() {
    setLoading(true);
    setErrorMessage(null);
    setDone(false);

    // Re-dispatch by re-navigating to same screen with same params.
    navigation.replace('ConfirmEmail', { token });
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.subtitle}>Confirmando email…</Text>
      </View>
    );
  }

  if (done) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Email confirmado</Text>
        <Text style={styles.subtitle}>Sua conta está pronta para uso.</Text>

        <TouchableOpacity style={styles.button} onPress={goToLogin}>
          <Text style={styles.buttonText}>Ir para login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Falha ao confirmar</Text>
      <Text style={styles.subtitle}>{errorMessage ?? 'Tente novamente.'}</Text>

      <View style={{ height: 12 }} />

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          if (!token) {
            Alert.alert('Erro', 'Token inválido. Abra o link novamente.');
            return;
          }
          retry();
        }}
      >
        <Text style={styles.buttonText}>Tentar novamente</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.linkButton} onPress={goToLogin}>
        <Text style={styles.linkText}>Voltar para login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    marginTop: 8,
  },
  button: {
    marginTop: 16,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 18,
    alignItems: 'center',
    minWidth: 200,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  linkButton: {
    marginTop: 16,
    alignItems: 'center',
  },
  linkText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
});
