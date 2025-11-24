import React, { useEffect, useState } from 'react';
import { auth } from '../firebase';
import { saveUserProfile, getUserProfile } from '../services/profile';
import { apiGenerateNutritionPlan } from '../services/api';
import type { UserProfile } from '../types/models';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

export default function Perfil() {
  const [form, setForm] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const nav = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const p = await getUserProfile();
        setForm(p);
      } catch {
        setError("No se pudo cargar el perfil.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const logout = async () => {
    await signOut(auth);
    nav("/login");
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!form) return;
    setForm(prev => ({
      ...prev!,
      [e.target.name]: ['edad', 'peso', 'altura'].includes(e.target.name)
        ? Number(e.target.value)
        : e.target.value
    }));
  };

  const saveProfile = async () => {
    if (!form) return;
    setSaving(true);
    setError(null);
    setMessage(null);

    try {
      await saveUserProfile(form);

      // Generar rutina
      const u = auth.currentUser!;
      await apiGenerateNutritionPlan({ uid: u.uid, goal: form.goal, profile: form });

      setMessage("Información actualizada ✔");

      // Redirige después de guardar
      setTimeout(() => nav("/rutinas"), 1200);

    } catch {
      setError("Error al actualizar perfil");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !form) return null;

  return (
    <div className="perfil-container">
      <h2 className="perfil-title">Perfil</h2>

      {error && <div className="card error">{error}</div>}
      {message && <div className="card success">{message}</div>}

      <div className="card perfil-card">

        {/* FORMULARIO */}
        <div className="perfil-grid">
          <label>Sexo
            <select name="sexo" value={form.sexo} onChange={onChange}>
              <option value="M">Masculino</option>
              <option value="F">Femenino</option>
            </select>
          </label>

          <label>Edad
            <input type="number" name="edad" value={form.edad} onChange={onChange} />
          </label>

          <label>Peso (kg)
            <input type="number" name="peso" value={form.peso} onChange={onChange} />
          </label>

          <label>Altura (cm)
            <input type="number" name="altura" value={form.altura} onChange={onChange} />
          </label>

          <label>Actividad
            <select name="actividad" value={form.actividad} onChange={onChange}>
              <option value="sedentario">Sedentario</option>
              <option value="ligero">Ligero</option>
              <option value="moderado">Moderado</option>
              <option value="intenso">Intenso</option>
              <option value="atleta">Atleta</option>
            </select>
          </label>

          <label>Objetivo
            <select name="goal" value={form.goal} onChange={onChange}>
              <option value="bajar">Bajar peso</option>
              <option value="mantener">Mantener peso</option>
              <option value="subir">Subir peso</option>
            </select>
          </label>
        </div>

        {/* 🔥 BOTÓN PRINCIPAL */}
        <div className="perfil-buttons">
          <button className="btn primary" disabled={saving} onClick={saveProfile}>
            {saving ? (
              <span className="loading-content">
                <span className="spinner"></span> Generando...
              </span>
            ) : (
              "Guardar + regenerar plan"
            )}
          </button>
        </div>

        {/* BOTÓN CERRAR SESIÓN */}
        <button className="btn primary" onClick={logout} style={{ marginTop: 20 }}>
          Cerrar Sesión
        </button>

      </div>
    </div>
  );
}
