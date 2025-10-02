import { useEffect, useState } from 'react'
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth'
import { auth } from '../firebase'
import { useNavigate, Link } from 'react-router-dom'
import { isEmail } from '../lib/validators'

export default function Login(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(()=>{
    const unsub = onAuthStateChanged(auth, (u)=>{ if(u) navigate('/dashboard') })
    return ()=>unsub()
  }, [])

  const emailOk = isEmail(email)
  const passOk = password.trim().length > 0
  const formOk = emailOk && passOk

  async function onSubmit(e: React.FormEvent){
    e.preventDefault()
    if(!formOk) return
    setError(null); setLoading(true)
    try{
      await signInWithEmailAndPassword(auth, email.trim().toLowerCase(), password)
      navigate('/dashboard', { replace: true })
    }catch(err:any){
      const code = err?.code || ''
      if(code.includes('invalid-credential')) setError('Email o contraseña inválidos.')
      else setError('No se pudo iniciar sesión. Intenta nuevamente.')
    }finally{
      setLoading(false)
    }
  }

  const emailError = !emailOk && email.length>0
  const passError  = !passOk && password.length>0

  return (
    <div className="card">
      <h2 className="mb4">Iniciar Sesión</h2>
      <p className="small">Ingresa con tu correo y contraseña</p>
      <div className="space"></div>

      <form onSubmit={onSubmit}>
        <label htmlFor="login-email">Email</label>
        <div className="input">
          <input
            id="login-email"
            value={email}
            onChange={e=>setEmail(e.target.value)}
            type="email"
            placeholder="tucorreo@dominio.com"
            aria-invalid="false"
            aria-describedby={emailError ? 'login-email-error' : undefined}
          />
        </div>
        {emailError && (
          <div id="login-email-error" className="error" role="alert">Email inválido</div>
        )}

        <label htmlFor="login-password">Contraseña</label>
        <div className="input">
          <input
            id="login-password"
            value={password}
            onChange={e=>setPassword(e.target.value)}
            type={show ? 'text' : 'password'}
            placeholder="••••••••"
            aria-invalid="false"
            aria-describedby={passError ? 'login-pass-error' : undefined}
          />
          <button type="button" onClick={()=>setShow(v=>!v)} aria-label={show?'Ocultar contraseña':'Mostrar contraseña'}>
            {show ? 'Ocultar' : 'Mostrar'}
          </button>
        </div>
        {passError && (
          <div id="login-pass-error" className="error" role="alert">Contraseña requerida</div>
        )}

        <div className="links">
          <span></span>
          <Link to="/reset-password">¿Olvidaste tu contraseña?</Link>
        </div>

        <div className="space"></div>
        <button className="primary" disabled={!formOk || loading} type="submit">
          {loading ? 'Ingresando...' : 'Ingresar'}
        </button>
        {error && <div className="error" role="alert">{error}</div>}
      </form>

      <div className="space"></div>
      <div className="center small">¿No tienes cuenta? <Link to="/register">Crear cuenta</Link></div>
    </div>
  )
}
