import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { fetchMedicos, createConsulta, Medico } from '../services/api';
import { showErrorAlert } from '../utils/errorHandler';
import Colors from '../theme/colors';

const TIME_SLOTS = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
];

export default function BookAppointment({ navigation }: any) {
  const [medicos, setMedicos] = useState<Medico[]>([]);
  const [selectedMedico, setSelectedMedico] = useState<Medico | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [motivo, setMotivo] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const dates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    return d;
  });

  useEffect(() => {
    loadMedicos();
  }, []);

  async function loadMedicos() {
    try {
      const data = await fetchMedicos();
      setMedicos(data);
    } catch (error) {
      showErrorAlert(error, 'Erro ao carregar médicos');
    } finally {
      setLoading(false);
    }
  }

  async function handleConfirm() {
    if (!selectedMedico || !selectedDate || !selectedTime) {
      Alert.alert('Atenção', 'Selecione médico, data e horário');
      return;
    }

    const dateObj = new Date(selectedDate);
    const [hours, minutes] = selectedTime.split(':');
    dateObj.setHours(parseInt(hours), parseInt(minutes), 0, 0);

    setSubmitting(true);
    try {
      await createConsulta({
        medicoId: selectedMedico.id,
        data: dateObj.toISOString(),
        motivo: motivo || 'Consulta geral',
      });
      Alert.alert('Sucesso', 'Consulta agendada com sucesso!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      showErrorAlert(error, 'Erro ao agendar consulta');
    } finally {
      setSubmitting(false);
    }
  }

  function formatDateShort(d: Date) {
    const dias = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    return {
      dia: dias[d.getDay()],
      num: d.getDate().toString().padStart(2, '0'),
      mes: (d.getMonth() + 1).toString().padStart(2, '0'),
    };
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Carregando médicos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Agendar Consulta</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Step 1: Select Doctor */}
        <Text style={styles.stepTitle}>Escolha o Médico</Text>
        <FlatList
          horizontal
          data={medicos}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.doctorList}
          scrollEnabled={true}
          renderItem={({ item }) => {
            const isSelected = selectedMedico?.id === item.id;
            return (
              <TouchableOpacity
                style={[styles.doctorCard, isSelected && styles.doctorCardSelected]}
                onPress={() => setSelectedMedico(item)}
              >
                <View style={[styles.doctorAvatar, isSelected && styles.doctorAvatarSelected]}>
                  <Text style={styles.doctorInitial}>
                    {item.usuario.nome.charAt(0).toUpperCase()}
                  </Text>
                </View>
                <Text
                  style={[styles.doctorName, isSelected && styles.doctorNameSelected]}
                  numberOfLines={1}
                >
                  Dr(a). {item.usuario.nome}
                </Text>
                <Text style={[styles.doctorSpec, isSelected && styles.doctorSpecSelected]}>
                  {item.especialidades?.[0] || 'Clínico Geral'}
                </Text>
              </TouchableOpacity>
            );
          }}
        />

        {/* Step 2: Select Date */}
        <Text style={styles.stepTitle}>Data</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dateScroll}>
          {dates.map((d) => {
            const formatted = formatDateShort(d);
            const iso = d.toISOString().split('T')[0];
            const isSelected = selectedDate === iso;
            return (
              <TouchableOpacity
                key={iso}
                style={[styles.dateCard, isSelected && styles.dateCardSelected]}
                onPress={() => setSelectedDate(iso)}
              >
                <Text style={[styles.dateDia, isSelected && styles.dateTextSelected]}>
                  {formatted.dia}
                </Text>
                <Text style={[styles.dateNum, isSelected && styles.dateTextSelected]}>
                  {formatted.num}
                </Text>
                <Text style={[styles.dateMes, isSelected && styles.dateTextSelected]}>
                  {formatted.mes}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Step 3: Select Time */}
        <Text style={styles.stepTitle}>Horário</Text>
        <View style={styles.timeGrid}>
          {TIME_SLOTS.map((slot) => {
            const isSelected = selectedTime === slot;
            return (
              <TouchableOpacity
                key={slot}
                style={[styles.timeSlot, isSelected && styles.timeSlotSelected]}
                onPress={() => setSelectedTime(slot)}
              >
                <Text style={[styles.timeText, isSelected && styles.timeTextSelected]}>
                  {slot}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Step 4: Reason */}
        <Text style={styles.stepTitle}>Motivo (opcional)</Text>
        <TextInput
          style={styles.motivoInput}
          value={motivo}
          onChangeText={setMotivo}
          placeholder="Descreva brevemente o motivo da consulta..."
          placeholderTextColor={Colors.textMuted}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
        />

        {/* Confirm */}
        <TouchableOpacity
          style={[styles.confirmButton, submitting && styles.confirmButtonDisabled]}
          onPress={handleConfirm}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.confirmButtonText}>Confirmar Agendamento</Text>
          )}
        </TouchableOpacity>

        <View style={{ height: 40 }} />
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
  loadingText: {
    marginTop: 12,
    color: Colors.textSecondary,
    fontSize: 15,
  },
  header: {
    backgroundColor: Colors.primary,
    padding: 16,
    paddingTop: 52,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  backButton: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  stepTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginTop: 20,
    marginBottom: 12,
    letterSpacing: -0.3,
  },
  /* Doctor cards */
  doctorList: {
    paddingRight: 20,
  },
  doctorCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    marginRight: 12,
    width: 130,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.border,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  doctorCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.accent,
  },
  doctorAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.inputBg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  doctorAvatarSelected: {
    backgroundColor: Colors.primary,
  },
  doctorInitial: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  doctorName: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  doctorNameSelected: {
    color: Colors.primary,
  },
  doctorSpec: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
    textAlign: 'center',
  },
  doctorSpecSelected: {
    color: Colors.primaryDark,
  },
  /* Date cards */
  dateScroll: {
    marginBottom: 4,
  },
  dateCard: {
    backgroundColor: Colors.card,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginRight: 10,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.border,
    minWidth: 64,
  },
  dateCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary,
  },
  dateDia: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  dateNum: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginVertical: 2,
  },
  dateMes: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  dateTextSelected: {
    color: '#fff',
  },
  /* Time slots */
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  timeSlot: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderColor: Colors.border,
    minWidth: 72,
    alignItems: 'center',
  },
  timeSlotSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary,
  },
  timeText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  timeTextSelected: {
    color: '#fff',
  },
  /* Motivo */
  motivoInput: {
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 16,
    fontSize: 15,
    borderWidth: 1,
    borderColor: Colors.border,
    color: Colors.textPrimary,
    minHeight: 80,
  },
  /* Confirm */
  confirmButton: {
    backgroundColor: Colors.primary,
    borderRadius: 14,
    padding: 18,
    alignItems: 'center',
    marginTop: 28,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  confirmButtonDisabled: {
    opacity: 0.6,
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
});
