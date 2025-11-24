import { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

// Mapeo: texto del botón -> valor canónico que guardamos
const GOALS: Record<string, "bajar" | "mantener" | "subir"> = {
  "Bajar de peso": "bajar",
  "Mantener peso": "mantener",
  "Aumentar masa muscular": "subir",
};

export default function GoalSelection() {
  const [selectedGoal, setSelectedGoal] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  // 1) Esperar sesión
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      if (u) setUser(u);
      else navigate("/login", { replace: true });
    });
    return unsubscribe;
  }, [navigate]);

  // 2) Si ya tiene goal -> envía a dashboard
  useEffect(() => {
    if (!user) return;
    const checkGoal = async () => {
      try {
        const ref = doc(db, "users", user.uid);               // <-- colección unificada
        const snap = await getDoc(ref);
        if (!snap.exists()) {
          // Crea el doc si no existe (vacío, sin romper nada)
          await setDoc(ref, { createdAt: new Date().toISOString() }, { merge: true });
          return;
        }
        const data = snap.data() || {};
        if (data.goal) {
          // Ya tiene objetivo -> a dashboard
          navigate("/dashboard", { replace: true });
        }
        // Si no tiene goal, se queda en esta pantalla
      } catch (e) {
        console.error("Error leyendo perfil:", e);
      }
    };
    checkGoal();
  }, [user, navigate]);

  const handleSelect = async (goalText: string) => {
    if (!user) return;
    setSelectedGoal(goalText);
    setLoading(true);

    try {
      const goalValue = GOALS[goalText];                      // 'bajar' | 'mantener' | 'subir'
      const ref = doc(db, "users", user.uid);                 // <-- colección 'users'
      await setDoc(
        ref,
        {
          goal: goalValue,
          profileCompleted: true,                             // <-- MUY IMPORTANTE para tu guard
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );

      navigate("/dashboard", { replace: true });
    } catch (error) {
      console.error("Error al guardar el objetivo:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <p className="small">Cargando usuario...</p>;

  return (
    <div className="card">
      <h2 className="mb4">Selecciona tu objetivo</h2>
      <p className="small">¿Qué deseas lograr con tu entrenamiento?</p>
      <div className="space" />

      <div className="goal-options">
        {["Bajar de peso", "Mantener peso", "Aumentar masa muscular"].map((goal) => (
          <button
            key={goal}
            className={`primary ${selectedGoal === goal ? "selected" : ""}`}
            onClick={() => handleSelect(goal)}
            disabled={loading}
            style={{ marginBottom: "12px", width: "100%" }}
          >
            {goal}
          </button>
        ))}
      </div>

      {loading && <p className="small">Guardando objetivo...</p>}
    </div>
  );
}
