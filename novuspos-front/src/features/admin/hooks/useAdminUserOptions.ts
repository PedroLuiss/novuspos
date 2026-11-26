import { useCallback, useEffect, useState } from 'react'
import { adminService } from '../services/adminService'
import type { UserOption } from '../types'

/** Comercios para los selectores de destinatarios, independientes de la paginación del directorio. */
export function useAdminUserOptions() {
  const [options, setOptions] = useState<UserOption[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(() => {
    setIsLoading(true)
    return adminService
      .listUserOptions()
      .then(setOptions)
      .catch(() => setError('No pudimos cargar los comercios.'))
      .finally(() => setIsLoading(false))
  }, [])

  useEffect(() => {
    void Promise.resolve().then(() => void load())
  }, [load])

  return { options, isLoading, error, refresh: load }
}
