import { useCallback, useEffect, useState } from 'react'
import { subscriptionService } from '../services/subscriptionService'
import type { BillingOverview } from '../services/subscriptionGateway'

/** Carga planes, suscripción e historial; el pago se reporta, pero la evaluación la hace el super admin. */
export function useSubscriptionOverview() {
  const [overview, setOverview] = useState<BillingOverview | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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

  return { overview, isLoading, error, refresh }
}
