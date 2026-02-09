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
} from 'react-native';
import { fetchMedicosPendentes, aprovarMedico, recusarMedico, Medico } from '../services/api';
import { clearAuthSession, getUser } from '../storage/asyncStorage';
import { showErrorAlert } from '../utils/errorHandler';

export default function AdminDashboard({ navigation }: any) {
  const [medicosPendentes, setMedicosPendentes] = useState<Medico[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userName, setUserName] = useState('');
  const [stats, setStats] = useState({
    totalUsuarios: 0,
    medicosAtivos: 0,
    pacientes: 0,
    consultasHoje: 0,
  });

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
      const pendentes = await fetchMedicosPendentes();
      setMedicosPendentes(pendentes);
      
      // Simular stats - substituir por chamada API real
      setStats({
        totalUsuarios: 1247,
        medicosAtivos: 23,
        pacientes: 1224,
        consultasHoje: 67,
      });
    } catch (error) {
      if (__DEV__) console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  async function handleAprovarMedico(id: string) {
    Alert.alert('Aprovar Médico', 'Tem certeza que deseja aprovar este médico?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Aprovar',
        onPress: async () => {
          try {
            await aprovarMedico(id);
            Alert.alert('Sucesso', 'Médico aprovado com sucesso!');
            loadData();
          } catch (error) {
            showErrorAlert(error, 'Erro');
          }
        },
      },
    ]);
  }

  async function handleRecusarMedico(id: string) {
    Alert.alert('Recusar Médico', 'Tem certeza que deseja recusar este médico?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Recusar',
        style: 'destructive',
        onPress: async () => {
          try {
            await recusarMedico(id);
            Alert.alert('Sucesso', 'Médico recusado');
            loadData();
          } catch (error) {
            showErrorAlert(error, 'Erro');
          }
        },
      },
    ]);
  }

  async function handleLogout() {
    Alert.alert('Sair', 'Tem certeza que deseja sair?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: async () => {
          await clearAuthSession();
          navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          });
        },
      },
    ]);
  }

  function onRefresh() {
    setRefreshing(true);
    loadData();
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#9C27B0" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Admin {userName}</Text>
          <Text style={styles.subtitle}>Painel Administrativo</Text>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.totalUsuarios}</Text>
            <Text style={styles.statLabel}>Usuários</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.medicosAtivos}</Text>
            <Text style={styles.statLabel}>Médicos</Text>
          </View>
        </View>
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.pacientes}</Text>
            <Text style={styles.statLabel}>Pacientes</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.consultasHoje}</Text>
            <Text style={styles.statLabel}>Consultas Hoje</Text>
          </View>
        </View>

        {/* Pending Doctors */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Médicos Pendentes</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{medicosPendentes.length}</Text>
          </View>
        </View>

        {medicosPendentes.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>✅</Text>
            <Text style={styles.emptyText}>Nenhum médico pendente de aprovação</Text>
          </View>
        ) : (
          medicosPendentes.map((medico) => (
            <View key={medico.id} style={styles.medicoCard}>
              <View style={styles.medicoInfo}>
                <Text style={styles.medicoNome}>{medico.usuario?.nome}</Text>
                <Text style={styles.medicoCRM}>CRM: {medico.crm}</Text>
                <Text style={styles.medicoEmail}>{medico.usuario?.email}</Text>
                <View style={styles.especialidadesContainer}>
                  {medico.especialidades?.map((esp, index) => (
                    <View key={index} style={styles.especialidadeBadge}>
                      <Text style={styles.especialidadeText}>{esp}</Text>
                    </View>
                  ))}
                </View>
              </View>
              <View style={styles.medicoActions}>
                <TouchableOpacity
                  style={styles.recusarButton}
                  onPress={() => handleRecusarMedico(medico.id)}
                >
                  <Text style={styles.recusarText}>Recusar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.aprovarButton}
                  onPress={() => handleAprovarMedico(medico.id)}
                >
                  <Text style={styles.aprovarText}>Aprovar</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Ações Rápidas</Text>
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionCard}>
            <Text style={styles.actionIcon}>👥</Text>
            <Text style={styles.actionText}>Gerenciar Usuários</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard}>
            <Text style={styles.actionIcon}>📊</Text>
            <Text style={styles.actionText}>Relatórios</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard}>
            <Text style={styles.actionIcon}>⚙️</Text>
            <Text style={styles.actionText}>Configurações</Text>
          </TouchableOpacity>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#9C27B0',
    padding: 20,
    paddingTop: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  logoutButton: {
    padding: 8,
  },
  logoutText: {
    color: '#fff',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 8,
  },
  badge: {
    backgroundColor: '#9C27B0',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyState: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  medicoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  medicoInfo: {
    marginBottom: 12,
  },
  medicoNome: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  medicoCRM: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  medicoEmail: {
    fontSize: 14,
    color: '#888',
    marginTop: 2,
  },
  especialidadesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    gap: 8,
  },
  especialidadeBadge: {
    backgroundColor: '#E1BEE7',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  especialidadeText: {
    color: '#7B1FA2',
    fontSize: 12,
    fontWeight: '600',
  },
  medicoActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  recusarButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#FFEBEE',
  },
  recusarText: {
    color: '#F44336',
    fontWeight: '600',
  },
  aprovarButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#4CAF50',
  },
  aprovarText: {
    color: '#fff',
    fontWeight: '600',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    marginTop: 16,
  },
  actionCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  actionText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
});
