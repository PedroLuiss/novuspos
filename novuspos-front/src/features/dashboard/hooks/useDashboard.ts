import { useCallback, useEffect, useState } from 'react'
import { dashboardService } from '../services/dashboardService'
import type { DashboardSummary } from '../types'

/** Contenedor del panel: una sola carga del resumen con clave, suscripción y respaldo. */
export function useDashboard() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(() => {
    setIsLoading(true)
    setError(null)
    return dashboardService
      .getOverview()
      .then(setSummary)
      .catch(() => setError('No pudimos cargar tu panel. Inténtalo de nuevo.'))
      .finally(() => setIsLoading(false))
  }, [])

  useEffect(() => {
    void Promise.resolve().then(() => void refresh())
  }, [refresh])

  return { summary, isLoading, error, refresh }
}
