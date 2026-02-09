import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { registerRequest } from '../services/api';
import { showErrorAlert } from '../utils/errorHandler';

export default function SignupScreen({ navigation }: any) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmaSenha, setConfirmaSenha] = useState('');
  const [tipo, setTipo] = useState<'PACIENTE' | 'MEDICO'>('PACIENTE');
  const [loading, setLoading] = useState(false);

  async function handleSignup() {
    if (!nome || !email || !senha || !confirmaSenha) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }

    if (senha !== confirmaSenha) {
      Alert.alert('Erro', 'As senhas não coincidem');
      return;
    }

    if (senha.length < 6) {
      Alert.alert('Erro', 'A senha deve ter no mínimo 6 caracteres');
      return;
    }

    setLoading(true);
    try {
      await registerRequest({ nome, email, senha, tipo });
      Alert.alert(
        'Sucesso!',
        'Conta criada com sucesso. Faça login para continuar.',
        [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
      );
    } catch (error: unknown) {
      showErrorAlert(error, 'Erro ao criar conta');
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Criar Conta</Text>
        <Text style={styles.subtitle}>Preencha seus dados</Text>

        <TextInput
          style={styles.input}
          placeholder="Nome completo"
          value={nome}
          onChangeText={setNome}
          editable={!loading}
        />

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          editable={!loading}
        />

        <TextInput
          style={styles.input}
          placeholder="Senha (mínimo 6 caracteres)"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
          editable={!loading}
        />

        <TextInput
          style={styles.input}
          placeholder="Confirmar senha"
          value={confirmaSenha}
          onChangeText={setConfirmaSenha}
          secureTextEntry
          editable={!loading}
        />

        <Text style={styles.label}>Tipo de conta:</Text>
        <View style={styles.tipoContainer}>
          <TouchableOpacity
            style={[
              styles.tipoButton,
              tipo === 'PACIENTE' && styles.tipoButtonActive,
            ]}
            onPress={() => setTipo('PACIENTE')}
            disabled={loading}
          >
            <Text
              style={[
                styles.tipoText,
                tipo === 'PACIENTE' && styles.tipoTextActive,
              ]}
            >
              Paciente
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tipoButton,
              tipo === 'MEDICO' && styles.tipoButtonActive,
            ]}
            onPress={() => setTipo('MEDICO')}
            disabled={loading}
          >
            <Text
              style={[
                styles.tipoText,
                tipo === 'MEDICO' && styles.tipoTextActive,
              ]}
            >
              Médico
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSignup}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Cadastrar</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.linkButton}
          onPress={() => navigation.navigate('Login')}
          disabled={loading}
        >
          <Text style={styles.linkText}>
            Já tem conta? <Text style={styles.linkTextBold}>Fazer login</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
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
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 12,
    fontWeight: '600',
  },
  tipoContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  tipoButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  tipoButtonActive: {
    borderColor: '#007AFF',
    backgroundColor: '#E3F2FD',
  },
  tipoText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
  tipoTextActive: {
    color: '#007AFF',
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
    fontSize: 18,
    fontWeight: '600',
  },
  linkButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  linkText: {
    fontSize: 14,
    color: '#666',
  },
  linkTextBold: {
    color: '#007AFF',
    fontWeight: '600',
  },
});
