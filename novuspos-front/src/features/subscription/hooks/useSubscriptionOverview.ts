import { useCallback, useEffect, useState } from 'react'
import { subscriptionService } from '../services/subscriptionService'
import type { BillingOverview } from '../services/subscriptionGateway'

/** Carga planes, suscripción e historial; mantiene el estado tras pagar o evaluar. */
export function useSubscriptionOverview() {
  const [overview, setOverview] = useState<BillingOverview | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reviewingId, setReviewingId] = useState<string | null>(null)

  const refresh = useCallback(() => {
    setIsLoading(true)
    setError(null)
    return subscriptionService
      .getOverview()
      .then(setOverview)
      .catch(() => setError('No pudimos cargar tu suscripción. Inténtalo de nuevo.'))
      .finally(() => setIsLoading(false))
  }, [])

  useEffect(() => {
    // Diferir la carga mantiene el primer render sin actualizaciones de estado.
    void Promise.resolve().then(() => void refresh())
  }, [refresh])

  const reviewPayment = useCallback(async (paymentId: string, approved: boolean) => {
    setReviewingId(paymentId)
    setError(null)
    try {
      const result = await subscriptionService.reviewPayment(paymentId, approved)
      setOverview((current) =>
        current
          ? {
              ...current,
              subscription: result.subscription,
              payments: current.payments.map((item) => (item.id === result.payment.id ? result.payment : item)),
            }
          : current,
      )
    } catch {
      setError('No pudimos actualizar el pago. Inténtalo de nuevo.')
    } finally {
      setReviewingId(null)
    }
  }, [])

  return { overview, isLoading, error, reviewingId, refresh, reviewPayment }
}
