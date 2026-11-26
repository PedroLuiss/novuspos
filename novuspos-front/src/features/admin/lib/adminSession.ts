/** Sesión aislada del super administrador; no comparte storage con el cliente. */
import type { AdminSession } from '../types'

const KEY = 'novuspos:admin-session'

export const adminSessionStore = {
  read(): AdminSession | null {
    try {
      const raw = window.localStorage.getItem(KEY)
      if (!raw) return null
      const parsed = JSON.parse(raw) as AdminSession
      return parsed?.token ? parsed : null
    } catch {
      return null
    }
  },
  save(session: AdminSession): void {
    window.localStorage.setItem(KEY, JSON.stringify(session))
  },
  clear(): void {
    window.localStorage.removeItem(KEY)
  },
}
