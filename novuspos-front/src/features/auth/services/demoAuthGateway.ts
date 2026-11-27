import type { AuthSession } from '@/shared/lib/auth-types'
import { ValidationError } from '@/shared/services/apiClient'
import type { LoginCredentials, RegisterCredentials } from '../types'
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

  async register(credentials: RegisterCredentials): Promise<AuthSession> {
    await new Promise((resolve) => window.setTimeout(resolve, DEMO_DELAY_MS))

    const issues: Record<string, string[]> = {}
    if (!credentials.name.trim()) issues.name = ['El nombre es obligatorio.']
    if (!credentials.organization_name.trim()) issues.organization_name = ['El nombre del negocio es obligatorio.']
    if (!credentials.business_sector) issues.business_sector = ['Selecciona el tipo de comercio.']
    if (!credentials.email.includes('@')) issues.email = ['Escribe un correo válido para continuar.']
    if (credentials.password.length < 8) issues.password = ['La contraseña debe tener al menos 8 caracteres.']
    if (Object.keys(issues).length > 0) throw new ValidationError(issues)

    return {
      token: `demo-token-${Date.now()}`,
      user: {
        id: 'demo-user-1',
        email: credentials.email,
        organizationName: credentials.organization_name,
        role: 'client',
      },
    }
  },
}
