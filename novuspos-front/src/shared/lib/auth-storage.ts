import type { AuthSession, AuthUser } from './auth-types'

const TOKEN_KEY = 'novuspos.auth.token'
const USER_KEY = 'novuspos.auth.user'
const TOKEN_COOKIE = 'novuspos_token'

/** Contrato de persistencia de sesión (Repository); el provider puede inyectar otro. */
export interface SessionStore {
  getToken(): string | null
  getUser(): AuthUser | null
  save(session: AuthSession): void
  clear(): void
}

function readCookie(name: string): string | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`))
  return match ? decodeURIComponent(match[1]) : null
}

function writeCookie(name: string, value: string, maxAge: number): void {
  if (typeof document === 'undefined') return
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; SameSite=Lax`
}

/** Implementación concreta: localStorage + cookie de respaldo para el token. */
export const sessionStore: SessionStore = {
  getToken() {
    if (typeof window === 'undefined') return null
    return window.localStorage.getItem(TOKEN_KEY) ?? readCookie(TOKEN_COOKIE)
  },

  getUser() {
    if (typeof window === 'undefined') return null
    const raw = window.localStorage.getItem(USER_KEY)
    if (!raw) return null
    try {
      return JSON.parse(raw) as AuthUser
    } catch {
      window.localStorage.removeItem(USER_KEY)
      return null
    }
  },

  save(session) {
    window.localStorage.setItem(TOKEN_KEY, session.token)
    window.localStorage.setItem(USER_KEY, JSON.stringify(session.user))
    writeCookie(TOKEN_COOKIE, session.token, 60 * 60 * 24 * 30)
  },

  clear() {
    window.localStorage.removeItem(TOKEN_KEY)
    window.localStorage.removeItem(USER_KEY)
    writeCookie(TOKEN_COOKIE, '', -1)
  },
}
