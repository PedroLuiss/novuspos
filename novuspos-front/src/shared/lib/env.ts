/** Configuración de entorno tipada y centralizada. */

export type AuthBackend = 'demo' | 'api'

/** Sin backend disponible, el modo demo es el predeterminado. */
export const AUTH_BACKEND: AuthBackend = import.meta.env.VITE_AUTH_MODE === 'api' ? 'api' : 'demo'

export const IS_DEMO_AUTH = AUTH_BACKEND === 'demo'

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'

/** Configuración del servidor Reverb (clave pública; el secreto solo vive en la API). */
export const REVERB_CONFIG = {
  key: import.meta.env.VITE_REVERB_APP_KEY || 'zf4aifkhk3ayssh79too',
  host: import.meta.env.VITE_REVERB_HOST || 'localhost',
  port: Number(import.meta.env.VITE_REVERB_PORT || 8080),
  scheme: import.meta.env.VITE_REVERB_SCHEME || 'http',
} as const
