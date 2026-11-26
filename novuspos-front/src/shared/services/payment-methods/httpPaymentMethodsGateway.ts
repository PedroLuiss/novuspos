import { apiClient } from '@/shared/services/apiClient'
import { BILLING_ENDPOINTS } from '@/shared/services/endpoints'
import type { PaymentMethodsGateway } from './paymentMethodsGateway'
import type { PaymentMethodOption } from './types'

/** Endpoint público: el usuario necesita ver las cuentas antes de iniciar sesión de pago. */
export const httpPaymentMethodsGateway: PaymentMethodsGateway = {
  list: () => apiClient.get<PaymentMethodOption[]>(BILLING_ENDPOINTS.paymentMethods),
}
