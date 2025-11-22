import { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useNutritionPlan, Goal } from '../hooks/useNutritionPlan';


export default function Nutrition(){
  const u = auth.currentUser;
  const [profile,setProfile]=useState<any>(null);
  const { plan, loading, error, load, generate } = useNutritionPlan();

  useEffect(()=>{
    (async ()=>{
      if(!u) return;
      const snap = await getDoc(doc(db,'users',u.uid));
      if(snap.exists()) setProfile(snap.data());
      await load(u.uid);
    })();
  },[]);

  if(!u) return <div className="card">Inicia sesión.</div>;

  const ready = profile?.sexo && profile?.edad && profile?.peso && profile?.altura && profile?.actividad && profile?.objetivo;

  return (
    <div className="page">
      <h2>Alimentación</h2>

      {error && <div className="error">{error}</div>}
      {loading && <p>Cargando…</p>}

      {!plan && (
        <div className="panel">
          <p>No tienes un plan activo.</p>
          {!ready
            ? <p className="small">Completa tu perfil (sexo, edad, peso, altura, actividad y objetivo).</p>
            : <button className="btn primary" onClick={()=>generate(u.uid, profile.objetivo as Goal, {
                sexo: profile.sexo, edad:Number(profile.edad), peso:Number(profile.peso),
                altura:Number(profile.altura), actividad: profile.actividad
              })}>
                Generar plan de alimentación
              </button>
          }
        </div>
      )}

      {plan && (
        <div className="panel">
          <p className="small">
            Objetivo: <b>{plan.goal}</b> • {plan.startDate} → {plan.endDate}<br/>
            Calorías/día: <b>{plan.totalKcal}</b> — P {plan.macros.protein}g · C {plan.macros.carbs}g · G {plan.macros.fat}g
          </p>

          <div className="grid">
            {plan.meals.map(m=>(
              <div key={m.code} className="panel">
                <h3>{m.title} <span className="small">({m.time})</span></h3>
                <p className="small">Objetivo: {m.targetKcal} kcal</p>
                <ul>{m.items.map((it,i)=>(<li key={i}>{it.name} — {it.kcal} kcal</li>))}</ul>
              </div>
            ))}
          </div>

      
          
        </div>
      )}
    </div>
  );
}