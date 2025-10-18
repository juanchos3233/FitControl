// src/App.tsx
import { Outlet, useLocation } from 'react-router-dom'
import Logo from './components/logo.js'
import Navbar from './components/Navbar' // <-- import agregado (mínimo)

export default function App(){
  const location = useLocation()

  // Rutas públicas donde NO queremos mostrar la navbar
  const hideNavbarPaths = ['/', '/login', '/register', '/reset-password', '/complete-profile']
  const hideNavbar = hideNavbarPaths.includes(location.pathname)

  return (
    <div className="container">
      <div className="shell">
        <div className="header-logo">
          <Logo />
        </div>

        <Outlet />

        <div className="space"></div>
        <p className="small center">© {new Date().getFullYear()} FitControl</p>
      </div>

      {/* Agregamos la navbar aquí de forma no intrusiva y condicionada */}
      {!hideNavbar && <Navbar />}
    </div>
  )
}
