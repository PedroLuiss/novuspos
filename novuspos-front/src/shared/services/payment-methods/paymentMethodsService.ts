import { resolvePaymentMethodsGateway } from './paymentMethodsGatewayFactory'
import { paymentMethodsStore } from './paymentMethodsStore'
import type { PaymentMethodOption } from './types'

const gateway = resolvePaymentMethodsGateway()

/**
 * Fachada de solo lectura para el portal. El catálogo lo escribe el dueño desde
 * Ajustes; aquí solo se consulta para mostrarlo al pagar una suscripción.
 */
export const paymentMethodsService = {
  list(): Promise<PaymentMethodOption[]> {
    return gateway.list()
  },
  /** Último catálogo conocido, para no dejar al usuario sin datos si falla la API. */
  readCached(): PaymentMethodOption[] {
    return paymentMethodsStore.read()
  },
}
