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
import { clearAuthSession, getUser } from '../storage/asyncStorage';

interface Consulta {
  id: string;
  paciente: string;
  hora: string;
  tipo: string;
  status: string;
}

export default function DoctorDashboard({ navigation }: any) {
  const [consultas, setConsultas] = useState<Consulta[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userName, setUserName] = useState('');
  const [stats, setStats] = useState({
    totalPacientes: 0,
    consultasHoje: 0,
    pendentes: 0,
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
      // Simular dados - substituir por chamada API real
      setConsultas([
        { id: '1', paciente: 'Maria Silva', hora: '09:00', tipo: 'Consulta', status: 'confirmado' },
        { id: '2', paciente: 'João Santos', hora: '10:30', tipo: 'Retorno', status: 'confirmado' },
        { id: '3', paciente: 'Ana Costa', hora: '14:00', tipo: 'Primeira consulta', status: 'pendente' },
      ]);
      setStats({
        totalPacientes: 156,
        consultasHoje: 8,
        pendentes: 3,
      });
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  async function handleLogout() {
    Alert.alert('Sair', 'Tem certeza que deseja sair?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: async () => {
          await clearAuthSession();
          navigation.replace('Login');
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
        return '#4CAF50';
      case 'pendente':
        return '#FF9800';
      case 'cancelada':
        return '#F44336';
      default:
        return '#9E9E9E';
    }
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Dr. {userName}</Text>
          <Text style={styles.subtitle}>Área do Médico</Text>
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
            <Text style={styles.statNumber}>{stats.totalPacientes}</Text>
            <Text style={styles.statLabel}>Pacientes</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.consultasHoje}</Text>
            <Text style={styles.statLabel}>Hoje</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.pendentes}</Text>
            <Text style={styles.statLabel}>Pendentes</Text>
          </View>
        </View>

        {/* Today's Appointments */}
        <Text style={styles.sectionTitle}>Consultas de Hoje</Text>
        {consultas.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📋</Text>
            <Text style={styles.emptyText}>Nenhuma consulta hoje</Text>
          </View>
        ) : (
          consultas.map((consulta) => (
            <View key={consulta.id} style={styles.consultaCard}>
              <View style={styles.consultaHeader}>
                <View style={styles.consultaTime}>
                  <Text style={styles.timeText}>{consulta.hora}</Text>
                </View>
                <View style={styles.consultaInfo}>
                  <Text style={styles.pacienteName}>{consulta.paciente}</Text>
                  <Text style={styles.consultaTipo}>{consulta.tipo}</Text>
                </View>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: getStatusColor(consulta.status) },
                  ]}
                >
                  <Text style={styles.statusText}>{consulta.status}</Text>
                </View>
              </View>
              <View style={styles.consultaActions}>
                <TouchableOpacity style={styles.actionButton}>
                  <Text style={styles.actionButtonText}>Ver detalhes</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionButton, styles.primaryButton]}>
                  <Text style={styles.primaryButtonText}>Iniciar consulta</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Ações Rápidas</Text>
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('Profile')}
          >
            <Text style={styles.actionIcon}>👤</Text>
            <Text style={styles.actionText}>Meu Perfil</Text>
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
    backgroundColor: '#4CAF50',
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
    marginBottom: 24,
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    marginTop: 8,
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
  },
  consultaCard: {
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
  consultaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  consultaTime: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 12,
  },
  timeText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  consultaInfo: {
    flex: 1,
  },
  pacienteName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  consultaTipo: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  consultaActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  actionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  actionButtonText: {
    color: '#666',
    fontWeight: '600',
  },
  primaryButton: {
    backgroundColor: '#4CAF50',
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
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
