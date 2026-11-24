import type { AuthSession } from '@/shared/lib/auth-types'
import { ValidationError } from '@/shared/services/apiClient'
import type { LoginCredentials } from '../types'
import type { AuthGateway } from './authGateway'

const DEMO_DELAY_MS = 350

/** Adaptador de prueba: misma interfaz y contrato que el real, sin red. */
export const demoAuthGateway: AuthGateway = {
  async login({ email, password }: LoginCredentials): Promise<AuthSession> {
    await new Promise((resolve) => window.setTimeout(resolve, DEMO_DELAY_MS))

    if (!email.includes('@')) {
      throw new ValidationError({ email: ['Escribe un correo válido para continuar.'] })
    }
    if (password.length < 4) {
      throw new ValidationError({ password: ['La contraseña debe tener al menos 4 caracteres.'] })
    }

    return {
      token: `demo-token-${Date.now()}`,
      user: {
        id: 'demo-user-1',
        email,
        organizationName: 'Minisúper Las Palmas',
        role: 'admin',
      },
    }
  },
}
