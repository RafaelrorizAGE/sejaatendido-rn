import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const api = axios.create({
  baseURL: "https://your-backend.example.com/api", // <-- ajuste para seu backend
  timeout: 10000
});

export async function loginRequest(email: string, password: string) {
  const resp = await api.post("/auth/login", { email, password });
  return resp.data; // espera { token, user } ou ajuste conforme backend
}

async function authHeaders() {
  const token = await AsyncStorage.getItem("@token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function fetchItems() {
  const headers = await authHeaders();
  const resp = await api.get("/items", { headers }); // ajuste rota
  return resp.data;
}
