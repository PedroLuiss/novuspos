/** Tipos públicos del feature de autenticación. */
export type AuthMode = 'register' | 'login'
export type RecoveryMode = 'request' | 'reset'

export interface LoginCredentials {
  email: string
  password: string
}

/** Solicitud de enlace de recuperación. */
export interface ForgotPasswordRequest {
  email: string
}

/** Datos que viajan en el enlace enviado al correo. */
export interface RecoveryLinkParams {
  token: string | null
  email: string | null
}

/** Cuerpo esperado por el endpoint de restablecimiento. */
export interface ResetPasswordRequest {
  token: string
  email: string | null
  password: string
}
