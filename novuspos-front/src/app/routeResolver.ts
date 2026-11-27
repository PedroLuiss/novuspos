import { resolveAdminSection, type AdminSection } from '@/features/admin/core/config/adminSections'
import { getAdminLoginPath } from '@/features/admin/core/lib/adminSettings'
import type { AuthMode, RecoveryMode } from '@/features/auth/types'
import type { PanelSection } from './PanelPage'

/** Decisión de ruta pura y testeable; la UI no conoce detalles del pathname. */
export type AppRoute =
  | { view: 'auth'; mode: AuthMode }
  | { view: 'recovery'; mode: RecoveryMode }
  | { view: 'panel'; section: PanelSection }
  | { view: 'admin-login' }
  | { view: 'admin'; section: AdminSection }
  | { view: 'landing' }

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
