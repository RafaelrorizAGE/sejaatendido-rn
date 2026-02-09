import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { fetchMedicos, createConsulta, Medico } from '../services/api';
import { showErrorAlert } from '../utils/errorHandler';

export default function BookAppointment({ navigation }: any) {
  const [medicos, setMedicos] = useState<Medico[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMedico, setSelectedMedico] = useState<Medico | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [motivo, setMotivo] = useState('');
  const [booking, setBooking] = useState(false);

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30',
  ];

  const getNextDays = () => {
    const days = [];
    const today = new Date();
    for (let i = 1; i <= 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      days.push({
        date: date.toISOString().split('T')[0],
        label: date.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: '2-digit' }),
      });
    }
    return days;
  };

  useEffect(() => {
    loadMedicos();
  }, []);

  async function loadMedicos() {
    try {
      const data = await fetchMedicos();
      setMedicos(data);
    } catch (error) {
      if (__DEV__) console.error('Erro ao carregar médicos:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleBookAppointment() {
    if (!selectedMedico || !selectedDate || !selectedTime) {
      Alert.alert('Erro', 'Selecione médico, data e horário');
      return;
    }

    setBooking(true);
    try {
      const dateTime = `${selectedDate}T${selectedTime}:00`;
      await createConsulta({
        medicoId: selectedMedico.id,
        data: dateTime,
        motivo: motivo || 'Consulta',
      });
      Alert.alert('Sucesso!', 'Consulta agendada com sucesso!', [
        { text: 'OK', onPress: () => navigation.navigate('Dashboard') },
      ]);
    } catch (error: unknown) {
      showErrorAlert(error, 'Erro ao agendar consulta');
    } finally {
      setBooking(false);
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
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Agendar Consulta</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView style={styles.content}>
        {/* Step 1: Select Doctor */}
        <Text style={styles.sectionTitle}>1. Escolha o Médico</Text>
        {medicos.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Nenhum médico disponível</Text>
          </View>
        ) : (
          medicos.map((medico) => (
            <TouchableOpacity
              key={medico.id}
              style={[
                styles.medicoCard,
                selectedMedico?.id === medico.id && styles.medicoCardSelected,
              ]}
              onPress={() => setSelectedMedico(medico)}
            >
              <View style={styles.medicoAvatar}>
                <Text style={styles.avatarText}>
                  {medico.usuario?.nome?.charAt(0) || 'M'}
                </Text>
              </View>
              <View style={styles.medicoInfo}>
                <Text style={styles.medicoNome}>{medico.usuario?.nome}</Text>
                <Text style={styles.medicoCRM}>CRM: {medico.crm}</Text>
                <View style={styles.especialidadesRow}>
                  {medico.especialidades?.slice(0, 2).map((esp, idx) => (
                    <View key={idx} style={styles.especialidadeBadge}>
                      <Text style={styles.especialidadeText}>{esp}</Text>
                    </View>
                  ))}
                </View>
              </View>
              {selectedMedico?.id === medico.id && (
                <Text style={styles.checkmark}>✓</Text>
              )}
            </TouchableOpacity>
          ))
        )}

        {/* Step 2: Select Date */}
        <Text style={styles.sectionTitle}>2. Escolha a Data</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.datesContainer}>
          {getNextDays().map((day) => (
            <TouchableOpacity
              key={day.date}
              style={[
                styles.dateCard,
                selectedDate === day.date && styles.dateCardSelected,
              ]}
              onPress={() => setSelectedDate(day.date)}
            >
              <Text
                style={[
                  styles.dateText,
                  selectedDate === day.date && styles.dateTextSelected,
                ]}
              >
                {day.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Step 3: Select Time */}
        <Text style={styles.sectionTitle}>3. Escolha o Horário</Text>
        <View style={styles.timesContainer}>
          {timeSlots.map((time) => (
            <TouchableOpacity
              key={time}
              style={[
                styles.timeCard,
                selectedTime === time && styles.timeCardSelected,
              ]}
              onPress={() => setSelectedTime(time)}
            >
              <Text
                style={[
                  styles.timeText,
                  selectedTime === time && styles.timeTextSelected,
                ]}
              >
                {time}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Book Button */}
        <TouchableOpacity
          style={[
            styles.bookButton,
            (!selectedMedico || !selectedDate || !selectedTime || booking) &&
              styles.bookButtonDisabled,
          ]}
          onPress={handleBookAppointment}
          disabled={!selectedMedico || !selectedDate || !selectedTime || booking}
        >
          {booking ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.bookButtonText}>Confirmar Agendamento</Text>
          )}
        </TouchableOpacity>
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
    padding: 16,
    paddingTop: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    color: '#fff',
    fontSize: 16,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    marginBottom: 12,
  },
  emptyState: {
    padding: 24,
    backgroundColor: '#fff',
    borderRadius: 12,
    alignItems: 'center',
  },
  emptyText: {
    color: '#666',
  },
  medicoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  medicoCardSelected: {
    borderColor: '#007AFF',
    backgroundColor: '#E3F2FD',
  },
  medicoAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  medicoInfo: {
    flex: 1,
  },
  medicoNome: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  medicoCRM: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  especialidadesRow: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 8,
  },
  especialidadeBadge: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  especialidadeText: {
    color: '#007AFF',
    fontSize: 12,
  },
  checkmark: {
    color: '#007AFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  datesContainer: {
    marginBottom: 8,
  },
  dateCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginRight: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  dateCardSelected: {
    borderColor: '#007AFF',
    backgroundColor: '#E3F2FD',
  },
  dateText: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
  dateTextSelected: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
  timesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  timeCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  timeCardSelected: {
    borderColor: '#007AFF',
    backgroundColor: '#E3F2FD',
  },
  timeText: {
    fontSize: 14,
    color: '#333',
  },
  timeTextSelected: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
  bookButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 32,
  },
  bookButtonDisabled: {
    opacity: 0.6,
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
