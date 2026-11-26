import { AdminPage } from '@/app/AdminPage'
import { AuthPage } from '@/app/AuthPage'
import { ForgotPasswordPage } from '@/app/ForgotPasswordPage'
import { LandingPage } from '@/app/LandingPage'
import { PanelPage } from '@/app/PanelPage'
import { ResetPasswordPage } from '@/app/ResetPasswordPage'
import { resolveAppRoute } from '@/app/routeResolver'
import { AdminGate } from '@/features/admin/components/AdminGate'
import { AdminLoginPage } from '@/features/admin/components/AdminLoginPage'
import { ProtectedRoute } from '@/shared/components/ProtectedRoute'

/** Punto de entrada de la app web: solo compone la vista resuelta. */
export default function App() {
  const route = resolveAppRoute(window.location.pathname)

  if (route.view === 'admin-login') return <AdminLoginPage />

  if (route.view === 'admin') {
    return (
      <AdminGate>
        <AdminPage section={route.section} />
      </AdminGate>
    )
  }

  if (route.view === 'auth') return <AuthPage initialMode={route.mode} />

  if (route.view === 'recovery') {
    return route.mode === 'request' ? <ForgotPasswordPage /> : <ResetPasswordPage />
  }

  if (route.view === 'panel') {
    return (
      <ProtectedRoute>
        <PanelPage section={route.section} />
      </ProtectedRoute>
    )
  }

  return <LandingPage />
}
