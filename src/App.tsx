import { Outlet } from 'react-router-dom'
import Logo from './components/logo.js'   

export default function App(){
  return (
    <div className="container">
      <div className="shell">
        <div className="header-logo">
          <Logo />
        </div>
        <Outlet />
        <div className="space"></div>
        <p className="small center">© {new Date().getFullYear()} FitControl</p>
      </div>
    </div>
  )
}
