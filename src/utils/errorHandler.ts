import axios from 'axios';
import { Alert } from 'react-native';

function extractMessage(data: unknown): string | undefined {
  if (!data || typeof data !== 'object') return undefined;

  const anyData = data as any;
  return (
    anyData?.message ??
    anyData?.erro ??
    anyData?.error ??
    anyData?.detail
  );
}

export const handleApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const messageFromApi = extractMessage(error.response?.data);

    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.error(`[API Error ${status ?? 'NO_STATUS'}]`, {
        url: error.config?.url,
        method: error.config?.method,
        messageFromApi,
      });
    }

    if (status === 401) return 'Sessão expirada. Faça login novamente.';
    if (status === 403) return 'Você não tem permissão para realizar esta ação.';
    if (status === 404) return 'Recurso não encontrado.';
    if (status === 429) return 'Muitas requisições. Aguarde um momento.';
    if (status && status >= 500) return 'Erro no servidor. Tente novamente mais tarde.';

    return messageFromApi ?? 'Erro ao conectar com o servidor';
  }

  return 'Erro inesperado. Verifique sua conexão.';
};

export const showErrorAlert = (error: unknown, title: string = 'Erro') => {
  const message = handleApiError(error);
  Alert.alert(title, message);
};
