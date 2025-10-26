// src/services/functions.js
import { getFunctions, httpsCallable } from "firebase/functions";
import { app } from "../firebaseConfig"; // ajusta la ruta si tu archivo se llama distinto

const functions = getFunctions(app);

export const generatePlan = async (userData) => {
  try {
    const fn = httpsCallable(functions, "generatePlan");
    const result = await fn(userData);
    return result.data;
  } catch (error) {
    console.error("Error al generar el plan:", error);
    throw error;
  }
};

export const getUserPlan = async (uid) => {
  try {
    const fn = httpsCallable(functions, "getUserPlan");
    const result = await fn({ uid });
    return result.data;
  } catch (error) {
    console.error("Error al obtener el plan:", error);
    throw error;
  }
};
