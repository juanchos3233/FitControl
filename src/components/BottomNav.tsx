import { NavLink } from "react-router-dom";
import { Home, Dumbbell, Utensils, User } from "lucide-react";

export default function BottomNav() {
  return (
    <nav className="bottom-nav">
      <NavLink to="/dashboard" end className="nav-item">
        <Home size={22} />
        <span>Inicio</span>
      </NavLink>

      <NavLink to="/rutina" className="nav-item">
        <Dumbbell size={22} />
        <span>Rutina</span>
      </NavLink>

      <NavLink to="/alimentacion" className="nav-item">
        <Utensils size={22} />
        <span>Alimentación</span>
      </NavLink>

      <NavLink to="/perfil" className="nav-item">
        <User size={22} />
        <span>Perfil</span>
      </NavLink>
    </nav>
  );
}
