import { useCallback, useEffect, useState } from 'react'
import { adminSettingsStore } from '../lib/adminSettings'
import { adminService } from '../services/adminService'
import type { AdminSettings } from '../types'

export function useAdminSettings() {
  const [settings, setSettings] = useState<AdminSettings>(() => adminSettingsStore.read())
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(() => {
    setIsLoading(true)
    return adminService
      .getSettings()
      .then((next) => {
        setSettings(next)
        adminSettingsStore.save(next)
      })
      .catch(() => setError('No pudimos cargar los ajustes. Usamos los valores guardados.'))
      .finally(() => setIsLoading(false))
  }, [])

  useEffect(() => {
    void Promise.resolve().then(() => void refresh())
  }, [refresh])

  const save = useCallback(async (next: AdminSettings) => {
    setIsSaving(true)
    setSaved(false)
    setError(null)
    try {
      const updated = await adminService.saveSettings(next)
      setSettings(updated)
      adminSettingsStore.save(updated)
      setSaved(true)
      return true
    } catch {
      setError('No pudimos guardar los ajustes.')
      return false
    } finally {
      setIsSaving(false)
    }
  }, [])

  return { settings, isLoading, isSaving, saved, error, save }
}
