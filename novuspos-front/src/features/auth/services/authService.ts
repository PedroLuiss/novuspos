import type { AuthSession } from '@/shared/lib/auth-types'
import type { LoginCredentials, RegisterCredentials } from '../types'
import { resolveAuthGateway } from './authGatewayFactory'
import type { AuthGateway } from './authGateway'

/** Caso de uso con inyección de dependencias (DIP). */
export const loginUseCase = {
  execute(credentials: LoginCredentials, gateway: AuthGateway = resolveAuthGateway()): Promise<AuthSession> {
    return gateway.login(credentials)
  },
}

export const registerUseCase = {
  execute(credentials: RegisterCredentials, gateway: AuthGateway = resolveAuthGateway()): Promise<AuthSession> {
    return gateway.register(credentials)
  },
}
