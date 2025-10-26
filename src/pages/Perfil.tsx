// src/pages/Perfil.tsx
import React, { useEffect, useState } from "react";
import { getUserProfile, updateUserProfile } from "../services/planService";

interface PerfilUsuario {
  nombre: string;
  edad: number;
  altura: number;
  peso: number;
  objetivo: string;
  genero: string;
}

const Perfil: React.FC = () => {
  const [perfil, setPerfil] = useState<PerfilUsuario | null>(null);
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // ⚙️ Simulamos el UID (usa Firebase Auth en producción)
  const uid = localStorage.getItem("uid") || "test-user";

  // 🟢 Cargar datos del perfil al montar el componente
  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        const data = await getUserProfile(uid);
        setPerfil(data);
      } catch (err: any) {
        setError(err.response?.data?.error || "Error al cargar el perfil");
      } finally {
        setLoading(false);
      }
    };
    fetchPerfil();
  }, [uid]);

  // ✏️ Manejar cambios en los inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!perfil) return;
    setPerfil({ ...perfil, [e.target.name]: e.target.value });
  };

  // 💾 Guardar cambios
  const handleSave = async () => {
    if (!perfil) return;
    try {
      await updateUserProfile(uid, perfil);
      setMensaje("✅ Perfil actualizado correctamente");
      setTimeout(() => setMensaje(null), 3000);
    } catch (err: any) {
      setError(err.response?.data?.error || "Error al actualizar el perfil");
    }
  };

  if (loading) return <p className="text-center mt-10">⏳ Cargando perfil...</p>;
  if (error) return <p className="text-red-600 text-center mt-10">{error}</p>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-2xl mt-10">
      <h1 className="text-2xl font-bold text-center mb-4">👤 Mi Perfil</h1>

      {mensaje && (
        <div className="bg-green-100 text-green-800 p-2 rounded-lg text-center mb-3">
          {mensaje}
        </div>
      )}

      {perfil && (
        <form className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Nombre:</label>
            <input
              type="text"
              name="nombre"
              value={perfil.nombre}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Edad:</label>
              <input
                type="number"
                name="edad"
                value={perfil.edad}
                onChange={handleChange}
                className="w-full border rounded-lg p-2"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1">Género:</label>
              <select
                name="genero"
                value={perfil.genero}
                onChange={handleChange}
                className="w-full border rounded-lg p-2"
              >
                <option value="masculino">Masculino</option>
                <option value="femenino">Femenino</option>
                <option value="otro">Otro</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Altura (cm):</label>
              <input
                type="number"
                name="altura"
                value={perfil.altura}
                onChange={handleChange}
                className="w-full border rounded-lg p-2"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1">Peso (kg):</label>
              <input
                type="number"
                name="peso"
                value={perfil.peso}
                onChange={handleChange}
                className="w-full border rounded-lg p-2"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">Objetivo:</label>
            <select
              name="objetivo"
              value={perfil.objetivo}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
            >
              <option value="bajar_peso">Bajar Peso</option>
              <option value="subir_peso">Subir Peso</option>
              <option value="mantener">Mantener</option>
            </select>
          </div>

          <button
            type="button"
            onClick={handleSave}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Guardar Cambios
          </button>
        </form>
      )}
    </div>
  );
};

export default Perfil;
