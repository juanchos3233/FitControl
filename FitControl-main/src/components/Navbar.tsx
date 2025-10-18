import { NavLink } from 'react-router-dom'
import { Home, Dumbbell, Apple, User } from 'lucide-react'

export default function Navbar() {
  return (
    <div className="navbar-wrapper">
      <nav className="navbar-mobile">
        <NavLink to="/dashboard" className="nav-item">
          <Home size={20} />
          <span>Inicio</span>
        </NavLink>
        <NavLink to="/rutinas" className="nav-item">
          <Dumbbell size={20} />
          <span>Rutinas</span>
        </NavLink>
        <NavLink to="/alimentacion" className="nav-item">
          <Apple size={20} />
          <span>Alimentación</span>
        </NavLink>
        <NavLink to="/perfil" className="nav-item">
          <User size={20} />
          <span>Perfil</span>
        </NavLink>
      </nav>
    </div>
  )
}
