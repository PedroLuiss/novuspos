import { useCallback, useEffect, useState } from 'react'
import { adminService } from '../services/adminService'
import type { AdminPayment } from '../types'

export function useAdminPayments() {
  const [payments, setPayments] = useState<AdminPayment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(() => {
    setIsLoading(true)
    return adminService
      .listPayments()
      .then(setPayments)
      .catch(() => setError('No pudimos cargar los pagos.'))
      .finally(() => setIsLoading(false))
  }, [])

  useEffect(() => {
    void Promise.resolve().then(() => void refresh())
  }, [refresh])

  const review = useCallback(async (paymentId: string, approved: boolean, note?: string) => {
    setBusyId(paymentId)
    setError(null)
    try {
      const updated = await adminService.reviewPayment(paymentId, approved, note)
      setPayments((current) => current.map((item) => (item.id === updated.id ? updated : item)))
    } catch {
      setError('No pudimos evaluar el pago. Inténtalo de nuevo.')
    } finally {
      setBusyId(null)
    }
  }, [])

  return { payments, isLoading, busyId, error, refresh, review }
}
