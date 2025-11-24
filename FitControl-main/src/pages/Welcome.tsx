import React from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../components/logo";

const Welcome: React.FC = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate("/login");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#0a1128] text-white">
      {/* Logo */}
      <div className="mb-6 animate-fadeIn">
        <Logo />
      </div>

      {/* Texto de bienvenida */}
      <h1 className="text-2xl font-bold mb-2 text-center">
        ¡Bienvenido a FitControl!
      </h1>
      <p className="text-gray-400 mb-8 text-center max-w-xs">
        Tu compañero para mejorar tu rendimiento físico y mantener un control completo de tu progreso.
      </p>

      {/* Botón con la estética idéntica */}
      <button
        type="button"
        onClick={handleStart}
        style={{
          width: '100%',
          padding: '14px 18px',
          borderRadius: '999px',
          border: 'none',
          cursor: 'pointer',
          fontSize: 16,
          fontWeight: '500',
          background: 'linear-gradient(90deg, #22D3EE 0%, #6366F1 100%)',
          color: '#1E293B',
          transition: '0.2s',
          opacity: 1,
          fontFamily: 'sans-serif',
          boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
          maxWidth: 280,
        }}
      >
        Comenzar
      </button>

      <p className="absolute bottom-6 text-xs text-gray-500">
        © {new Date().getFullYear()} FitControl
      </p>
    </div>
  );
};

export default Welcome;
