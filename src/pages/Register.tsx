import { useEffect, useState } from 'react'
import { auth, db } from '../firebase'
import { createUserWithEmailAndPassword, updateProfile, onAuthStateChanged } from 'firebase/auth'
import { doc, serverTimestamp, setDoc } from 'firebase/firestore'
import { isEmail, isStrongPassword, isName, isNonEmpty } from '../lib/validators'
import { useNavigate, Link } from 'react-router-dom'

export default function Register(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [nombre, setNombre] = useState('')
  const [apellido, setApellido] = useState('')
  const [direccion, setDireccion] = useState('')
  const [terms, setTerms] = useState(false)

  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  useEffect(()=>{
    const unsub = onAuthStateChanged(auth, (u)=>{ if(u) navigate('/dashboard') })
    return ()=>unsub()
  }, [])

  const emailOk = isEmail(email)
  const passOk = isStrongPassword(password)
  const nombreOk = isName(nombre)
  const apellidoOk = isName(apellido)
  const direccionOk = isNonEmpty(direccion)
  const formOk = emailOk && passOk && nombreOk && apellidoOk && direccionOk && terms

  const emailError = !emailOk && email.length>0
  const passError  = !passOk && password.length>0
  const nomError   = !nombreOk && nombre.length>0
  const apeError   = !apellidoOk && apellido.length>0
  const dirError   = !direccionOk && direccion.length>0

  async function onSubmit(e: React.FormEvent){
    e.preventDefault()
    if(!formOk) return
    setLoading(true); setError(null); setSuccess(null)
    try{
      const emailNorm = email.trim().toLowerCase()
      const cred = await createUserWithEmailAndPassword(auth, emailNorm, password)
      await updateProfile(cred.user, { displayName: `${nombre} ${apellido}` })
      await setDoc(doc(db, 'users', cred.user.uid), {
        id: cred.user.uid,
        email: emailNorm,
        nombre: nombre.trim(),
        apellido: apellido.trim(),
        direccion: direccion.trim(),
        emailVerified: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
      setSuccess('Cuenta creada correctamente. Entrando...')
      navigate('/dashboard', { replace: true })
    }catch(err:any){
      const code = err?.code || ''
      if(code.includes('auth/email-already-in-use')) setError('Este correo ya está registrado.')
      else if(code.includes('network')) setError('Fallo de red, intenta nuevamente.')
      else setError('No se pudo crear la cuenta.')
    }finally{
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <h2 className="mb4">Crear Cuenta</h2>
      <p className="small">Regístrate para empezar con tus rutinas</p>
      <div className="space"></div>

      <form onSubmit={onSubmit}>
        <label htmlFor="reg-email">Email</label>
        <div className="input">
          <input
            id="reg-email"
            value={email}
            onChange={e=>setEmail(e.target.value)}
            type="email"
            placeholder="tucorreo@dominio.com"
            aria-invalid="false"
            aria-describedby={emailError ? 'reg-email-error' : undefined}
          />
        </div>
        {emailError && (
          <div id="reg-email-error" className="error" role="alert">Email inválido</div>
        )}

        <label htmlFor="reg-pass">Contraseña</label>
        <div className="input">
          <input
            id="reg-pass"
            value={password}
            onChange={e=>setPassword(e.target.value)}
            type={show ? 'text' : 'password'}
            placeholder="Mínimo 8, Aa y número"
            aria-invalid="false"
            aria-describedby={passError ? 'reg-pass-error' : undefined}
          />
          <button type="button" onClick={()=>setShow(v=>!v)} aria-label={show?'Ocultar contraseña':'Mostrar contraseña'}>
            {show ? 'Ocultar' : 'Mostrar'}
          </button>
        </div>
        {passError && (
          <div id="reg-pass-error" className="error" role="alert">Debe tener ≥8, 1 mayúscula, 1 minúscula y 1 dígito</div>
        )}

        <div className="row">
          <div className="col">
            <label htmlFor="reg-nombre">Nombre</label>
            <div className="input">
              <input
                id="reg-nombre"
                value={nombre}
                onChange={e=>setNombre(e.target.value)}
                placeholder="Juan"
                aria-invalid="false"
                aria-describedby={nomError ? 'reg-nombre-error' : undefined}
              />
            </div>
            {nomError && (
              <div id="reg-nombre-error" className="error" role="alert">Nombre inválido (2–50, sin dígitos)</div>
            )}
          </div>

          <div className="col">
            <label htmlFor="reg-apellido">Apellido</label>
            <div className="input">
              <input
                id="reg-apellido"
                value={apellido}
                onChange={e=>setApellido(e.target.value)}
                placeholder="Pérez"
                aria-invalid="false"
                aria-describedby={apeError ? 'reg-apellido-error' : undefined}
              />
            </div>
            {apeError && (
              <div id="reg-apellido-error" className="error" role="alert">Apellido inválido (2–50, sin dígitos)</div>
            )}
          </div>
        </div>

        <label htmlFor="reg-direccion">Dirección</label>
        <div className="input">
          <input
            id="reg-direccion"
            value={direccion}
            onChange={e=>setDireccion(e.target.value)}
            placeholder="Calle 1 # 2-34"
            aria-invalid="false"
            aria-describedby={dirError ? 'reg-direccion-error' : undefined}
          />
        </div>
        {dirError && (
          <div id="reg-direccion-error" className="error" role="alert">La dirección es obligatoria (máx. 120)</div>
        )}

        <div className="space"></div>
        <label className="termsRow">
          <input className="w-auto" type="checkbox" checked={terms} onChange={e=>setTerms(e.target.checked)} />
          Acepto <a href="#" onClick={e=>e.preventDefault()}>términos y condiciones</a>
        </label>

        <div className="space"></div>
        <button className="primary" disabled={!formOk || loading} type="submit">
          {loading ? 'Creando...' : 'Registrarse'}
        </button>
        {error && <div className="error" role="alert">{error}</div>}
        {success && <div className="success">{success}</div>}
      </form>

      <div className="space"></div>
      <div className="center small">¿Ya tienes cuenta? <Link to="/login">Iniciar sesión</Link></div>
    </div>
  )
}
