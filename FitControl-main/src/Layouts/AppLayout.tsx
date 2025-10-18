// src/layouts/AppLayout.tsx
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { auth } from '../firebase'
import { signOut } from 'firebase/auth'
import { Home, Activity, BarChart3, User, LogOut } from 'lucide-react'
import Navbar from '../components/Navbar' // <-- importNavbar

export default function AppLayout() {
  const navigate = useNavigate()

  async function logout() {
    await signOut(auth)
    navigate('/login', { replace: true })
  }

  return (
    <div className="flex h-screen bg-slate-100">
      {/* Barra lateral (desktop) */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col justify-between hidden md:flex">
        <div>
          <div className="p-4 text-2xl font-bold text-center border-b border-slate-700">
            FitTrack 🏋️
          </div>
          <nav className="flex flex-col mt-4 space-y-2">
            <NavLink to="/" end className={({ isActive }) =>
              `flex items-center gap-2 px-6 py-3 hover:bg-slate-800 ${isActive ? 'bg-slate-800' : ''}`
            }>
              <Home size={18} /> Inicio
            </NavLink>
            <NavLink to="/progreso" className={({ isActive }) =>
              `flex items-center gap-2 px-6 py-3 hover:bg-slate-800 ${isActive ? 'bg-slate-800' : ''}`
            }>
              <BarChart3 size={18} /> Progreso
            </NavLink>
            <NavLink to="/rutinas" className={({ isActive }) =>
              `flex items-center gap-2 px-6 py-3 hover:bg-slate-800 ${isActive ? 'bg-slate-800' : ''}`
            }>
              <Activity size={18} /> Rutinas
            </NavLink>
            <NavLink to="/perfil" className={({ isActive }) =>
              `flex items-center gap-2 px-6 py-3 hover:bg-slate-800 ${isActive ? 'bg-slate-800' : ''}`
            }>
              <User size={18} /> Perfil
            </NavLink>
          </nav>
        </div>

        <button
          onClick={logout}
          className="flex items-center gap-2 px-6 py-3 border-t border-slate-700 hover:bg-slate-800"
        >
          <LogOut size={18} /> Cerrar sesión
        </button>
      </aside>

      {/* Contenido principal */}
      <main className="flex-1 overflow-y-auto p-6 pb-24"> {/* pb-24 para dejar espacio para la navbar fija en móvil */}
        <Outlet />
      </main>

      {/* Navbar móvil (solo visible en pantallas < md) */}
      <Navbar />
    </div>
  )
}
