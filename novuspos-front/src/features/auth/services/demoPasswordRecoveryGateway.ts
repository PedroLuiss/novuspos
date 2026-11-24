import type { AuthSession } from '@/shared/lib/auth-types'
import { ApiError, ValidationError } from '@/shared/services/apiClient'
import { isStrongPassword } from '../lib/passwordStrength'
import type { ForgotPasswordRequest, ResetPasswordRequest } from '../types'
import type { PasswordRecoveryGateway } from './passwordRecoveryGateway'

const DEMO_DELAY_MS = 350
export const DEMO_RESET_TOKEN = 'demo-reset-token'

/** Adaptador de prueba: mismo contrato que el real, sin red. */
export const demoPasswordRecoveryGateway: PasswordRecoveryGateway = {
  async requestLink({ email }: ForgotPasswordRequest): Promise<void> {
    await new Promise((resolve) => window.setTimeout(resolve, DEMO_DELAY_MS))
    if (!email.includes('@')) {
      throw new ValidationError({ email: ['Escribe un correo válido para continuar.'] })
    }
  },

  async reset({ token, email, password }: ResetPasswordRequest): Promise<AuthSession> {
    await new Promise((resolve) => window.setTimeout(resolve, DEMO_DELAY_MS))

    if (!token) {
      throw new ApiError(400, 'Este enlace ya no es válido. Solicita uno nuevo.')
    }
    if (!isStrongPassword(password)) {
      throw new ValidationError({
        password: ['Usa al menos 8 caracteres, con mayúsculas, minúsculas, un número y un símbolo.'],
      })
    }

    return {
      token: `demo-reset-${Date.now()}`,
      user: {
        id: 'demo-user-1',
        email: email ?? 'demo@tunegocio.com',
        organizationName: 'Minisúper Las Palmas',
        role: 'admin',
      },
    }
  },
}
