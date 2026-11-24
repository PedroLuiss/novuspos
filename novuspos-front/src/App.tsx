import { AuthPage } from '@/app/AuthPage'
import { LandingPage } from '@/app/LandingPage'
import { PanelPage } from '@/app/PanelPage'
import { resolveAppRoute } from '@/app/routeResolver'
import { ProtectedRoute } from '@/shared/components/ProtectedRoute'

/** Punto de entrada de la app web: solo compone la vista resuelta. */
export default function App() {
  const route = resolveAppRoute(window.location.pathname)

  if (route.view === 'auth') return <AuthPage initialMode={route.mode} />

  if (route.view === 'panel') {
    return (
      <ProtectedRoute>
        <PanelPage />
      </ProtectedRoute>
    )
  }

  return <LandingPage />
}
