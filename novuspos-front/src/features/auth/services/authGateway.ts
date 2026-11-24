import type { AuthSession } from '@/shared/lib/auth-types'
import type { LoginCredentials } from '../types'

/** Puerto de autenticación: el caso de uso no conoce el backend. */
export interface AuthGateway {
  login(credentials: LoginCredentials): Promise<AuthSession>
}
