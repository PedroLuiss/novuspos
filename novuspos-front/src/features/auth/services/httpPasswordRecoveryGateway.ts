import type { AuthSession } from '@/shared/lib/auth-types'
import { apiClient, type LoginResponse } from '@/shared/services/apiClient'
import { AUTH_ENDPOINTS } from '@/shared/services/endpoints'
import type { ForgotPasswordRequest, ResetPasswordRequest } from '../types'
import type { PasswordRecoveryGateway } from './passwordRecoveryGateway'

/** Adaptador real: llama a los endpoints de recuperación cuando existan. */
export const httpPasswordRecoveryGateway: PasswordRecoveryGateway = {
  async requestLink(request: ForgotPasswordRequest): Promise<void> {
    await apiClient.post<void>(AUTH_ENDPOINTS.forgotPassword, request)
  },

  async reset(request: ResetPasswordRequest): Promise<AuthSession> {
    const response = await apiClient.post<LoginResponse>(AUTH_ENDPOINTS.resetPassword, request)
    return { token: response.token, user: response.user }
  },
}
