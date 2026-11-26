import { useCallback, useEffect, useState } from 'react'
import { plansService } from '../services/plans/plansService'
import type { PlanOption } from '../services/plans/types'

/** Catálogo público de suscripciones, con respaldo local si falla la API. */
export function usePlans() {
  const [plans, setPlans] = useState<PlanOption[]>(() => plansService.readCached())
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(() => {
    setIsLoading(true)
    setError(null)
    return plansService
      .list()
      .then(setPlans)
      .catch(() => {
        setPlans(plansService.readCached())
        setError('No pudimos actualizar las suscripciones. Mostramos las disponibles.')
      })
      .finally(() => setIsLoading(false))
  }, [])

  useEffect(() => {
    void Promise.resolve().then(() => void refresh())
  }, [refresh])

  return { plans, isLoading, error, refresh }
}
