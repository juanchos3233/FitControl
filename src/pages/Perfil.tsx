import React, { useEffect, useState } from 'react';
import { auth } from '../firebase'; // ⬅️ ajusta la ruta si tu archivo es distinto
import { getUserProfile, updateGoal } from '../services/profile';
import { apiGenerateNutritionPlan } from '../services/api';
import type { UserProfile } from '../types/models';

/**
 * Página de Perfil:
 * - Muestra datos guardados del usuario
 * - Permite cambiar el objetivo (bajar/mantener/subir)
 * - Opcional: regenerar plan de alimentación con el nuevo objetivo
 */
export default function Perfil() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [goal, setGoal] = useState<UserProfile['goal']>('mantener');
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const p = await getUserProfile();
        if (mounted) {
          setProfile(p);
          setGoal(p?.goal ?? 'mantener');
        }
      } catch (e: any) {
        if (mounted) setError(e?.message || 'No se pudo cargar el perfil.');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const saveGoalOnly = async () => {
    if (!profile) return;
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      await updateGoal(goal);
      const updated = await getUserProfile();
      setProfile(updated);
      setMessage('Objetivo actualizado.');
    } catch (e: any) {
      setError(e?.message || 'No se pudo actualizar el objetivo.');
    } finally {
      setSaving(false);
    }
  };

  const saveGoalAndRegeneratePlan = async () => {
    if (!profile) return;
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      await updateGoal(goal);

      // Re-generar plan usando los datos actuales del perfil:
      const u = auth.currentUser!;
      if (
        profile.sexo &&
        typeof profile.edad === 'number' &&
        typeof profile.peso === 'number' &&
        typeof profile.altura === 'number' &&
        profile.actividad
      ) {
        await apiGenerateNutritionPlan({
          uid: u.uid,
          goal,
          profile: {
            sexo: profile.sexo,
            edad: profile.edad,
            peso: profile.peso,
            altura: profile.altura,
            actividad: profile.actividad,
          },
        });
        setMessage('Objetivo actualizado y plan regenerado.');
      } else {
        setMessage('Objetivo actualizado. (Completa tu perfil para poder regenerar el plan)');
      }

      const updated = await getUserProfile();
      setProfile(updated);
    } catch (e: any) {
      setError(e?.message || 'No se pudo actualizar el objetivo o regenerar el plan.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return null; // o un loader

  return (
    <div className="container" style={{ maxWidth: 720, margin: '48px auto' }}>
      <h2>Perfil</h2>

      {error && (
        <div className="card" style={{ marginTop: 12, padding: 12, color: '#f66' }}>
          {error}
        </div>
      )}
      {message && (
        <div className="card" style={{ marginTop: 12, padding: 12 }}>
          {message}
        </div>
      )}

      {!profile && (
        <div className="card" style={{ marginTop: 16, padding: 16 }}>
          No se encontró tu perfil. Ve a <b>Completar perfil</b> para registrar tus datos.
        </div>
      )}

      {profile && (
        <div className="card" style={{ padding: 16, marginTop: 16 }}>
          <div
            className="grid"
            style={{ display: 'grid', gap: 12, gridTemplateColumns: '1fr 1fr' }}
          >
            <div><b>Sexo:</b> {profile.sexo ?? '-'}</div>
            <div><b>Edad:</b> {profile.edad ?? '-'}</div>
            <div><b>Peso:</b> {profile.peso ?? '-'} kg</div>
            <div><b>Altura:</b> {profile.altura ?? '-'} cm</div>
            <div><b>Actividad:</b> {profile.actividad ?? '-'}</div>
            <div><b>Objetivo actual:</b> {profile.goal ?? '-'}</div>
          </div>

          <hr style={{ margin: '16px 0' }} />

          <label>
            Cambiar objetivo:{' '}
            <select
              disabled={saving}
              value={goal}
              onChange={(e) => setGoal(e.target.value as UserProfile['goal'])}
            >
              <option value="bajar">Bajar peso</option>
              <option value="mantener">Mantener peso</option>
              <option value="subir">Subir peso</option>
            </select>
          </label>

          <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
            <button disabled={saving} onClick={saveGoalOnly}>
              {saving ? 'Guardando…' : 'Guardar objetivo'}
            </button>
            <button disabled={saving} onClick={saveGoalAndRegeneratePlan}>
              {saving ? 'Procesando…' : 'Guardar + regenerar plan'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
