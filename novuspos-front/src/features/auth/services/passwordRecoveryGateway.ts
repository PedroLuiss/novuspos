import type { AuthSession } from '@/shared/lib/auth-types'
import type { ForgotPasswordRequest, ResetPasswordRequest } from '../types'

/** Puerto de recuperación: los casos de uso no conocen el backend. */
export interface PasswordRecoveryGateway {
  requestLink(request: ForgotPasswordRequest): Promise<void>
  reset(request: ResetPasswordRequest): Promise<AuthSession>
}
