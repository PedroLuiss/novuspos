import type { AuthSession } from '@/shared/lib/auth-types'
import { apiClient, type LoginResponse } from '@/shared/services/apiClient'
import { AUTH_ENDPOINTS } from '@/shared/services/endpoints'
import type { LoginCredentials, RegisterCredentials } from '../types'
import type { AuthGateway } from './authGateway'

/** Adaptador real: llama al endpoint de la API cuando esté disponible. */
export const httpAuthGateway: AuthGateway = {
  async login(credentials: LoginCredentials): Promise<AuthSession> {
    const response = await apiClient.post<LoginResponse>(AUTH_ENDPOINTS.login, credentials)
    return { token: response.token, user: response.user }
  },

  async register(credentials: RegisterCredentials): Promise<AuthSession> {
    const response = await apiClient.post<LoginResponse>(AUTH_ENDPOINTS.register, credentials)
    return { token: response.token, user: response.user }
  },
}
