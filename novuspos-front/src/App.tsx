import { AuthPage } from '@/app/AuthPage'
import { LandingPage } from '@/app/LandingPage'
import { useHashRoute } from '@/shared/hooks/useHashRoute'

/** Punto de entrada de la app web. La composición vive en app/. */
export default function App() {
  const hash = useHashRoute()

  if (hash.startsWith('#/auth')) {
    return <AuthPage initialMode={hash.includes('login') ? 'login' : 'register'} />
  }

  return <LandingPage />
}
