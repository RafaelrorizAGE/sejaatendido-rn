import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ⚠️ ALTERAR PARA SUA URL DO RENDER QUANDO FIZER DEPLOY
const API_URL = __DEV__ 
  ? 'http://localhost:3001'  // Desenvolvimento local
  : 'https://seu-backend.onrender.com';  // Produção (alterar depois)

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor: Adiciona token automaticamente
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('@token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor: Trata erros globalmente
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expirado - fazer logout
      await AsyncStorage.removeItem('@token');
      await AsyncStorage.removeItem('@user');
    }
    return Promise.reject(error);
  }
);

// ============ AUTH ============
export interface LoginRequest {
  email: string;
  senha: string;
}

export interface RegisterRequest {
  nome: string;
  email: string;
  senha: string;
  tipo: 'PACIENTE' | 'MEDICO';
}

export interface AuthResponse {
  token: string;
  usuario: {
    id: string;
    nome: string;
    email: string;
    tipo: 'PACIENTE' | 'MEDICO' | 'ADMIN';
  };
}

export async function loginRequest(data: LoginRequest): Promise<AuthResponse> {
  const response = await api.post('/auth/login', data);
  return response.data;
}

export async function registerRequest(data: RegisterRequest): Promise<{ id: string }> {
  const response = await api.post('/auth/registro', data);
  return response.data;
}

export async function loginGoogleRequest(idToken: string): Promise<AuthResponse> {
  const response = await api.post('/auth/login-google', { idToken });
  return response.data;
}

// ============ MÉDICOS ============
export interface Medico {
  id: string;
  usuarioId: string;
  crm: string;
  especialidades: string[];
  aprovado: boolean;
  usuario: {
    id: string;
    nome: string;
    email: string;
  };
}

export async function fetchMedicos(): Promise<Medico[]> {
  const response = await api.get('/medicos');
  return response.data;
}

export async function fetchMedicoById(id: string): Promise<Medico> {
  const response = await api.get(`/medicos/${id}`);
  return response.data;
}

// ============ CONSULTAS (PACIENTE) ============
export interface Consulta {
  id: string;
  medicoId: string;
  pacienteId: string;
  data: string;
  motivo: string;
  status: string;
  meetLink?: string;
  medico?: Medico;
}

export interface CreateConsultaRequest {
  medicoId: string;
  data: string;
  motivo: string;
}

export async function fetchMinhasConsultas(): Promise<Consulta[]> {
  const response = await api.get('/paciente/consultas');
  return response.data;
}

export async function createConsulta(data: CreateConsultaRequest): Promise<Consulta> {
  const response = await api.post('/paciente/consultas', data);
  return response.data;
}

export async function cancelConsulta(id: string): Promise<void> {
  await api.delete(`/paciente/consultas/${id}`);
}

// ============ ADMIN ============
export async function fetchMedicosPendentes(): Promise<Medico[]> {
  const response = await api.get('/admin/medicos/pendentes');
  return response.data;
}

export async function aprovarMedico(id: string): Promise<void> {
  await api.post(`/admin/medicos/${id}/aprovar`);
}

export async function recusarMedico(id: string): Promise<void> {
  await api.post(`/admin/medicos/${id}/recusar`);
}

export default api;
