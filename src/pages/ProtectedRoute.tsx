import { Navigate, Outlet } from 'react-router-dom'
import { useAuthReady } from '../hooks/useAuthReady'

export default function ProtectedRoute(){
  const { user, ready } = useAuthReady()
  if(!ready){
    return <div className="card"><p>Cargando...</p></div>
  }
  if(!user){
    return <Navigate to="/login" replace />
  }
  return <Outlet />
}
