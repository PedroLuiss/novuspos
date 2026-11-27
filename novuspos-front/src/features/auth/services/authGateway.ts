import type { AuthSession } from '@/shared/lib/auth-types'
import type { LoginCredentials, RegisterCredentials } from '../types'

/** Puerto de autenticación: el caso de uso no conoce el backend. */
export interface AuthGateway {
  login(credentials: LoginCredentials): Promise<AuthSession>
  register(credentials: RegisterCredentials): Promise<AuthSession>
}
