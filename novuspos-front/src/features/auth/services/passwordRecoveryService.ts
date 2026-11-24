import type { AuthSession } from '@/shared/lib/auth-types'
import type { ForgotPasswordRequest, ResetPasswordRequest } from '../types'
import { resolvePasswordRecoveryGateway } from './passwordRecoveryGatewayFactory'
import type { PasswordRecoveryGateway } from './passwordRecoveryGateway'

/** Casos de uso con inyección de dependencias (DIP). */
export const requestPasswordResetUseCase = {
  execute(request: ForgotPasswordRequest, gateway: PasswordRecoveryGateway = resolvePasswordRecoveryGateway()): Promise<void> {
    return gateway.requestLink(request)
  },
}

export const resetPasswordUseCase = {
  execute(request: ResetPasswordRequest, gateway: PasswordRecoveryGateway = resolvePasswordRecoveryGateway()): Promise<AuthSession> {
    return gateway.reset(request)
  },
}
