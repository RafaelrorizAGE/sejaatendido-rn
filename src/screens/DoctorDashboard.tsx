import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Image,
} from 'react-native';
import { getUser, clearAuthSession, User } from '../storage/asyncStorage';
import Colors from '../theme/colors';

interface DemoConsulta {
  id: string;
  paciente: string;
  data: string;
  hora: string;
  status: string;
  motivo: string;
}

const DEMO_CONSULTAS: DemoConsulta[] = [
  { id: '1', paciente: 'Maria Santos', data: '2025-01-20', hora: '09:00', status: 'CONFIRMADA', motivo: 'Check-up anual' },
  { id: '2', paciente: 'João Oliveira', data: '2025-01-20', hora: '10:30', status: 'PENDENTE', motivo: 'Dor de cabeça recorrente' },
  { id: '3', paciente: 'Ana Costa', data: '2025-01-21', hora: '14:00', status: 'CONFIRMADA', motivo: 'Retorno' },
  { id: '4', paciente: 'Carlos Pereira', data: '2025-01-22', hora: '08:30', status: 'PENDENTE', motivo: 'Consulta inicial' },
];

export default function DoctorDashboard({ navigation }: any) {
  const [user, setUser] = useState<User | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [consultas] = useState<DemoConsulta[]>(DEMO_CONSULTAS);

  useEffect(() => {
    loadUser();
  }, []);

  async function loadUser() {
    const userData = await getUser();
    setUser(userData);
  }

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  async function handleLogout() {
    await clearAuthSession();
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  }

  const stats = {
    hoje: consultas.filter((c) => c.data === '2025-01-20').length,
    pendentes: consultas.filter((c) => c.status === 'PENDENTE').length,
    confirmadas: consultas.filter((c) => c.status === 'CONFIRMADA').length,
    total: consultas.length,
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>Olá, Dr(a).</Text>
            <Text style={styles.userName}>{user?.nome || 'Médico'}</Text>
          </View>
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <Text style={styles.logoutText}>Sair</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.doctor} />
        }
      >
        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <View style={[styles.statIconBg, { backgroundColor: Colors.doctorLight }]}>
              <Text style={styles.statIcon}>H</Text>
            </View>
            <Text style={styles.statNum}>{stats.hoje}</Text>
            <Text style={styles.statLabel}>Hoje</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIconBg, { backgroundColor: Colors.warningLight }]}>
              <Text style={styles.statIcon}>P</Text>
            </View>
            <Text style={styles.statNum}>{stats.pendentes}</Text>
            <Text style={styles.statLabel}>Pendentes</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIconBg, { backgroundColor: Colors.successLight }]}>
              <Text style={styles.statIcon}>C</Text>
            </View>
            <Text style={styles.statNum}>{stats.confirmadas}</Text>
            <Text style={styles.statLabel}>Confirmadas</Text>
          </View>
        </View>

        {/* Upcoming appointments */}
        <Text style={styles.sectionTitle}>Próximas Consultas</Text>

        {consultas.map((consulta) => (
          <View key={consulta.id} style={styles.consultaCard}>
            <View style={styles.consultaHeader}>
              <View style={styles.consultaPatient}>
                <View style={styles.patientAvatar}>
                  <Text style={styles.patientInitial}>
                    {consulta.paciente.charAt(0)}
                  </Text>
                </View>
                <View>
                  <Text style={styles.patientName}>{consulta.paciente}</Text>
                  <Text style={styles.consultaMotivo}>{consulta.motivo}</Text>
                </View>
              </View>
              <View
                style={[
                  styles.statusBadge,
                  consulta.status === 'CONFIRMADA' ? styles.statusConfirmed : styles.statusPending,
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    consulta.status === 'CONFIRMADA'
                      ? styles.statusTextConfirmed
                      : styles.statusTextPending,
                  ]}
                >
                  {consulta.status}
                </Text>
              </View>
            </View>

            <View style={styles.consultaFooter}>
              <View style={styles.timeBadge}>
                <Text style={styles.timeText}>{consulta.hora}</Text>
              </View>
              <Text style={styles.dateText}>{consulta.data}</Text>
            </View>

            <View style={styles.consultaActions}>
              <TouchableOpacity style={styles.actionBtnAccept}>
                <Text style={styles.actionBtnAcceptText}>Iniciar Consulta</Text>
              </TouchableOpacity>
              {consulta.status === 'PENDENTE' && (
                <TouchableOpacity style={styles.actionBtnConfirm}>
                  <Text style={styles.actionBtnConfirmText}>Confirmar</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        ))}

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Ações Rápidas</Text>
        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.quickAction}>
            <View style={[styles.quickIconBg, { backgroundColor: Colors.doctorLight }]}>
              <Text style={styles.quickIcon}>P</Text>
            </View>
            <Text style={styles.quickLabel}>Prontuários</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickAction}
            onPress={() => navigation.navigate('Chat')}
          >
            <View style={[styles.quickIconBg, { backgroundColor: Colors.accent }]}>
              <Text style={styles.quickIcon}>M</Text>
            </View>
            <Text style={styles.quickLabel}>Mensagens</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickAction}
            onPress={() => navigation.navigate('Profile')}
          >
            <View style={[styles.quickIconBg, { backgroundColor: Colors.warningLight }]}>
              <Text style={styles.quickIcon}>C</Text>
            </View>
            <Text style={styles.quickLabel}>Perfil</Text>
          </TouchableOpacity>
        </View>

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
  header: {
    backgroundColor: Colors.doctor,
    padding: 20,
    paddingTop: 52,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    fontWeight: '600',
  },
  userName: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.3,
    marginTop: 2,
  },
  logoutBtn: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  logoutText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  /* Stats */
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  statIconBg: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statIcon: {
    fontSize: 18,
  },
  statNum: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '600',
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 14,
    letterSpacing: -0.3,
  },
  /* Consulta cards */
  consultaCard: {
    backgroundColor: Colors.card,
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  consultaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  consultaPatient: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  patientAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.doctorLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  patientInitial: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.doctor,
  },
  patientName: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  consultaMotivo: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  statusConfirmed: {
    backgroundColor: Colors.successLight,
  },
  statusPending: {
    backgroundColor: Colors.warningLight,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  statusTextConfirmed: {
    color: Colors.success,
  },
  statusTextPending: {
    color: Colors.warning,
  },
  consultaFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  timeBadge: {
    backgroundColor: Colors.inputBg,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 12,
  },
  timeText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  dateText: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  consultaActions: {
    flexDirection: 'row',
    gap: 10,
  },
  actionBtnAccept: {
    flex: 1,
    backgroundColor: Colors.doctor,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  actionBtnAcceptText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  actionBtnConfirm: {
    flex: 1,
    backgroundColor: Colors.successLight,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  actionBtnConfirmText: {
    color: Colors.success,
    fontSize: 14,
    fontWeight: '700',
  },
  /* Quick actions */
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  quickAction: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  quickIconBg: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickIcon: {
    fontSize: 20,
  },
  quickLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
});
