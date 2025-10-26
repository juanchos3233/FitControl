export type UserProfile = {
  id: string
  email: string
  nombre: string
  apellido: string
  direccion: string
  emailVerified: boolean
  createdAt?: any
  updatedAt?: any

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
