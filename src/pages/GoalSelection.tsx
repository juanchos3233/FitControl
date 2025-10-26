import { useState, useEffect } from "react"
import { db } from "../firebase"
import { doc, setDoc, getDoc } from "firebase/firestore"
import { useNavigate } from "react-router-dom"
import { auth } from "../firebase"

export default function GoalSelection() {
  const [selectedGoal, setSelectedGoal] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const navigate = useNavigate()

  // Esperar a que Firebase cargue el usuario
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(u => {
      if (u) setUser(u)
      else navigate('/login', { replace: true })
    })
    return unsubscribe
  }, [navigate])

  // Redirigir si ya eligió meta
  useEffect(() => {
    if (!user) return
    const checkMeta = async () => {
      try {
        const userRef = doc(db, 'usuarios', user.uid)
        const userDoc = await getDoc(userRef)
        if (!userDoc.exists()) {
          await setDoc(userRef, {}) // crear documento si no existe
        } else if (userDoc.data()?.metaElegida) {
          navigate('/dashboard', { replace: true })
        }
      } catch (err) {
        console.error(err)
      }
    }
    checkMeta()
  }, [user, navigate])

  const handleSelect = async (goal: string) => {
    if (!user) return
    setSelectedGoal(goal)
    setLoading(true)

    try {
      const userRef = doc(db, "usuarios", user.uid)
      await setDoc(userRef, 
        { objetivo: goal, metaElegida: true }, 
        { merge: true } // merge asegura creación si no existía
      )
      navigate("/dashboard", { replace: true }) // redirige después de guardar
    } catch (error) {
      console.error("Error al guardar el objetivo:", error)
    } finally {
      setLoading(false)
    }
  }

  if (!user) return <p className="small">Cargando usuario...</p>

  return (
    <div className="card">
      <h2 className="mb4">Selecciona tu objetivo</h2>
      <p className="small">¿Qué deseas lograr con tu entrenamiento?</p>
      <div className="space"></div>

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
  )
}
