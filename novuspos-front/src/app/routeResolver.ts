import { getAdminLoginPath } from '@/features/admin/lib/adminSettings'
import type { AuthMode, RecoveryMode } from '@/features/auth/types'
import type { AdminSection } from './AdminPage'
import type { PanelSection } from './PanelPage'

/** Decisión de ruta pura y testeable; la UI no conoce detalles del pathname. */
export type AppRoute =
  | { view: 'auth'; mode: AuthMode }
  | { view: 'recovery'; mode: RecoveryMode }
  | { view: 'panel'; section: PanelSection }
  | { view: 'admin-login' }
  | { view: 'admin'; section: AdminSection }
  | { view: 'landing' }

function resolveAdminSection(pathname: string): AdminSection {
  if (pathname.startsWith('/administracion/suscripciones')) return 'plans'
  if (pathname.startsWith('/administracion/landing')) return 'landing'
  if (pathname.startsWith('/administracion/pagos')) return 'payments'
  if (pathname.startsWith('/administracion/usuarios')) return 'users'
  if (pathname.startsWith('/administracion/reportes')) return 'reports'
  if (pathname.startsWith('/administracion/notificaciones')) return 'notifications'
  if (pathname.startsWith('/administracion/correos')) return 'emails'
  if (pathname.startsWith('/administracion/ajustes')) return 'settings'
  return 'overview'
}

export function resolveAppRoute(pathname: string): AppRoute {
  // El acceso maestro tiene prioridad sobre cualquier otra ruta.
  if (pathname === getAdminLoginPath()) return { view: 'admin-login' }
  if (pathname.startsWith('/administracion')) return { view: 'admin', section: resolveAdminSection(pathname) }
  // Las rutas específicas van antes que el prefijo genérico /auth.
  if (pathname.startsWith('/auth/recuperar')) return { view: 'recovery', mode: 'request' }
  if (pathname.startsWith('/auth/restablecer')) return { view: 'recovery', mode: 'reset' }
  if (pathname.startsWith('/auth')) {
    return { view: 'auth', mode: pathname.includes('login') ? 'login' : 'register' }
  }
  if (pathname.startsWith('/panel/suscripcion')) return { view: 'panel', section: 'subscription' }
  if (pathname.startsWith('/panel/respaldos')) return { view: 'panel', section: 'backups' }
  if (pathname.startsWith('/panel/soporte')) return { view: 'panel', section: 'support' }
  if (pathname.startsWith('/panel')) return { view: 'panel', section: 'general' }
  return { view: 'landing' }
}
