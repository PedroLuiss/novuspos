/** Tipos compartidos de la sesión (sin dependencias de UI ni de transporte). */

export type UserRole = string

export interface AuthUser {
  id: string
  name?: string
  email: string
  organizationName: string
  businessSector?: string | null
  role: UserRole
  emailVerifiedAt?: string | null
}

export type AuthUserUpdate = Partial<AuthUser>

export interface AuthSession {
  token: string
  user: AuthUser
}
