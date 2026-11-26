import { useCallback, useEffect, useMemo, useState } from 'react'
import { paymentMethodsService } from '../services/payment-methods/paymentMethodsService'
import type { PaymentMethodOption } from '../services/payment-methods/types'

/** Contenedor del catálogo de cobro: el portal solo lee lo que configuró el dueño. */
export function usePaymentMethods() {
  const [methods, setMethods] = useState<PaymentMethodOption[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(() => {
    setIsLoading(true)
    setError(null)
    return paymentMethodsService
      .list()
      .then((data) => setMethods(data))
      .catch(() => {
        setMethods(paymentMethodsService.readCached())
        setError('No pudimos actualizar los métodos de pago. Mostramos los últimos disponibles.')
      })
      .finally(() => setIsLoading(false))
  }, [])

  useEffect(() => {
    void Promise.resolve().then(() => void refresh())
  }, [refresh])

  const activeMethods = useMemo(() => methods.filter((item) => item.active), [methods])

  return { methods, activeMethods, isLoading, error, refresh }
}
