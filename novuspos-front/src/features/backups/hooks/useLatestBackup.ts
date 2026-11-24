import { useCallback, useEffect, useState } from 'react'
import { backupService } from '../services/backupService'
import type { BackupSnapshot } from '../types'

/** Contenedor del módulo: carga la copia vigente y permite actualizarla. */
export function useLatestBackup() {
  const [backup, setBackup] = useState<BackupSnapshot | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(() => {
    setIsLoading(true)
    setError(null)
    return backupService
      .getLatest()
      .then(setBackup)
      .catch(() => setError('No pudimos cargar tu copia. Inténtalo de nuevo.'))
      .finally(() => setIsLoading(false))
  }, [])

  useEffect(() => {
    void Promise.resolve().then(() => void refresh())
  }, [refresh])

  return { backup, isLoading, error, refresh }
}
