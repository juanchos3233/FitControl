import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import App from './App'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import ResetPassword from './pages/ResetPassword'
import CompleteProfile from './pages/CompleteProfile'
import ProtectedRoute from './pages/ProtectedRoute'

const router = createBrowserRouter([
  { path: '/', element: <App />, children: [
    { index: true, element: <Login /> },
    { path: '/login', element: <Login /> },
    { path: '/register', element: <Register /> },
    { path: '/reset-password', element: <ResetPassword /> },

    { element: <ProtectedRoute />, children: [
      { path: '/dashboard', element: <Dashboard /> },
      { path: '/complete-profile', element: <CompleteProfile /> },
    ]},
  ]}
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
