import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = '@token';
const USER_KEY = '@user';

export interface User {
  id: string;
  nome: string;
  email: string;
  tipo: 'PACIENTE' | 'MEDICO' | 'ADMIN';
}

// ============ TOKEN ============
export async function saveToken(token: string): Promise<void> {
  await AsyncStorage.setItem(TOKEN_KEY, token);
}

export async function getToken(): Promise<string | null> {
  return AsyncStorage.getItem(TOKEN_KEY);
}

export async function removeToken(): Promise<void> {
  await AsyncStorage.removeItem(TOKEN_KEY);
}

// ============ USER ============
export async function saveUser(user: User): Promise<void> {
  await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
}

export async function getUser(): Promise<User | null> {
  const data = await AsyncStorage.getItem(USER_KEY);
  return data ? JSON.parse(data) : null;
}

export async function removeUser(): Promise<void> {
  await AsyncStorage.removeItem(USER_KEY);
}

// ============ CLEAR ALL ============
export async function clearAll(): Promise<void> {
  await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
}

// ============ AUTH SESSION ============
export async function saveAuthSession(token: string, user: User): Promise<void> {
  await Promise.all([
    saveToken(token),
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
