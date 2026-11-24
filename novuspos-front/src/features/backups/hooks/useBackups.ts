import { useCallback, useEffect, useState } from 'react'
import { backupService } from '../services/backupService'
import type { BackupRecord, RegisterBackupRequest } from '../types'

/** Contenedor del módulo: carga, registra, verifica, descarga y elimina copias. */
export function useBackups() {
  const [backups, setBackups] = useState<BackupRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [busyId, setBusyId] = useState<string | null>(null)

  const refresh = useCallback(() => {
    setIsLoading(true)
    setError(null)
    return backupService
      .list()
      .then(setBackups)
      .catch(() => setError('No pudimos cargar las copias. Inténtalo de nuevo.'))
      .finally(() => setIsLoading(false))
  }, [])

  useEffect(() => {
    void Promise.resolve().then(() => void refresh())
  }, [refresh])

  const register = useCallback(
    async (request: RegisterBackupRequest) => {
      await backupService.register(request)
      await refresh()
    },
    [refresh],
  )

  const verify = useCallback(async (backupId: string) => {
    setBusyId(backupId)
    setError(null)
    try {
      const updated = await backupService.verify(backupId)
      setBackups((current) => current.map((item) => (item.id === updated.id ? updated : item)))
    } catch {
      setError('No pudimos verificar la copia. Inténtalo de nuevo.')
    } finally {
      setBusyId(null)
    }
  }, [])

  const remove = useCallback(async (backupId: string) => {
    setBusyId(backupId)
    setError(null)
    try {
      await backupService.remove(backupId)
      setBackups((current) => current.filter((item) => item.id !== backupId))
    } catch {
      setError('No pudimos eliminar la copia. Inténtalo de nuevo.')
    } finally {
      setBusyId(null)
    }
  }, [])

  const download = useCallback(async (record: BackupRecord) => {
    setBusyId(record.id)
    setError(null)
    try {
      const blob = await backupService.download(record.id)
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `copia-novuspos-${record.device.trim().replace(/\s+/g, '-').toLowerCase()}`
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.setTimeout(() => URL.revokeObjectURL(url), 1000)
    } catch {
      setError('No pudimos descargar la copia. Inténtalo de nuevo.')
    } finally {
      setBusyId(null)
    }
  }, [])

  return { backups, isLoading, error, busyId, refresh, register, verify, remove, download }
}
