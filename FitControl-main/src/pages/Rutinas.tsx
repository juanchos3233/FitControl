// src/pages/Rutinas.tsx
import  { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { routines } from "../data/rutinas"; 
import "./RoutinePage.css";
import { useNavigate } from "react-router-dom";

type Exercise = {
  name: string;
  sets: number;
  reps: string;
  gif: string;
};

type DayRoutine = {
  day: string;
  description?: string;
  exercises: Exercise[];
};

type RoutinesMap = Record<"subir_masa" | "bajar_peso" | "mantener_peso", DayRoutine[]>;

export default function Rutinas() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [objetivoTexto, setObjetivoTexto] = useState<string | null>(null);
  const [userRoutines, setUserRoutines] = useState<DayRoutine[] | null>(null);
  const [selectedRoutine, setSelectedRoutine] = useState<number | null>(null);
  const [completedExercises, setCompletedExercises] = useState<Record<number, boolean>>({});
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const user = auth.currentUser;
        if (!user) {
          setError("Usuario no autenticado.");
          setLoading(false);
          return;
        }

        const uid = user.uid;

        let objetivoFromDb: string | undefined;
        let objetivoKeyFromDb: string | undefined;

        const refUsers = doc(db, "users", uid);
        const snapUsers = await getDoc(refUsers);

        if (snapUsers.exists()) {
          const data = snapUsers.data() as any;
          objetivoKeyFromDb = data.goalKey;
          objetivoFromDb = data.objetivo ?? data.meta ?? data.goal;
        } else {
          const refUsuarios = doc(db, "usuarios", uid);
          const snapUsuarios = await getDoc(refUsuarios);

          if (snapUsuarios.exists()) {
            const data = snapUsuarios.data() as any;
            objetivoKeyFromDb = data.goalKey;
            objetivoFromDb = data.objetivo ?? data.meta ?? data.goal;
          }
        }

        // Si ya está guardado goalKey usa directo
        if (objetivoKeyFromDb && (routines as RoutinesMap)[objetivoKeyFromDb as keyof RoutinesMap]) {
          setObjetivoTexto(objetivoFromDb ?? objetivoKeyFromDb);
          setUserRoutines((routines as RoutinesMap)[objetivoKeyFromDb as keyof RoutinesMap]);
          return;
        }

        if (!objetivoFromDb) {
          setError("No se encontró objetivo para este usuario.");
          setLoading(false);
          return;
        }

        setObjetivoTexto(objetivoFromDb);

        const mapObjectiveToKey = (text: string) => {
          const t = text.toLowerCase().trim();
         
          if (t.includes("subir")) return "subir_masa";
          if (t.includes("bajar")) return "bajar_peso";
          if (t.includes("mantener")) return "mantener_peso";
          
          return null;
        };

        const key = mapObjectiveToKey(objetivoFromDb);

        console.log("[Rutinas] Objetivo:", objetivoFromDb, " -> Key:", key);

        if (!key) {
          setError(`Objetivo "${objetivoFromDb}" no coincide con ninguna rutina.`);
          setLoading(false);
          return;
        }

        setUserRoutines((routines as any)[key]);
      } catch (err) {
        console.error(err);
        setError("Error al cargar rutinas.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const handleSelectRoutine = (index: number) => {
    setCompletedExercises({});
    setSelectedRoutine(index);
  };

  const handleCompleteExercise = (i: number) => {
    setCompletedExercises((prev) => ({
      ...prev,
      [i]: !prev[i],
    }));
  };

  const allCompleted =
    selectedRoutine !== null &&
    userRoutines &&
    userRoutines[selectedRoutine].exercises.every((_, i) => completedExercises[i]);

  if (loading) return <p className="loading">Cargando rutina...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!userRoutines) return <p>No hay rutinas disponibles.</p>;

  return (
    <div className="routine-container">
      <h2 className="title">Mi entrenamiento</h2>
      <p className="goal-text">
        Objetivo: <strong>{objetivoTexto}</strong>
      </p>

      {selectedRoutine === null ? (
        <>
          <div className="week-days">
            {["dom", "lun", "mar", "mié", "jue", "vie", "sáb"].map((d, i) => (
              <div key={i} className={`day ${i === new Date().getDay() ? "active" : ""}`}>
                {d}
              </div>
            ))}
          </div>

          <h3 className="subtitle">Divisiones de entrenamiento</h3>

          {userRoutines.map((day, i) => (
            <div key={i} className="routine-card">
              <div className="routine-header">
                <span className="routine-letter">{String.fromCharCode(65 + i)}</span>
                <div>
                  <h4>{day.day}</h4>
                  {day.description && <p>{day.description}</p>}
                </div>
              </div>
              <button className="start-btn" onClick={() => handleSelectRoutine(i)}>
                Iniciar
              </button>
            </div>
          ))}
        </>
      ) : (
        <div className="routine-detail">
          <button className="back-btn" onClick={() => setSelectedRoutine(null)}>
            ← Volver a las rutinas
          </button>

          <h3>{userRoutines[selectedRoutine].day}</h3>
          <div className="exercise-list">
            {userRoutines[selectedRoutine].exercises.map((ex, i) => (
              <div key={i} className={`exercise-card ${completedExercises[i] ? "done" : ""}`}>
                <input
                  type="checkbox"
                  checked={completedExercises[i] || false}
                  onChange={() => handleCompleteExercise(i)}
                />
                <img src={ex.gif} alt={ex.name} width="100" />
                <div>
                  <h4>{ex.name}</h4>
                  <p>
                    {ex.sets} x {ex.reps}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {allCompleted && (
            <button className="finish-btn" onClick={() => navigate("/dashboard")}>
              Finalizar entrenamiento
            </button>
          )}
        </div>
      )}
    </div>
  );
}
