/** Ajustes locales del dueño: ruta secreta de acceso y datos de la empresa. */
import type { AdminSettings } from '../types'

const KEY = 'novuspos:admin-settings'

export const DEFAULT_ADMIN_SETTINGS: AdminSettings = {
  companyName: 'NovusPOS',
  contactEmail: 'dueno@novuspos.com',
  phone: '+58 400-0000000',
  address: 'Caracas, Venezuela',
  loginPath: '/acceso-maestro',
}

/** Normaliza una ruta de acceso a un path limpio y seguro. */
export function normalizeLoginPath(value: string): string | null {
  const path = value.trim().toLowerCase().replace(/\/+$/, '')
  if (!path.startsWith('/')) return null
  if (!/^\/[a-z0-9-]+(?:\/[a-z0-9-]+)*$/.test(path)) return null
  if (['/', '/auth', '/panel', '/administracion'].includes(path)) return null
  return path
}

export const adminSettingsStore = {
  read(): AdminSettings {
    try {
      const raw = window.localStorage.getItem(KEY)
      if (!raw) return { ...DEFAULT_ADMIN_SETTINGS }
      const parsed = JSON.parse(raw) as Partial<AdminSettings>
      return { ...DEFAULT_ADMIN_SETTINGS, ...parsed }
    } catch {
      return { ...DEFAULT_ADMIN_SETTINGS }
    }
  },
  save(settings: AdminSettings): void {
    window.localStorage.setItem(KEY, JSON.stringify(settings))
  },
}

/** Se usa desde el resolver de rutas para ubicar el login configurable. */
export function getAdminLoginPath(): string {
  return normalizeLoginPath(adminSettingsStore.read().loginPath) ?? DEFAULT_ADMIN_SETTINGS.loginPath
}
