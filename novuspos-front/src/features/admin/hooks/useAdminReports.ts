import { useCallback, useEffect, useState } from 'react'
import { adminService } from '../services/adminService'
import type { AdminReport } from '../types'

export function useAdminReports() {
  const [reports, setReports] = useState<AdminReport[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(() => {
    setIsLoading(true)
    return adminService
      .listReports()
      .then(setReports)
      .catch(() => setError('No pudimos cargar los reportes.'))
      .finally(() => setIsLoading(false))
  }, [])

  useEffect(() => {
    void Promise.resolve().then(() => void refresh())
  }, [refresh])

  return { reports, isLoading, error, refresh }
}
