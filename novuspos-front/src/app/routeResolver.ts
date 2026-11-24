import type { AuthMode } from '@/features/auth/types'

/** Decisión de ruta pura y testeable; la UI no conoce detalles del pathname. */
export type AppRoute =
  | { view: 'auth'; mode: AuthMode }
  | { view: 'panel' }
  | { view: 'landing' }

export function resolveAppRoute(pathname: string): AppRoute {
  if (pathname.startsWith('/auth')) {
    return { view: 'auth', mode: pathname.includes('login') ? 'login' : 'register' }
  }
  if (pathname.startsWith('/panel')) return { view: 'panel' }
  return { view: 'landing' }
}
