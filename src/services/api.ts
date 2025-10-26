// src/services/api.ts
import axios from "axios";

// URL base del backend (puerto 4000)
const API_URL = "http://localhost:4000";

// Se crea una instancia de Axios configurada
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Pequeña función para probar la conexión
export const testConnection = async () => {
  try {
    const response = await api.get("/");
    console.log("✅ Backend conectado correctamente:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ No se pudo conectar al backend:", error);
    throw error;
  }
};

export default api;
