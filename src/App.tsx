// src/App.tsx
import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Logo from "./components/logo.js";
import Navbar from "./components/Navbar";
import { testConnection } from "./services/api"; // <-- Importa la función

export default function App() {
  const location = useLocation();

  // Rutas donde no queremos mostrar la barra de navegación
  const hideNavbarPaths = ["/", "/login", "/register", "/reset-password", "/complete-profile"];
  const hideNavbar = hideNavbarPaths.includes(location.pathname);

  // 🔧 Probar conexión con el backend al iniciar la app
  useEffect(() => {
    const checkBackend = async () => {
      try {
        await testConnection();
      } catch (error) {
        console.error("❌ No se pudo conectar al backend:", error);
      }
    };
    checkBackend();
  }, []);

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

      {/* Navbar solo en rutas protegidas */}
      {!hideNavbar && <Navbar />}
    </div>
  );
}
