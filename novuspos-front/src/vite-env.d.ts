/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL?: string
  readonly VITE_AUTH_MODE?: 'demo' | 'api'
  /** Ruta opcional de Laravel para la tasa; vacío usa la API pública del BCV. */
  readonly VITE_EXCHANGE_RATE_API_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
