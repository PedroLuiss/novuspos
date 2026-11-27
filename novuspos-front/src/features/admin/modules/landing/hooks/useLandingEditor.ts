import { useCallback, useEffect, useState } from 'react'
import { LANDING_DEFAULTS } from '@/shared/services/landing/defaults'
import { landingStore, normalizeLandingConfig } from '@/shared/services/landing/landingStore'
import type {
  LandingBranding,
  LandingConfig,
  LandingCopy,
  LandingDownload,
  LandingScreenshot,
  LandingSectionId,
  LandingSectionState,
  LandingTheme,
} from '@/shared/services/landing/types'
import { adminService } from '@/features/admin/core/services/adminService'
import { saveBlob } from '@/shared/services/landing/desktopDownload'

const initial = normalizeLandingConfig(LANDING_DEFAULTS)

/** Borrador del constructor visual: nada se publica hasta que el dueño guarda. */
export function useLandingEditor() {
  const [draft, setDraft] = useState<LandingConfig>(initial)
  const [savedSnapshot, setSavedSnapshot] = useState(JSON.stringify(initial))
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isUploadingDownload, setIsUploadingDownload] = useState(false)
  const [downloadProgress, setDownloadProgress] = useState(0)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(() => {
    setIsLoading(true)
    setError(null)
    return adminService
      .getLanding()
      .catch(() => landingStore.read())
      .then((config) => {
        const normalized = normalizeLandingConfig(config)
        setDraft(normalized)
        setSavedSnapshot(JSON.stringify(normalized))
      })
      .finally(() => setIsLoading(false))
  }, [])

  useEffect(() => {
    void Promise.resolve().then(() => void load())
  }, [load])

  const mutate = useCallback((updater: (current: LandingConfig) => LandingConfig) => {
    setSaved(false)
    setError(null)
    setDraft(updater)
  }, [])

  const patch = useCallback(<K extends keyof LandingCopy>(group: K, changes: Partial<LandingCopy[K]>) => {
    mutate((current) => ({
      ...current,
      copy: {
        ...current.copy,
        [group]: { ...(current.copy[group] as object), ...(changes as object) },
      },
    }))
  }, [mutate])

  const setTheme = useCallback((changes: Partial<LandingTheme>) => {
    mutate((current) => ({ ...current, theme: { ...current.theme, ...changes } }))
  }, [mutate])

  const setSections = useCallback((sections: LandingSectionState[]) => {
    mutate((current) => ({ ...current, sections }))
  }, [mutate])

  const toggleSection = useCallback((id: LandingSectionId) => {
    mutate((current) => ({
      ...current,
      sections: current.sections.map((item) => (item.id === id ? { ...item, visible: !item.visible } : item)),
    }))
  }, [mutate])

  const moveSection = useCallback((id: LandingSectionId, direction: -1 | 1) => {
    mutate((current) => {
      const sections = [...current.sections]
      const index = sections.findIndex((item) => item.id === id)
      const target = index + direction
      if (index < 0 || target < 0 || target >= sections.length) return current
      ;[sections[index], sections[target]] = [sections[target], sections[index]]
      return { ...current, sections }
    })
  }, [mutate])

  const setScreenshots = useCallback((screenshots: LandingScreenshot[]) => {
    mutate((current) => ({ ...current, screenshots }))
  }, [mutate])

  const setLogos = useCallback((logos: LandingBranding) => {
    mutate((current) => ({ ...current, logos }))
  }, [mutate])

  const setDownload = useCallback((download: LandingDownload | null) => {
    mutate((current) => ({ ...current, download }))
  }, [mutate])

  const syncDownloadSnapshot = useCallback((download: LandingDownload | null) => {
    setSavedSnapshot((current) => {
      const parsed = JSON.parse(current) as LandingConfig
      return JSON.stringify({ ...parsed, download })
    })
  }, [])

  const uploadDownload = useCallback(async (file: File, version?: string) => {
    setIsUploadingDownload(true)
    setDownloadProgress(0)
    setError(null)
    setSaved(false)
    try {
      const download = await adminService.uploadLandingDownload(file, version, setDownloadProgress)
      setDownloadProgress(100)
      setDraft((current) => ({ ...current, download }))
      syncDownloadSnapshot(download)
      return download
    } catch {
      setError('No pudimos subir el instalador. Verifica que sea un .exe válido e inténtalo de nuevo.')
      return null
    } finally {
      setIsUploadingDownload(false)
    }
  }, [syncDownloadSnapshot])

  const deleteDownload = useCallback(async () => {
    setIsUploadingDownload(true)
    setError(null)
    setSaved(false)
    try {
      await adminService.deleteLandingDownload()
      setDraft((current) => ({ ...current, download: null }))
      syncDownloadSnapshot(null)
      return true
    } catch {
      setError('No pudimos quitar el instalador. Inténtalo de nuevo.')
      return false
    } finally {
      setIsUploadingDownload(false)
    }
  }, [syncDownloadSnapshot])

  const downloadInstaller = useCallback(async () => {
    try {
      const blob = await adminService.downloadLandingInstaller()
      saveBlob(blob, draft.download?.fileName || 'novuspos-desktop-setup.exe')
    } catch {
      setError('No pudimos descargar el instalador. Inténtalo de nuevo.')
    }
  }, [draft.download?.fileName])

  const restoreDefaults = useCallback(() => {
    mutate(() => normalizeLandingConfig(LANDING_DEFAULTS))
  }, [mutate])

  const save = useCallback(async () => {
    setIsSaving(true)
    setSaved(false)
    setError(null)
    try {
      const updated = normalizeLandingConfig(await adminService.saveLanding(draft))
      setDraft(updated)
      setSavedSnapshot(JSON.stringify(updated))
      setSaved(true)
      return true
    } catch (cause) {
      const withoutSpace = cause instanceof DOMException && (cause.name === 'QuotaExceededError' || cause.code === 22)
      setError(
        withoutSpace
          ? 'Las imágenes ocupan demasiado espacio en este navegador. Usa capturas más pequeñas o elimina alguna.'
          : 'No pudimos guardar la landing. Inténtalo de nuevo.',
      )
      return false
    } finally {
      setIsSaving(false)
    }
  }, [draft])

  const reset = useCallback(() => {
    setDraft(JSON.parse(savedSnapshot) as LandingConfig)
    setSaved(false)
    setError(null)
  }, [savedSnapshot])

  return {
    draft,
    isDirty: JSON.stringify(draft) !== savedSnapshot,
    isLoading,
    isSaving,
    isUploadingDownload,
    downloadProgress,
    saved,
    error,
    patch,
    setTheme,
    setSections,
    toggleSection,
    moveSection,
    setScreenshots,
    setLogos,
    setDownload,
    uploadDownload,
    deleteDownload,
    downloadInstaller,
    restoreDefaults,
    save,
    reset,
  }
}
