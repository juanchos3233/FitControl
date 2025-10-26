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

      {/* Botón de inicio */}
      <button
        onClick={handleStart}
        className="bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-semibold py-2 px-6 rounded-full shadow-md hover:scale-105 transition-transform duration-300"
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
