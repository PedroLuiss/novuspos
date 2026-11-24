/** Tipos públicos del feature de autenticación. */
export type AuthMode = 'register' | 'login'

export interface LoginCredentials {
  email: string
  password: string
}
