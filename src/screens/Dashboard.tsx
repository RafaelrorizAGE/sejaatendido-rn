import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
  Image,
} from 'react-native';
import { fetchMinhasConsultas, Consulta } from '../services/api';
import { clearAuthSession, getUser } from '../storage/asyncStorage';
import { showErrorAlert } from '../utils/errorHandler';
import Colors from '../theme/colors';

export default function Dashboard({ navigation }: any) {
  const [consultas, setConsultas] = useState<Consulta[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    loadData();
    loadUserName();
  }, []);

  async function loadUserName() {
    const user = await getUser();
    if (user) {
      setUserName(user.nome.split(' ')[0]);
    }
  }

  async function loadData() {
    try {
      const data = await fetchMinhasConsultas();
      setConsultas(data);
    } catch (error: unknown) {
      showErrorAlert(error, 'Erro ao carregar consultas');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  function isPendingPayment(status: string) {
    const normalized = (status ?? '').toString().toLowerCase();
    return (
      normalized.includes('pend') ||
      normalized.includes('aguard') ||
      normalized.includes('waiting') ||
      normalized.includes('unpaid')
    );
  }

  function handlePay(consulta: Consulta) {
    navigation.navigate('Payment', {
      consultaId: consulta.id,
      amount: 150,
    });
  }

  async function handleLogout() {
    Alert.alert('Sair', 'Tem certeza que deseja sair?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: async () => {
          await clearAuthSession();
          navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
        },
      },
    ]);
  }

  function onRefresh() {
    setRefreshing(true);
    loadData();
  }

  function getStatusColor(status: string) {
    switch (status.toLowerCase()) {
      case 'confirmado':
      case 'realizada':
        return Colors.success;
      case 'pendente':
        return Colors.warning;
      case 'cancelada':
        return Colors.error;
      default:
        return Colors.textMuted;
    }
  }

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <Image
              source={require('../../assets/seja_atendido_fundo_transparente.png')}
              style={styles.headerLogo}
              resizeMode="contain"
            />
            <View>
              <Text style={styles.greeting}>Olá, {userName}!</Text>
              <Text style={styles.subtitle}>Bem-vindo de volta</Text>
            </View>
          </View>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Text style={styles.logoutText}>Sair</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}
      >
        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Ações Rápidas</Text>
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('BookAppointment')}
            activeOpacity={0.7}
          >
            <View style={[styles.actionIconBg, { backgroundColor: Colors.accent }]}>
              <Text style={styles.actionIcon}>+</Text>
            </View>
            <Text style={styles.actionText}>Agendar{'\n'}Consulta</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('Profile')}
            activeOpacity={0.7}
          >
            <View style={[styles.actionIconBg, { backgroundColor: '#EDE7F6' }]}>
              <Text style={styles.actionIcon}>P</Text>
            </View>
            <Text style={styles.actionText}>Meu{'\n'}Perfil</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('Chat')}
            activeOpacity={0.7}
          >
            <View style={[styles.actionIconBg, { backgroundColor: '#E3F2FD' }]}>
              <Text style={styles.actionIcon}>C</Text>
            </View>
            <Text style={styles.actionText}>Chat</Text>
          </TouchableOpacity>
        </View>

        {/* Upcoming Appointments */}
        <Text style={styles.sectionTitle}>Próximas Consultas</Text>
        {consultas.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>—</Text>
            <Text style={styles.emptyText}>Nenhuma consulta agendada</Text>
            <TouchableOpacity
              style={styles.emptyButton}
              onPress={() => navigation.navigate('BookAppointment')}
              activeOpacity={0.85}
            >
              <Text style={styles.emptyButtonText}>Agendar agora</Text>
            </TouchableOpacity>
          </View>
        ) : (
          consultas.map((consulta) => (
            <View key={consulta.id} style={styles.consultaCard}>
              <View style={styles.consultaHeader}>
                <Text style={styles.consultaDoctor}>
                  {consulta.medico?.usuario?.nome || 'Médico'}
                </Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(consulta.status) }]}>
                  <Text style={styles.statusText}>{consulta.status}</Text>
                </View>
              </View>
              <Text style={styles.consultaMotivo}>{consulta.motivo}</Text>
              <Text style={styles.consultaDate}>{formatDate(consulta.data)}</Text>

              {isPendingPayment(consulta.status) && (
                <TouchableOpacity style={styles.payButton} onPress={() => handlePay(consulta)}>
                  <Text style={styles.payButtonText}>Pagar consulta</Text>
                </TouchableOpacity>
              )}

              {consulta.meetLink && (
                <TouchableOpacity style={styles.meetButton}>
                  <Text style={styles.meetButtonText}>Entrar na consulta</Text>
                </TouchableOpacity>
              )}
            </View>
          ))
        )}

        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.bg,
  },
  header: {
    backgroundColor: Colors.primary,
    paddingTop: 52,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerLogo: {
    width: 40,
    height: 40,
    marginRight: 12,
    tintColor: '#fff',
  },
  greeting: {
    fontSize: 22,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.75)',
    marginTop: 2,
  },
  logoutButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  logoutText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 14,
    marginTop: 4,
    letterSpacing: -0.3,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 28,
  },
  actionCard: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 8,
    alignItems: 'center',
    marginHorizontal: 5,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  actionIconBg: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  actionIcon: {
    fontSize: 24,
  },
  actionText: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
    fontWeight: '600',
    lineHeight: 16,
  },
  emptyState: {
    backgroundColor: Colors.card,
    borderRadius: 20,
    padding: 36,
    alignItems: 'center',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 14,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 18,
  },
  emptyButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 14,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  emptyButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
  consultaCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  consultaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  consultaDoctor: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  statusText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  consultaMotivo: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  consultaDate: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
  },
  payButton: {
    backgroundColor: Colors.success,
    padding: 14,
    borderRadius: 12,
    marginTop: 12,
    alignItems: 'center',
  },
  payButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
  meetButton: {
    backgroundColor: Colors.accent,
    padding: 14,
    borderRadius: 12,
    marginTop: 12,
    alignItems: 'center',
  },
  meetButtonText: {
    color: Colors.primary,
    fontWeight: '700',
  },
});
