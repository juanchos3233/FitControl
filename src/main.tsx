// src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom'
import './index.css'
import App from './App'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import ResetPassword from './pages/ResetPassword'
import CompleteProfile from './pages/CompleteProfile'
import ProtectedRoute from './pages/ProtectedRoute'
import Navbar from './components/Navbar' // <-- importante: import de Navbar
import Welcome from './pages/Welcome'
import GoalSelection from './pages/GoalSelection'

// 🆕 Nuevos imports (rutinas y perfil)
import Rutinas from './pages/Rutinas'
import Perfil from './pages/Perfil'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Welcome /> },  // 👈 Pantalla de inicio
      { path: '/login', element: <Login /> },
      { path: '/register', element: <Register /> },
      { path: '/reset-password', element: <ResetPassword /> },
      

      {
        element: <ProtectedRoute />,
        children: [
          
          { path: '/dashboard', element: <Dashboard /> },
          { path: '/complete-profile', element: <CompleteProfile /> },
          { path: '/objetivos', element: <GoalSelection /> },
          // 🆕 Se agregan las nuevas rutas protegidas
          { path: '/rutinas', element: <Rutinas /> },
          { path: '/perfil', element: <Perfil /> },
        ],
      },
    ],
    
  },
  { path: '/', element: <App />, children: [
    { index: true, element: <Login /> },
    { path: '/login', element: <Login /> },
    { path: '/register', element: <Register /> },
    { path: '/reset-password', element: <ResetPassword /> },

    // Rutas protegidas: las dejamos dentro del ProtectedRoute.
    // Envolvemos las rutas protegidas en un fragmento que renderiza el <Outlet/> (las páginas)
    // y además la <Navbar/>. Esto garantiza que la navbar solo aparezca aquí.
    { element: <ProtectedRoute />, children: [
      {
        element: (
          <>
            <Outlet />
            <Navbar />
          </>
        ),
        children: [
          { path: '/dashboard', element: <Dashboard /> },
          { path: '/complete-profile', element: <CompleteProfile /> },
          // 🆕 Se agregan también aquí para asegurar navegación por Navbar
          { path: '/rutinas', element: <Rutinas /> },
          { path: '/perfil', element: <Perfil /> },
        ]
      }
    ]},
  ]}
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
