export type User = {
  // NUEVOS CAMPOS
  metaElegida?: boolean
  objetivo?: string
}

export type Workout = {
  id: string
  date: any
  type: 'fuerza' | 'cardio' | 'movilidad' | 'otro'
  durationMin: number
  calories: number
}

export type WeekPoint = { label: string; calories: number; sessions: number; minutes: number }

export type DashboardStats = {
  totalSessions: number
  totalCalories: number
  totalMinutes: number
  week: WeekPoint[]
}

// src/types/models.ts
export type Goal = 'subir' | 'bajar' | 'mantener';

export interface MealItem {
  name: string;
  grams?: number;
  unit?: string;
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface MealBlock {
  code: 'desayuno'|'snack1'|'almuerzo'|'snack2'|'cena';
  title: string;
  time: string;              // “07:30”
  targetKcal: number;
  items: MealItem[];
}

export type Objetivo = 'subir' | 'bajar' | 'mantener';
export type Actividad = 'sedentario' | 'ligero' | 'moderado' | 'intenso' | 'atleta';

export interface UserProfile {
  firstName?: string;
  lastName?: string;
  address?: string;

  sexo: 'M' | 'F';
  edad: number;
  peso: number;    // kg
  altura: number;  // cm
  actividad: Actividad;

  goal: Objetivo;

  profileCompleted?: boolean;
  updatedAt?: string;
}

