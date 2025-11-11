import React, { useEffect, useState } from 'react';
import { auth } from '../firebase';                 // ⬅️ AJUSTA si tu ruta cambia
import { useNavigate } from 'react-router-dom';
import { saveUserProfile, getUserProfile } from '../services/profile';
import type { UserProfile } from '../types/models';
import { apiGenerateNutritionPlan } from '../services/api';

const initial: UserProfile = { sexo: 'M', edad: 18, peso: 60, altura: 170, actividad: 'ligero', goal: 'mantener' };

export default function CompleteProfile() {
  const [form, setForm]   = useState<UserProfile>(initial);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string|null>(null);
  const nav = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const p = await getUserProfile();
        if (p?.profileCompleted) setForm({ ...initial, ...p });
      } catch {}
    })();
  }, []);

  const onChange = (e: React.ChangeEvent<HTMLInputElement|HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => {
      if (['edad','peso','altura'].includes(name)) return { ...prev, [name]: Number(value) || 0 } as UserProfile;
      return { ...prev, [name]: value } as UserProfile;
    });
  };

  const onSubmit = async (regenerarPlan = true) => {
    setLoading(true); setError(null);
    try {
      await saveUserProfile(form);
      if (regenerarPlan) {
        const u = auth.currentUser!;
        await apiGenerateNutritionPlan({
          uid: u.uid,
          goal: form.goal,
          profile: { sexo: form.sexo, edad: form.edad, peso: form.peso, altura: form.altura, actividad: form.actividad },
        });
      }
      nav('/alimentacion');
    } catch (e: any) {
      setError(e?.message || 'No se pudo guardar el perfil');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: 680, margin: '48px auto' }}>
      <h2>Completar perfil</h2>
      {error && <div className="card" style={{ marginTop: 12, padding: 12, color: '#f66' }}>{error}</div>}
      <div className="card" style={{ padding: 16, marginTop: 16 }}>
        <div className="grid" style={{ display:'grid', gap:12, gridTemplateColumns:'1fr 1fr' }}>
          <label>Sexo
            <select name="sexo" value={form.sexo} onChange={onChange}>
              <option value="M">Masculino</option><option value="F">Femenino</option>
            </select>
          </label>
          <label>Edad<input type="number" name="edad" value={form.edad} onChange={onChange} min={12} /></label>
          <label>Peso (kg)<input type="number" step="0.1" name="peso" value={form.peso} onChange={onChange} /></label>
          <label>Altura (cm)<input type="number" name="altura" value={form.altura} onChange={onChange} /></label>
          <label>Actividad
            <select name="actividad" value={form.actividad} onChange={onChange}>
              <option value="sedentario">Sedentario</option><option value="ligero">Ligero</option>
              <option value="moderado">Moderado</option><option value="intenso">Intenso</option>
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
        <div style={{ marginTop: 16, display:'flex', gap:12 }}>
          <button disabled={loading} onClick={() => onSubmit(true)}>{loading?'Guardando…':'Guardar y generar plan'}</button>
          <button disabled={loading} onClick={() => onSubmit(false)}>Guardar (sin generar plan)</button>
        </div>
      </div>
    </div>
  );
}
