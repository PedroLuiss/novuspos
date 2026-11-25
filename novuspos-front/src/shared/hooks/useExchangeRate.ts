import { useCallback, useEffect, useState } from 'react'
import { exchangeRateService } from '@/shared/services/exchange-rate/exchangeRateService'
import type { ExchangeRate } from '@/shared/services/exchange-rate/types'

/** Contenedor de la tasa del día: una sola carga y opción de reintentar. */
export function useExchangeRate() {
  const [rate, setRate] = useState<ExchangeRate | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(() => {
    setIsLoading(true)
    setError(null)
    return exchangeRateService
      .getToday()
      .then(setRate)
      .catch(() => setError('No pudimos consultar la tasa del día.'))
      .finally(() => setIsLoading(false))
  }, [])

  useEffect(() => {
    void Promise.resolve().then(() => void refresh())
  }, [refresh])

  return { rate, isLoading, error, refresh }
}
