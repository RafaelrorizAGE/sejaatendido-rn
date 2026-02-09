import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = '@token';
const REFRESH_TOKEN_KEY = '@refreshToken';
const USER_KEY = '@user';

async function secureSetItem(key: string, value: string): Promise<void> {
  try {
    await SecureStore.setItemAsync(key, value, {
      keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
    });
  } catch {
    await AsyncStorage.setItem(key, value);
  }
}

async function secureGetItem(key: string): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(key);
  } catch {
    return await AsyncStorage.getItem(key);
  }
}

async function secureDeleteItem(key: string): Promise<void> {
  try {
    await SecureStore.deleteItemAsync(key);
  } catch {
    await AsyncStorage.removeItem(key);
  }
}

export interface User {
  id: string;
  nome: string;
  email: string;
  tipo: 'PACIENTE' | 'MEDICO' | 'ADMIN';
}

// ============ TOKEN ============
export async function saveToken(token: string): Promise<void> {
  await secureSetItem(TOKEN_KEY, token);
}

export async function getToken(): Promise<string | null> {
  return secureGetItem(TOKEN_KEY);
}

export async function removeToken(): Promise<void> {
  await secureDeleteItem(TOKEN_KEY);
}

// ============ REFRESH TOKEN ============
export async function saveRefreshToken(refreshToken: string): Promise<void> {
  await secureSetItem(REFRESH_TOKEN_KEY, refreshToken);
}

export async function getRefreshToken(): Promise<string | null> {
  return secureGetItem(REFRESH_TOKEN_KEY);
}

export async function removeRefreshToken(): Promise<void> {
  await secureDeleteItem(REFRESH_TOKEN_KEY);
}

// ============ USER ============
export async function saveUser(user: User): Promise<void> {
  await secureSetItem(USER_KEY, JSON.stringify(user));
}

export async function getUser(): Promise<User | null> {
  const data = await secureGetItem(USER_KEY);
  return data ? JSON.parse(data) : null;
}

export async function removeUser(): Promise<void> {
  await secureDeleteItem(USER_KEY);
}

// ============ CLEAR ALL ============
export async function clearAll(): Promise<void> {
  await Promise.all([
    secureDeleteItem(TOKEN_KEY),
    secureDeleteItem(REFRESH_TOKEN_KEY),
    secureDeleteItem(USER_KEY),
  ]);

  await AsyncStorage.multiRemove([TOKEN_KEY, REFRESH_TOKEN_KEY, USER_KEY]);
}

// ============ AUTH SESSION ============
export async function saveAuthSession(
  token: string,
  user: User,
  refreshToken?: string
): Promise<void> {
  await Promise.all([
    saveToken(token),
    refreshToken ? saveRefreshToken(refreshToken) : Promise.resolve(),
    saveUser(user),
  ]);
}

export async function getAuthSession(): Promise<{ token: string | null; user: User | null }> {
  const [token, user] = await Promise.all([
    getToken(),
    getUser(),
  ]);
  return { token, user };
}

export async function clearAuthSession(): Promise<void> {
  await clearAll();
}
