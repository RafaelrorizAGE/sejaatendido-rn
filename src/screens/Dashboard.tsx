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
import { fetchMinhasConsultas, Consulta } from '../services/api';
import { clearAuthSession, getUser } from '../storage/asyncStorage';

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
    } catch (error: any) {
      console.error('Erro ao carregar consultas:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  async function handleLogout() {
    Alert.alert(
      'Sair',
      'Tem certeza que deseja sair?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: async () => {
            await clearAuthSession();
            navigation.replace('Login');
          },
        },
      ]
    );
  }

  function onRefresh() {
    setRefreshing(true);
    loadData();
  }

  function getStatusColor(status: string) {
    switch (status.toLowerCase()) {
      case 'confirmado':
      case 'realizada':
        return '#4CAF50';
      case 'pendente':
        return '#FF9800';
      case 'cancelada':
        return '#F44336';
      default:
        return '#9E9E9E';
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
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Olá, {userName}!</Text>
          <Text style={styles.subtitle}>Bem-vindo de volta</Text>
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
        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Ações Rápidas</Text>
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('BookAppointment')}
          >
            <Text style={styles.actionIcon}>📅</Text>
            <Text style={styles.actionText}>Agendar Consulta</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('Profile')}
          >
            <Text style={styles.actionIcon}>👤</Text>
            <Text style={styles.actionText}>Meu Perfil</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('Chat')}
          >
            <Text style={styles.actionIcon}>💬</Text>
            <Text style={styles.actionText}>Chat</Text>
          </TouchableOpacity>
        </View>

        {/* Upcoming Appointments */}
        <Text style={styles.sectionTitle}>Próximas Consultas</Text>
        {consultas.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📋</Text>
            <Text style={styles.emptyText}>Nenhuma consulta agendada</Text>
            <TouchableOpacity
              style={styles.emptyButton}
              onPress={() => navigation.navigate('BookAppointment')}
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
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: getStatusColor(consulta.status) },
                  ]}
                >
                  <Text style={styles.statusText}>{consulta.status}</Text>
                </View>
              </View>
              <Text style={styles.consultaMotivo}>{consulta.motivo}</Text>
              <Text style={styles.consultaDate}>
                📅 {formatDate(consulta.data)}
              </Text>
              {consulta.meetLink && (
                <TouchableOpacity style={styles.meetButton}>
                  <Text style={styles.meetButtonText}>🎥 Entrar na consulta</Text>
                </TouchableOpacity>
              )}
            </View>
          ))
        )}
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
    backgroundColor: '#007AFF',
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    marginTop: 8,
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
    marginBottom: 16,
  },
  emptyButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyButtonText: {
    color: '#fff',
    fontWeight: '600',
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  consultaDoctor: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
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
  consultaMotivo: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  consultaDate: {
    fontSize: 14,
    color: '#007AFF',
  },
  meetButton: {
    backgroundColor: '#E3F2FD',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
    alignItems: 'center',
  },
  meetButtonText: {
    color: '#007AFF',
    fontWeight: '600',
  },
});
