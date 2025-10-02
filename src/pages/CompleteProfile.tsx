import { useEffect, useRef, useState } from 'react'
import { auth, db } from '../firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, setDoc, serverTimestamp, getDoc } from 'firebase/firestore'
import { isName, isNonEmpty } from '../lib/validators'
import { useNavigate, Link } from 'react-router-dom'

export default function CompleteProfile(){
  const [nombre, setNombre] = useState('')
  const [apellido, setApellido] = useState('')
  const [direccion, setDireccion] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  const [uid, setUid] = useState<string | null>(null)
  const [email, setEmail] = useState<string>('')
  const cancelled = useRef(false)

  useEffect(()=>{
    cancelled.current = false
    const unsub = onAuthStateChanged(auth, async (u)=>{
      if(!u){ navigate('/login'); return }
      setUid(u.uid); setEmail(u.email || '')
      const ref = doc(db, 'users', u.uid)
      try{
        const snap = await getDoc(ref)
        if(snap.exists()){ navigate('/dashboard', { replace: true }); return }
      }catch{}
      const display = (u.displayName || '').trim()
      if(display){
        const parts = display.split(' ')
        setNombre(parts[0] || ''); setApellido(parts.slice(1).join(' ') || '')
      }
      if(!cancelled.current) setLoading(false)
    })

    const t = setTimeout(()=>{ if(loading){ setLoading(false); setError('Tiempo de espera agotado. Revisa la conexión/credenciales.') } }, 6000)
    return ()=>{ cancelled.current = true; clearTimeout(t); unsub() }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const nombreOk = isName(nombre)
  const apellidoOk = isName(apellido)
  const direccionOk = isNonEmpty(direccion)
  const formOk = nombreOk && apellidoOk && direccionOk

  async function onSubmit(e: React.FormEvent){
    e.preventDefault()
    if(!formOk || !uid) return
    setSaving(true); setError(null)
    try{
      await setDoc(doc(db, 'users', uid), {
        id: uid,
        email: email.toLowerCase(),
        nombre: nombre.trim(),
        apellido: apellido.trim(),
        direccion: direccion.trim(),
        emailVerified: auth.currentUser?.emailVerified ?? false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
      navigate('/dashboard', { replace: true })
    }catch(e:any){
      setError('No se pudo guardar el perfil. Intenta nuevamente.')
    }finally{
      setSaving(false)
    }
  }

  if(loading) return <div className="card"><p>Cargando...</p></div>

  return (
    <div className="card">
      <h2 className="mb4">Completar perfil</h2>
      <p className="small">Tu cuenta está creada. Falta guardar tus datos básicos.</p>
      <div className="space"></div>

      <form onSubmit={onSubmit}>
        <label>Nombre</label>
        <div className="input"><input value={nombre} onChange={e=>setNombre(e.target.value)} placeholder="Juan" aria-invalid="false" /></div>
        {!nombreOk && nombre.length>0 && <div className="error" role="alert">Nombre inválido (2–50, sin dígitos)</div>}

        <label>Apellido</label>
        <div className="input"><input value={apellido} onChange={e=>setApellido(e.target.value)} placeholder="Pérez" aria-invalid="false" /></div>
        {!apellidoOk && apellido.length>0 && <div className="error" role="alert">Apellido inválido (2–50, sin dígitos)</div>}

        <label>Dirección</label>
        <div className="input"><input value={direccion} onChange={e=>setDireccion(e.target.value)} placeholder="Calle 1 # 2-34" aria-invalid="false" /></div>
        {!direccionOk && direccion.length>0 && <div className="error" role="alert">La dirección es obligatoria (máx. 120)</div>}

        <div className="space"></div>
        <button className="primary" type="submit" disabled={!formOk || saving}>
          {saving ? 'Guardando...' : 'Guardar perfil'}
        </button>
        {error && <div className="error" role="alert">{error}</div>}
      </form>

      <div className="space"></div>
      <div className="center small">
        ¿No eres tú? <Link to="/login">Cerrar sesión e iniciar con otra cuenta</Link>
      </div>
    </div>
  )
}
