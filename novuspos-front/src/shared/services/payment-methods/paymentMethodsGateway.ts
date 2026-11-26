import type { PaymentMethodOption } from './types'

/** Contrato de solo lectura para el portal; la escritura pertenece al panel maestro. */
export interface PaymentMethodsGateway {
  list(): Promise<PaymentMethodOption[]>
}
