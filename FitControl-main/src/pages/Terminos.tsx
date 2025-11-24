import { Link } from "react-router-dom"
import { useEffect } from "react"
export default function Terminos(){
    useEffect(() => {
    document.body.classList.add("hide-navbar")
    return () => document.body.classList.remove("hide-navbar");
  }, []);
return (
<div className="card" style={{ maxWidth: 700, margin: "0 auto" }}>
Términos y Condiciones

  <div className="content">

    <p>
      Bienvenido a <strong>FitControl</strong>. Al utilizar nuestra aplicación,
      aceptas los siguientes términos y condiciones. Por favor léelos
      cuidadosamente antes de continuar con el registro.
    </p>

    <h3>1. Uso de la aplicación</h3>
    <p>
      FitControl es una aplicación creada con el propósito de ofrecer 
      rutinas de ejercicio y recomendaciones alimenticias basadas en la meta 
      seleccionada por el usuario: <strong>bajar de peso, mantener o aumentar masa</strong>.
    </p>
    <p>
      El usuario se compromete a utilizar la aplicación únicamente con fines 
      personales y no comerciales.
    </p>

    <h3>2. Información proporcionada</h3>
    <p>
      Al registrarte, debes ingresar datos reales y actualizados. Tu información
      será usada para personalizar tu experiencia dentro de la app.
    </p>

    <h3>3. No reemplaza asesoramiento profesional</h3>
    <p>
      FitControl <strong>no sustituye</strong> a entrenadores certificados, 
      nutricionistas ni profesionales de la salud.
    </p>
    <p>
      Antes de iniciar cualquier rutina física o cambio en tu alimentación,
      debes consultar con un especialista, especialmente si tienes problemas 
      médicos o condiciones especiales.
    </p>

    <h3>4. Responsabilidad del usuario</h3>
    <p>
      El usuario entiende que cualquier actividad física implica riesgos, y 
      es su responsabilidad realizar los ejercicios de forma adecuada según su 
      nivel físico.
    </p>

    <h3>5. Privacidad y seguridad</h3>
    <p>
      La aplicación almacena información básica (nombre, correo, dirección).
      Esta información no será compartida con terceros sin tu consentimiento.
    </p>

    <h3>6. Restricciones</h3>
    <p>No está permitido:</p>
    <ul>
      <li>Utilizar la app con fines ilegales.</li>
      <li>Modificar, copiar o distribuir su contenido sin permiso.</li>
      <li>Crear múltiples cuentas fraudulentas.</li>
    </ul>

    <h3>7. Modificaciones</h3>
    <p>
      FitControl puede actualizar estos términos en cualquier momento. 
      Cuando lo hagamos, te notificaremos dentro de la aplicación.
    </p>

    <h3>8. Aceptación</h3>
    <p>
      Al registrarte y usar FitControl, declaras que has leído y aceptado los 
      términos y condiciones aquí descritos.
    </p>

    <div className="space"></div>
    <Link to="/register" className="primary">Volver al registro</Link>
  </div>
</div>

)
}

