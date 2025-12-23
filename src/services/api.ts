import axios, { AxiosHeaders } from 'axios';
import { clearAuthSession, getToken } from '../storage/asyncStorage';

const DEV_API_URL = 'http://localhost:3001';
const ENV_API_URL = (process.env.EXPO_PUBLIC_API_URL ?? '').trim();

// Prefer env var; fallback to localhost only in dev.
const API_URL = ENV_API_URL || (__DEV__ ? DEV_API_URL : '');

if (!API_URL) {
  // Fail closed in production builds if API URL is missing.
  // This prevents accidentally shipping a build that talks to nowhere or to an insecure endpoint.
  if (!__DEV__) {
    throw new Error('Missing EXPO_PUBLIC_API_URL for production build');
  }
}

if (!__DEV__ && API_URL && !API_URL.startsWith('https://')) {
  throw new Error('In production, EXPO_PUBLIC_API_URL must use https://');
}

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
    const token = await getToken();
    if (token) {
      if (!config.headers) {
        config.headers = new AxiosHeaders();
      }

      if (config.headers instanceof AxiosHeaders) {
        config.headers.set('Authorization', `Bearer ${token}`);
      } else {
        (config.headers as any).Authorization = `Bearer ${token}`;
      }
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
      await clearAuthSession();
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

export async function confirmEmailRequest(token: string): Promise<void> {
  try {
    await api.post('/auth/confirmar-email', { token });
  } catch (error: any) {
    if (error?.response?.status === 404) {
      await api.post('/auth/confirm-email', { token });
      return;
    }
    throw error;
  }
}

export async function resetPasswordRequest(token: string, senha: string): Promise<void> {
  const payload = {
    token,
    senha,
    novaSenha: senha,
    password: senha,
    newPassword: senha,
  };

  try {
    await api.post('/auth/resetar-senha', payload);
  } catch (error: any) {
    if (error?.response?.status === 404) {
      await api.post('/auth/reset-password', payload);
      return;
    }
    throw error;
  }
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
