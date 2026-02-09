import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { resetPasswordRequest } from '../services/api';
import { showErrorAlert } from '../utils/errorHandler';

export default function ResetPassword({ route, navigation }: any) {
  const token: string | undefined = useMemo(() => {
    const value = route?.params?.token;
    return typeof value === 'string' ? value : undefined;
  }, [route?.params?.token]);

  const [senha, setSenha] = useState('');
  const [confirmaSenha, setConfirmaSenha] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!token) {
      Alert.alert('Erro', 'Token inválido. Abra o link novamente.');
      return;
    }

    if (!senha || !confirmaSenha) {
      Alert.alert('Erro', 'Preencha a nova senha e a confirmação.');
      return;
    }

    if (senha.length < 6) {
      Alert.alert('Erro', 'A senha deve ter no mínimo 6 caracteres.');
      return;
    }

    if (senha !== confirmaSenha) {
      Alert.alert('Erro', 'As senhas não coincidem.');
      return;
    }

    setLoading(true);
    try {
      await resetPasswordRequest(token, senha);
      Alert.alert('Sucesso', 'Senha alterada com sucesso.', [
        { text: 'OK', onPress: () => navigation.replace('Login') },
      ]);
    } catch (error: unknown) {
      showErrorAlert(error, 'Não foi possível alterar sua senha');
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Redefinir senha</Text>
        <Text style={styles.subtitle}>Crie uma nova senha para sua conta</Text>

        <TextInput
          style={styles.input}
          placeholder="Nova senha"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
          editable={!loading}
        />

        <TextInput
          style={styles.input}
          placeholder="Confirmar nova senha"
          value={confirmaSenha}
          onChangeText={setConfirmaSenha}
          secureTextEntry
          editable={!loading}
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Salvar nova senha</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.linkButton}
          onPress={() => navigation.replace('Login')}
          disabled={loading}
        >
          <Text style={styles.linkText}>Voltar para login</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  linkButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  linkText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
});
