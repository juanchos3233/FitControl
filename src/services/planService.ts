// src/services/planService.ts
import api from "./api";

/* ---------------------- PLANES (Rutina + Alimentación) ---------------------- */

// 🟢 Obtener plan de un usuario
export const getUserPlan = async (uid: string) => {
  try {
    const response = await api.get(`/api/planes/${uid}`);
    console.log("✅ Plan obtenido correctamente:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("❌ Error al obtener el plan:", error.response?.data || error);
    throw error;
  }
};

// 🟢 Generar un nuevo plan para el usuario
export const generateUserPlan = async (data: {
  uid: string;
  objetivo: string;
  peso?: number;
  altura?: number;
  edad?: number;
  genero?: string;
}) => {
  try {
    const response = await api.post("/api/planes", data);
    console.log("✅ Plan generado correctamente:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("❌ Error al generar el plan:", error.response?.data || error);
    throw error;
  }
};

/* ---------------------- PERFIL DE USUARIO ---------------------- */

// 🟢 Obtener datos del perfil del usuario
export const getUserProfile = async (uid: string) => {
  try {
    const response = await api.get(`/api/usuarios/${uid}`);
    console.log("✅ Perfil obtenido correctamente:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("❌ Error al obtener el perfil:", error.response?.data || error);
    throw error;
  }
};

// 🟡 Actualizar el perfil del usuario
export const updateUserProfile = async (uid: string, data: any) => {
  try {
    const response = await api.put(`/api/usuarios/${uid}`, data);
    console.log("✅ Perfil actualizado correctamente:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("❌ Error al actualizar el perfil:", error.response?.data || error);
    throw error;
  }
};
