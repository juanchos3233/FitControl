// src/hooks/useNutritionPlan.ts
import { useState } from 'react';
import api from '../services/api';

export type Goal = 'subir'|'bajar'|'mantener';

export type MealItem = { name: string; kcal: number };
export type MealBlock = {
  code: string; title: string; time: string;
  targetKcal: number; items: MealItem[];
};
export type NutritionPlan = {
  id: string; goal: Goal; totalKcal: number;
  macros: { protein: number; carbs: number; fat: number };
  startDate: string; endDate: string;
  meals: MealBlock[];
};

export function useNutritionPlan(){
  const [plan, setPlan] = useState<NutritionPlan|null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string|null>(null);

  async function load(uid: string){
    try{
      setLoading(true); setError(null);
      const { data } = await api.get('/api/nutrition/current',{ params: { uid }});
      setPlan(data as NutritionPlan);
    }catch(e:any){
      setError(e?.response?.data?.error || 'No se pudo cargar el plan');
      setPlan(null);
    }finally{ setLoading(false); }
  }

  async function generate(uid: string, goal: Goal, profile: any){
    try{
      setLoading(true); setError(null);
      const { data } = await api.post('/api/nutrition/generate', { uid, goal, profile });
      setPlan(data as NutritionPlan);
    }catch(e:any){
      setError(e?.response?.data?.error || 'No se pudo generar el plan');
    }finally{ setLoading(false); }
  }

  return { plan, loading, error, load, generate };
}
