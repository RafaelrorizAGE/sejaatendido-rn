import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { getUser, clearAuthSession, User } from '../storage/asyncStorage';
import {
  fetchMedicosPendentes,
  aprovarMedico,
  recusarMedico,
  Medico,
} from '../services/api';
import { showErrorAlert } from '../utils/errorHandler';
import Colors from '../theme/colors';

export default function AdminDashboard({ navigation }: any) {
  const [user, setUser] = useState<User | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [pendentes, setPendentes] = useState<Medico[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [userData, medicosData] = await Promise.all([
        getUser(),
        fetchMedicosPendentes(),
      ]);
      setUser(userData);
      setPendentes(medicosData);
    } catch (error) {
      if (__DEV__) console.error('Erro ao carregar dados admin:', error);
    } finally {
      setLoading(false);
    }
  }

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const data = await fetchMedicosPendentes();
      setPendentes(data);
    } catch (error) {
      showErrorAlert(error, 'Erro ao atualizar');
    } finally {
      setRefreshing(false);
    }
  }, []);

  async function handleAprovar(id: string) {
    setActionLoading(id);
    try {
      await aprovarMedico(id);
      setPendentes((prev) => prev.filter((m) => m.id !== id));
      Alert.alert('Sucesso', 'Médico aprovado com sucesso!');
    } catch (error) {
      showErrorAlert(error, 'Erro ao aprovar médico');
    } finally {
      setActionLoading(null);
    }
  }

  async function handleRecusar(id: string) {
    Alert.alert('Confirmar', 'Tem certeza que deseja recusar este médico?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Recusar',
        style: 'destructive',
        onPress: async () => {
          setActionLoading(id);
          try {
            await recusarMedico(id);
            setPendentes((prev) => prev.filter((m) => m.id !== id));
            Alert.alert('Concluído', 'Médico recusado.');
          } catch (error) {
            showErrorAlert(error, 'Erro ao recusar médico');
          } finally {
            setActionLoading(null);
          }
        },
      },
    ]);
  }

  async function handleLogout() {
    await clearAuthSession();
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  }

  const stats = [
    { label: 'Pendentes', value: pendentes.length, icon: 'P', bg: Colors.warningLight },
    { label: 'Médicos', value: 24, icon: 'M', bg: Colors.doctorLight },
    { label: 'Pacientes', value: 156, icon: 'U', bg: Colors.accent },
    { label: 'Consultas', value: 89, icon: 'C', bg: Colors.successLight },
  ];

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.admin} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>Painel Admin</Text>
            <Text style={styles.userName}>{user?.nome || 'Administrador'}</Text>
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
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.admin} />
        }
      >
        {/* Stats grid */}
        <View style={styles.statsGrid}>
          {stats.map((stat, i) => (
            <View key={i} style={styles.statCard}>
              <View style={[styles.statIconBg, { backgroundColor: stat.bg }]}>
                <Text style={styles.statIcon}>{stat.icon}</Text>
              </View>
              <Text style={styles.statNum}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Pending Doctors */}
        <Text style={styles.sectionTitle}>Médicos Pendentes</Text>

        {pendentes.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyIcon}>—</Text>
            <Text style={styles.emptyText}>Nenhum médico pendente de aprovação</Text>
          </View>
        ) : (
          pendentes.map((medico) => (
            <View key={medico.id} style={styles.pendingCard}>
              <View style={styles.pendingTop}>
                <View style={styles.pendingAvatar}>
                  <Text style={styles.pendingInitial}>
                    {medico.usuario.nome.charAt(0).toUpperCase()}
                  </Text>
                </View>
                <View style={styles.pendingInfo}>
                  <Text style={styles.pendingName}>{medico.usuario.nome}</Text>
                  <Text style={styles.pendingEmail}>{medico.usuario.email}</Text>
                  <Text style={styles.pendingCrm}>CRM: {medico.crm}</Text>
                  {medico.especialidades?.length > 0 && (
                    <Text style={styles.pendingSpec}>
                      {medico.especialidades.join(', ')}
                    </Text>
                  )}
                </View>
              </View>
              <View style={styles.pendingActions}>
                {actionLoading === medico.id ? (
                  <ActivityIndicator color={Colors.admin} />
                ) : (
                  <>
                    <TouchableOpacity
                      style={styles.approveBtn}
                      onPress={() => handleAprovar(medico.id)}
                    >
                      <Text style={styles.approveBtnText}>Aprovar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.rejectBtn}
                      onPress={() => handleRecusar(medico.id)}
                    >
                      <Text style={styles.rejectBtnText}>Recusar</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </View>
          ))
        )}

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Ações Rápidas</Text>
        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.quickAction}>
            <View style={[styles.quickIconBg, { backgroundColor: Colors.adminLight }]}>
              <Text style={styles.quickIcon}>U</Text>
            </View>
            <Text style={styles.quickLabel}>Gerenciar Usuários</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickAction}>
            <View style={[styles.quickIconBg, { backgroundColor: Colors.warningLight }]}>
              <Text style={styles.quickIcon}>R</Text>
            </View>
            <Text style={styles.quickLabel}>Relatórios</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickAction}
            onPress={() => navigation.navigate('Profile')}
          >
            <View style={[styles.quickIconBg, { backgroundColor: Colors.accent }]}>
              <Text style={styles.quickIcon}>C</Text>
            </View>
            <Text style={styles.quickLabel}>Configurações</Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.bg,
  },
  header: {
    backgroundColor: Colors.admin,
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
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 24,
  },
  statCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 14,
    width: '48%',
    alignItems: 'center',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    flexGrow: 1,
    flexBasis: '45%',
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
  /* Empty */
  emptyCard: {
    backgroundColor: Colors.card,
    borderRadius: 18,
    padding: 32,
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  /* Pending card */
  pendingCard: {
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
  pendingTop: {
    flexDirection: 'row',
    marginBottom: 14,
  },
  pendingAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.adminLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  pendingInitial: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.admin,
  },
  pendingInfo: {
    flex: 1,
  },
  pendingName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  pendingEmail: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  pendingCrm: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
    fontWeight: '600',
  },
  pendingSpec: {
    fontSize: 12,
    color: Colors.admin,
    marginTop: 4,
    fontWeight: '600',
  },
  pendingActions: {
    flexDirection: 'row',
    gap: 10,
  },
  approveBtn: {
    flex: 1,
    backgroundColor: Colors.success,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  approveBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  rejectBtn: {
    flex: 1,
    backgroundColor: Colors.errorLight,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  rejectBtnText: {
    color: Colors.error,
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
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
});
