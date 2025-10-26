// src/pages/Rutinas.tsx
import React, { useEffect, useState } from "react";
import { getUserPlan } from "../services/planService";

interface Plan {
  objetivo: string;
  rutina: string[];
  alimentacion: string[];
}

const Rutinas: React.FC = () => {
  const [plan, setPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ⚙️ Simulamos un UID del usuario (en tu proyecto real puede venir de Firebase Auth)
  const uid = localStorage.getItem("uid") || "test-user";

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const data = await getUserPlan(uid);
        setPlan(data);
      } catch (err: any) {
        setError(err.response?.data?.error || "Error al cargar el plan");
      } finally {
        setLoading(false);
      }
    };

    fetchPlan();
  }, [uid]);

  if (loading) return <p className="text-center mt-10">⏳ Cargando plan...</p>;
  if (error) return <p className="text-red-600 text-center mt-10">{error}</p>;
  if (!plan) return <p className="text-center mt-10">No se encontró un plan asignado.</p>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-2xl mt-10">
      <h1 className="text-2xl font-bold text-center mb-4">
        🏋️ Rutina y Plan de Alimentación
      </h1>

      <h2 className="text-xl font-semibold text-blue-700 mb-2">
        Objetivo: {plan.objetivo.replace("_", " ")}
      </h2>

      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-1">Rutina:</h3>
        <ul className="list-disc list-inside text-gray-600">
          {plan.rutina.map((ejercicio, index) => (
            <li key={index}>{ejercicio}</li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-1">Alimentación:</h3>
        <ul className="list-disc list-inside text-gray-600">
          {plan.alimentacion.map((comida, index) => (
            <li key={index}>{comida}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Rutinas;
