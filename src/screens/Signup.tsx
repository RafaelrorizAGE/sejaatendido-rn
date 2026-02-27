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
  Image,
} from 'react-native';
import { registerRequest } from '../services/api';
import { showErrorAlert } from '../utils/errorHandler';
import Colors from '../theme/colors';

export default function SignupScreen({ navigation }: any) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmaSenha, setConfirmaSenha] = useState('');
  const [tipo, setTipo] = useState<'PACIENTE' | 'MEDICO'>('PACIENTE');
  const [crm, setCrm] = useState('');
  const [diplomaAnexado, setDiplomaAnexado] = useState(false);
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

    if (tipo === 'MEDICO' && !crm.trim()) {
      Alert.alert('Erro', 'Informe o número do CRM');
      return;
    }

    setLoading(true);
    try {
      await registerRequest({ nome, email, senha, tipo });
      const msg =
        tipo === 'MEDICO'
          ? 'Conta criada com sucesso. Seu cadastro será analisado pela equipe antes da aprovação.'
          : 'Conta criada com sucesso. Faça login para continuar.';
      Alert.alert('Sucesso!', msg, [
        { text: 'OK', onPress: () => navigation.navigate('Login') },
      ]);
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
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Image
          source={require('../../assets/seja_atendido_fundo_transparente.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.title}>Criar Conta</Text>
        <Text style={styles.subtitle}>Preencha seus dados para começar</Text>

        <View style={styles.formCard}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Nome completo"
              placeholderTextColor={Colors.textMuted}
              value={nome}
              onChangeText={setNome}
              editable={!loading}
            />
          </View>

          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor={Colors.textMuted}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              editable={!loading}
            />
          </View>

          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Senha (mínimo 6 caracteres)"
              placeholderTextColor={Colors.textMuted}
              value={senha}
              onChangeText={setSenha}
              secureTextEntry
              editable={!loading}
            />
          </View>

          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Confirmar senha"
              placeholderTextColor={Colors.textMuted}
              value={confirmaSenha}
              onChangeText={setConfirmaSenha}
              secureTextEntry
              editable={!loading}
            />
          </View>

          <Text style={styles.label}>Tipo de conta</Text>
          <View style={styles.tipoContainer}>
            <TouchableOpacity
              style={[styles.tipoButton, tipo === 'PACIENTE' && styles.tipoButtonActive]}
              onPress={() => setTipo('PACIENTE')}
              disabled={loading}
            >
              <Text style={[styles.tipoText, tipo === 'PACIENTE' && styles.tipoTextActive]}>
                Paciente
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tipoButton, tipo === 'MEDICO' && styles.tipoButtonActive]}
              onPress={() => setTipo('MEDICO')}
              disabled={loading}
            >
              <Text style={[styles.tipoText, tipo === 'MEDICO' && styles.tipoTextActive]}>
                Médico
              </Text>
            </TouchableOpacity>
          </View>

          {tipo === 'MEDICO' && (
            <View style={styles.doctorSection}>
              <Text style={styles.doctorSectionTitle}>Dados Profissionais</Text>

              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="Número do CRM"
                  placeholderTextColor={Colors.textMuted}
                  value={crm}
                  onChangeText={setCrm}
                  keyboardType="default"
                  autoCapitalize="characters"
                  editable={!loading}
                />
              </View>

              <TouchableOpacity
                style={[
                  styles.uploadArea,
                  diplomaAnexado && styles.uploadAreaAttached,
                ]}
                onPress={() => {
                  setDiplomaAnexado(!diplomaAnexado);
                  if (!diplomaAnexado) {
                    Alert.alert(
                      'Diploma / Certificados',
                      'Funcionalidade de upload em breve. Seu diploma e certificados serão verificados pela equipe.'
                    );
                  }
                }}
                disabled={loading}
                activeOpacity={0.7}
              >
                <View style={styles.uploadIconContainer}>
                  <Text style={styles.uploadIcon}>{diplomaAnexado ? '+' : '+'}</Text>
                </View>
                <Text style={[
                  styles.uploadText,
                  diplomaAnexado && styles.uploadTextAttached,
                ]}>
                  {diplomaAnexado ? 'Documento selecionado' : 'Anexar Diploma / Certificados'}
                </Text>
                <Text style={styles.uploadHint}>
                  {diplomaAnexado
                    ? 'Toque para remover'
                    : 'PDF, JPG ou PNG (em breve)'}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleSignup}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Cadastrar</Text>
            )}
          </TouchableOpacity>
        </View>

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
    backgroundColor: Colors.bg,
  },
  scrollContent: {
    padding: 24,
    paddingTop: 50,
    paddingBottom: 40,
  },
  logo: {
    width: '100%',
    height: 120,
    marginBottom: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  formCard: {
    backgroundColor: Colors.card,
    borderRadius: 20,
    padding: 24,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.inputBg,
    borderRadius: 14,
    marginBottom: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  inputIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 15,
    fontSize: 16,
    color: Colors.textPrimary,
  },
  label: {
    fontSize: 15,
    color: Colors.textPrimary,
    marginBottom: 10,
    fontWeight: '700',
    marginTop: 4,
  },
  tipoContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  tipoButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: Colors.border,
    backgroundColor: Colors.inputBg,
    alignItems: 'center',
  },
  tipoButtonActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.accent,
  },
  tipoEmoji: {
    fontSize: 22,
    marginBottom: 4,
  },
  tipoText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  tipoTextActive: {
    color: Colors.primary,
  },
  button: {
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 5,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  linkButton: {
    marginTop: 24,
    alignItems: 'center',
  },
  linkText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  linkTextBold: {
    color: Colors.primary,
    fontWeight: '700',
  },
  doctorSection: {
    marginTop: 4,
    marginBottom: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  doctorSectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.doctor,
    marginBottom: 12,
  },
  uploadArea: {
    borderWidth: 2,
    borderColor: Colors.border,
    borderStyle: 'dashed',
    borderRadius: 14,
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
    backgroundColor: Colors.inputBg,
  },
  uploadAreaAttached: {
    borderColor: Colors.success,
    backgroundColor: '#E8F5E9',
  },
  uploadIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  uploadIcon: {
    fontSize: 22,
    color: Colors.primary,
    fontWeight: '700',
  },
  uploadText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  uploadTextAttached: {
    color: Colors.success,
  },
  uploadHint: {
    fontSize: 12,
    color: Colors.textMuted,
  },
});
