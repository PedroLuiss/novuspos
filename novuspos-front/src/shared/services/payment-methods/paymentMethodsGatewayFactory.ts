import { AUTH_BACKEND } from '@/shared/lib/env'
import { demoPaymentMethodsGateway } from './demoPaymentMethodsGateway'
import { httpPaymentMethodsGateway } from './httpPaymentMethodsGateway'
import type { PaymentMethodsGateway } from './paymentMethodsGateway'

/** Demo por defecto; con `VITE_AUTH_MODE=api` se consume el catálogo de Laravel. */
export function resolvePaymentMethodsGateway(): PaymentMethodsGateway {
  return AUTH_BACKEND === 'api' ? httpPaymentMethodsGateway : demoPaymentMethodsGateway
}
