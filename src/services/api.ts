import axios from "axios";

// Lee del .env.local, si no existe usa 4000
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

export const testConnection = async () => {
  try {
    const response = await api.get("/");
    console.log("✅ Backend conectado:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ No se pudo conectar al backend:", error);
    throw error;
  }
};

export async function apiGenerateNutritionPlan(payload: {
  uid: string;
  goal: 'subir' | 'bajar' | 'mantener';
  profile: { sexo: 'M'|'F'; edad: number; peso: number; altura: number; actividad: 'sedentario'|'ligero'|'moderado'|'intenso'|'atleta'; };
}) {
  const { data } = await api.post('/api/nutrition/generate', payload);
  return data;
}

export async function apiGetCurrentPlan(uid: string) {
  const { data } = await api.get('/api/nutrition/current', { params: { uid } });
  return data;
}


export default api;
