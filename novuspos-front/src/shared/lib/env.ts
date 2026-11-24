/** Configuración de entorno tipada y centralizada. */

export type AuthBackend = 'demo' | 'api'

/** Sin backend disponible, el modo demo es el predeterminado. */
export const AUTH_BACKEND: AuthBackend = import.meta.env.VITE_AUTH_MODE === 'api' ? 'api' : 'demo'

export const IS_DEMO_AUTH = AUTH_BACKEND === 'demo'

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'
