import { useCallback, useEffect, useState } from 'react'
import { adminService } from '@/features/admin/core/services/adminService'
import type { AdminOverview } from '../types'

export function useAdminOverview() {
  const [overview, setOverview] = useState<AdminOverview | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(() => {
    setIsLoading(true)
    return adminService
      .getOverview()
      .then(setOverview)
      .catch(() => setError('No pudimos cargar el resumen.'))
      .finally(() => setIsLoading(false))
  }, [])

  useEffect(() => {
    void Promise.resolve().then(() => void refresh())
  }, [refresh])

  return { overview, isLoading, error, refresh }
}
