import { AuthPage } from '@/app/AuthPage'
import { LandingPage } from '@/app/LandingPage'
import { PanelPage } from '@/app/PanelPage'

/** Punto de entrada de la app web. La composición vive en app/. */
export default function App() {
  const path = window.location.pathname

  if (path.startsWith('/auth')) {
    return <AuthPage initialMode={path.includes('login') ? 'login' : 'register'} />
  }

  if (path.startsWith('/panel')) {
    return <PanelPage />
  }

  return <LandingPage />
}
