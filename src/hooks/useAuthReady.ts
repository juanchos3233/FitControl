import { useEffect, useState } from 'react'
import { onAuthStateChanged, User } from 'firebase/auth'
import { auth } from '../firebase'

export function useAuthReady(timeoutMs = 6000){
  const [user, setUser] = useState<User | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(()=>{
    let done = false
    const t = setTimeout(()=>{ if(!done){ setReady(true) } }, timeoutMs)
    const unsub = onAuthStateChanged(auth, (u)=>{
      if(done) return
      setUser(u)
      setReady(true)
      done = true
      clearTimeout(t)
    })
    return ()=>{ done = true; clearTimeout(t); unsub() }
  }, [timeoutMs])

  return { user, ready }
}
