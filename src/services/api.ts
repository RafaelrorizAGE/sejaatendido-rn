import axios, { AxiosHeaders } from 'axios';
import { API_URL } from '../config/api';
import {
  clearAuthSession,
  getRefreshToken,
  getToken,
  saveRefreshToken,
  saveToken,
} from '../storage/asyncStorage';

if (!__DEV__ && API_URL && !API_URL.startsWith('https://')) {
  throw new Error('In production, API_URL must use https://');
}

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

type RetriableAxiosRequestConfig = {
  _retry?: boolean;
} & Parameters<typeof api.request>[0];

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

    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.log(`→ ${(config.method ?? 'GET').toUpperCase()} ${config.url}`);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor: Trata erros globalmente
api.interceptors.response.use(
  (response) => {
    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.log(
        `✅ ${(response.config.method ?? 'GET').toUpperCase()} ${response.config.url} - ${response.status}`
      );
    }
    return response;
  },
  async (error) => {
    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.log(
        `❌ ${(error.config?.method ?? 'GET').toUpperCase()} ${error.config?.url} - ${error.response?.status ?? 'NO_STATUS'}`
      );
    }

    const status: number | undefined = error.response?.status;
    const originalConfig = error.config as RetriableAxiosRequestConfig | undefined;

    // If unauthorized, try refresh once.
    if (status === 401 && originalConfig && !originalConfig._retry) {
      originalConfig._retry = true;

      try {
        const refreshToken = await getRefreshToken();

        if (!refreshToken) {
          await clearAuthSession();
          return Promise.reject(error);
        }

        const refreshResponse = await axios.post(
          `${API_URL}/auth/refresh`,
          { refreshToken },
          {
            timeout: 10000,
            headers: { 'Content-Type': 'application/json' },
          }
        );

        const accessToken: string | undefined =
          refreshResponse.data?.accessToken ??
          refreshResponse.data?.token;

        const newRefreshToken: string | undefined =
          refreshResponse.data?.refreshToken;

        if (!accessToken) {
          await clearAuthSession();
          return Promise.reject(error);
        }

        await saveToken(accessToken);
        if (newRefreshToken) {
          await saveRefreshToken(newRefreshToken);
        }

        if (!originalConfig.headers) {
          originalConfig.headers = new AxiosHeaders();
        }

        if (originalConfig.headers instanceof AxiosHeaders) {
          originalConfig.headers.set('Authorization', `Bearer ${accessToken}`);
        } else {
          (originalConfig.headers as any).Authorization = `Bearer ${accessToken}`;
        }

        return api.request(originalConfig);
      } catch {
        await clearAuthSession();
        return Promise.reject(error);
      }
    }

    if (status === 401) {
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
  refreshToken?: string;
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

// ============ PAGAMENTOS ============
export type MetodoPagamento = 'pix' | 'cartao' | 'card';

export interface CriarPagamentoRequest {
  consultaId: string;
  metodoPagamento?: MetodoPagamento;
}

export interface PagamentoResponse {
  id: string;
  status?: string;
  qrCode?: string;
  qrCodeBase64?: string;
  copiaCola?: string;
  copiaECola?: string;
  linkPagamento?: string;
  paymentUrl?: string;
}

export async function criarPagamento(
  data: CriarPagamentoRequest
): Promise<PagamentoResponse> {
  const response = await api.post('/pagamentos', data);
  return response.data;
}

export async function fetchPagamentoById(id: string): Promise<PagamentoResponse> {
  const response = await api.get(`/pagamentos/${id}`);
  return response.data;
}

export default api;
