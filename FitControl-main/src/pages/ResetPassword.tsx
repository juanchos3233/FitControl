import { useState } from 'react'
import { sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '../firebase'
import { Link } from 'react-router-dom'
import { isEmail } from '../lib/validators'

export default function ResetPassword(){
  const [email, setEmail] = useState('')
  const [msg, setMsg] = useState<string | null>(null)
  const [err, setErr] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const emailOk = isEmail(email)

  async function onSubmit(e: React.FormEvent){
    e.preventDefault()
    if(!emailOk) return
    setLoading(true); setErr(null); setMsg(null)
    try{
      await sendPasswordResetEmail(auth, email.trim().toLowerCase())
      setMsg('Si tu correo existe, te enviamos instrucciones.')
    }catch(e:any){
      setErr('No se pudo enviar el correo de recuperación. Intenta más tarde.')
    }finally{
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <h2 className="mb4">Restablecer contraseña</h2>
      <p className="small">Te enviaremos un enlace a tu correo</p>
      <div className="space"></div>
      <form onSubmit={onSubmit}>
        <label htmlFor="reset-email">Email</label>
        <div className="input">
          <input
            id="reset-email"
            value={email}
            onChange={e=>setEmail(e.target.value)}
            type="email"
            placeholder="tucorreo@dominio.com"
          />
        </div>
        <div className="space"></div>
        <button className="primary" disabled={!emailOk || loading} type="submit">
          {loading ? 'Enviando...' : 'Enviar enlace'}
        </button>
        {err && <div className="error" role="alert">{err}</div>}
        {msg && <div className="success">{msg}</div>}
      </form>
      <div className="space"></div>
      <div className="center small"><Link to="/login">Volver a iniciar sesión</Link></div>
    </div>
  )
}
