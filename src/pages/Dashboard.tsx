import { useEffect, useMemo, useRef, useState } from 'react'
import { auth, db } from '../firebase'
import { signOut } from 'firebase/auth'
import { collection, doc, getDoc, getDocs, orderBy, query, setDoc, Timestamp, where } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'
import type { UserProfile, DashboardStats, WeekPoint, Workout } from '../types/models'
import { addDays, formatShort, startOfDay } from '../lib/date'

export default function Dashboard(){
  const navigate = useNavigate()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)
  const cancelled = useRef(false)

  // --- Registro rápido ---
  const [wType, setWType] = useState<'fuerza'|'cardio'|'movilidad'|'otro'>('cardio')
  const [wMin, setWMin] = useState<number>(30)
  const [wKcal, setWKcal] = useState<number>(250)
  const [wDate, setWDate] = useState<string>(()=> new Date().toISOString().slice(0,10))
  const [saving, setSaving] = useState(false)

  // --- Estado para el gráfico interactivo ---
  const [selectedDay, setSelectedDay] = useState<WeekPoint | null>(null)

  useEffect(()=>{
    cancelled.current = false
    init()
    return ()=>{ cancelled.current = true }
  }, [])

  async function init(){
    setLoading(true); setErr(null)
    try{
      const u = auth.currentUser
      if(!u){ navigate('/login'); return }

      const pref = doc(db, 'users', u.uid)
      const psnap = await getDoc(pref)
      if(!psnap.exists()){
        navigate('/complete-profile', { replace: true }); return
      }
      const p = { id: u.uid, ...(psnap.data() as any) } as UserProfile
      if(!cancelled.current) setProfile(p)

      const today = startOfDay(new Date())
      const from = addDays(today, -13)
      const wref = collection(db, 'users', u.uid, 'workouts')
      const qy = query(wref, where('date', '>=', Timestamp.fromDate(from)), orderBy('date', 'asc'))
      const snap = await getDocs(qy)
      const workouts: Workout[] = snap.docs.map(d => ({ id: d.id, ...(d.data() as any) })) as any

      const week: WeekPoint[] = []
      let totalSessions = 0, totalCalories = 0, totalMinutes = 0

      for(let i=6; i>=0; i--){
        const day = addDays(today, -i)
        const next = addDays(day, 1)
        const label = formatShort(day)
        const inDay = workouts.filter(w=>{
          const t = (w.date as any).toDate ? (w.date as any).toDate() : new Date(w.date)
          return t >= day && t < next
        })
        const calories = inDay.reduce((a,b)=> a + (b.calories||0), 0)
        const minutes = inDay.reduce((a,b)=> a + (b.durationMin||0), 0)
        week.push({ label, calories, minutes, sessions: inDay.length })
        totalSessions += inDay.length
        totalCalories += calories
        totalMinutes  += minutes
      }

      const s: DashboardStats = { totalSessions, totalCalories, totalMinutes, week }
      if(!cancelled.current) setStats(s)
    }catch(e:any){
      console.error('Dashboard init error:', e?.code, e?.message)
      if(!cancelled.current) setErr('No se pudo cargar la información.')
    }finally{
      if(!cancelled.current) setLoading(false)
    }
  }

  async function onQuickAdd(e: React.FormEvent){
    e.preventDefault()
    const u = auth.currentUser
    if(!u) return
    setSaving(true); setErr(null)
    try{
      const dt = new Date(`${wDate}T00:00:00`)
      const id = `${dt.getTime()}-${Math.random().toString(36).slice(2,8)}`
      await setDoc(doc(db, 'users', u.uid, 'workouts', id), {
        id, type: wType, durationMin: Number(wMin)||0, calories: Number(wKcal)||0,
        date: Timestamp.fromDate(dt),
        createdAt: Timestamp.now()
      })
      await init()
    }catch(e:any){
      console.error('QuickAdd error:', e?.code, e?.message)
      setErr('No se pudo registrar el entrenamiento.')
    }finally{
      setSaving(false)
    }
  }

  async function logout(){
    await signOut(auth)
    navigate('/login', { replace: true })
  }

  const chart = useMemo(()=>{
    if(!stats) return { max: 0, points: [] as {x:number,y:number,label:string,cal:number,min:number,ses:number}[] }
    const max = Math.max(1, ...stats.week.map(p=>p.calories))
    const pts = stats.week.map((p, idx)=>({
      x: (idx+0.5) * (100/7),
      y: 100 - (p.calories / max) * 100,
      label: p.label, cal: p.calories, min: p.minutes, ses: p.sessions
    }))
    return { max, points: pts }
  }, [stats])

  if(loading) return <div className="card"><p>Cargando...</p></div>

  return (
    <div>
      <div className="card">
        <h2 className="mb4">Hola, {profile?.nombre ?? 'atleta'} 👋</h2>
        <p className="small">Este es tu resumen de la semana.</p>
      </div>

      <div className="space"></div>

      <div className="dashboard-grid">
        {/* Métricas */}
        <div className="metric">
          <h3>Rutinas</h3>
          <div className="value">{stats?.totalSessions ?? 0}</div>
          <p className="small">en los últimos 7 días</p>
        </div>
        <div className="metric">
          <h3>Calorías</h3>
          <div className="value">{stats?.totalCalories ?? 0}</div>
          <p className="small">kcal en 7 días</p>
        </div>
        <div className="metric">
          <h3>Minutos</h3>
          <div className="value">{stats?.totalMinutes ?? 0}</div>
          <p className="small">de entrenamiento</p>
        </div>

        {/* Gráfico semanal */}
        <div className="panel">
          <h3 className="mb4">Progreso semanal</h3>
          {stats && stats.week.length > 0 ? (
            <>
              <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="chart">
                <line x1="0" y1="100" x2="100" y2="100" stroke="#334155" strokeWidth="0.6" />
                {chart.points.map((p, i)=>(
                  <g key={i} onClick={()=>setSelectedDay(stats.week[i])} style={{cursor:'pointer'}}>
                    <rect x={p.x-4} y={p.y} width="8" height={100 - p.y} rx="1.2"
                      fill={selectedDay?.label === p.label ? '#38bdf8' : '#22d3ee'}
                    />
                    <text x={p.x} y={98} fontSize="3" textAnchor="middle" fill="#9fb3c8">{p.label}</text>
                  </g>
                ))}
              </svg>

              {selectedDay && (
                <div className="chart-info mt2">
                  <p><strong>{selectedDay.label}:</strong> {selectedDay.calories} kcal, {selectedDay.minutes} min, {selectedDay.sessions} sesión(es)</p>
                </div>
              )}

              <div className="chart-legend">
                <span><i className="legend-dot legend-cal"></i>Calorías</span>
              </div>
            </>
          ) : <p className="small">Aún no hay datos esta semana.</p> }
        </div>

        {/* Registro rápido */}
        <div className="panel">
          <h3 className="mb4">Registro rápido</h3>

          <form className="quick-form" onSubmit={onQuickAdd}>
            <label htmlFor="qtype">Tipo de entrenamiento</label>
            <select id="qtype" className="select" value={wType} onChange={e=>setWType(e.target.value as any)}>
              <option value="cardio">Cardio</option>
              <option value="fuerza">Fuerza</option>
              <option value="movilidad">Movilidad</option>
              <option value="otro">Otro</option>
            </select>

            <label htmlFor="qmin">Minutos</label>
            <input id="qmin" className="input-num" type="number" min={0} value={wMin} onChange={e=>setWMin(Number(e.target.value))} />

            <label htmlFor="qkcal">Calorías</label>
            <input id="qkcal" className="input-num" type="number" min={0} value={wKcal} onChange={e=>setWKcal(Number(e.target.value))} />

            <label htmlFor="qdate">Fecha</label>
            <input id="qdate" className="input-date" type="date" value={wDate} onChange={e=>setWDate(e.target.value)} />

            <button className="btn primary" disabled={saving} type="submit">
              {saving ? 'Guardando...' : 'Guardar'}
            </button>
          </form>

          {err && (<><div className="space"></div><div className="error">{err}</div></>)}
        </div>
      </div>

      <div className="space"></div>
      {/* 🔥 Botón de cerrar sesión eliminado */}
    </div>
  )
}
