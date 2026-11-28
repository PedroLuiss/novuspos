import { ValidationError } from '@/shared/services/apiClient'
import { hasErrors, validatePaymentDraft } from '../lib/paymentValidation'
import type { SubmitPaymentRequest } from '../types'
import { resolveSubscriptionGateway } from './subscriptionGatewayFactory'

/**
 * Fachada del módulo: valida antes de enviar y es el único punto que conocen
 * los hooks. Cambiar demo por API no afecta a la interfaz.
 */
const gateway = resolveSubscriptionGateway()

function toIssues(errors: ReturnType<typeof validatePaymentDraft>): Record<string, string[]> {
  return Object.fromEntries(
    Object.entries(errors).map(([field, message]) => [field, message ? [message] : []]),
  )
}

export const subscriptionService = {
  getOverview: () => gateway.getOverview(),

  async submitPayment(request: SubmitPaymentRequest) {
    const errors = validatePaymentDraft({
      method: request.method,
      reference: request.reference,
      paidAt: request.paidAt,
      bank: request.bank,
      proofName: request.proofName,
      proofDataUrl: request.proofDataUrl,
      updatedAt: new Date().toISOString(),
    })
    if (hasErrors(errors)) throw new ValidationError(toIssues(errors))
    return gateway.submitPayment(request)
  },
}
