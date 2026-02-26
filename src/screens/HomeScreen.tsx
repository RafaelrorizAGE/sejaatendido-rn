import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { getUser, clearAuthSession, User } from '../storage/asyncStorage';
import Colors from '../theme/colors';

export default function HomeScreen({ navigation }: any) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    loadUser();
  }, []);

  async function loadUser() {
    const userData = await getUser();
    setUser(userData);
  }

  async function handleLogout() {
    await clearAuthSession();
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Seja Atendido</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.welcomeText}>
          Bem-vindo{user?.nome ? `, ${user.nome}` : ''}!
        </Text>
        <Text style={styles.subtitle}>
          Selecione uma opção para continuar
        </Text>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('Dashboard')}
        >
          <Text style={styles.cardIcon}>•</Text>
          <Text style={styles.cardText}>Minhas Consultas</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('Profile')}
        >
          <Text style={styles.cardIcon}>•</Text>
          <Text style={styles.cardText}>Meu Perfil</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Sair da Conta</Text>
        </TouchableOpacity>
      </View>
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
    padding: 20,
    paddingTop: 56,
    alignItems: 'center',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  welcomeText: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 36,
  },
  card: {
    backgroundColor: Colors.card,
    borderRadius: 18,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardIcon: {
    fontSize: 28,
    marginRight: 16,
  },
  cardText: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  logoutButton: {
    marginTop: 24,
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.error,
  },
  logoutText: {
    color: Colors.error,
    fontSize: 16,
    fontWeight: '700',
  },
});
