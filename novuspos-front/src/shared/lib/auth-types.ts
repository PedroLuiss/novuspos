/** Tipos compartidos de la sesión (sin dependencias de UI ni de transporte). */

export type UserRole = string

export interface AuthUser {
  id: string
  email: string
  organizationName: string
  role: UserRole
}

export type AuthUserUpdate = Partial<AuthUser>

export interface AuthSession {
  token: string
  user: AuthUser
}
