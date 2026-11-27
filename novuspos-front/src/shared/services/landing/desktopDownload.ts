import { sessionStore } from '@/shared/lib/auth-storage'
import { navigate } from '@/shared/router/navigation'
import { apiClient } from '@/shared/services/apiClient'
import { LANDING_ENDPOINTS } from '@/shared/services/endpoints'

export const PENDING_DESKTOP_DOWNLOAD_KEY = 'novuspos:pending-desktop-download'
export const AUTO_DESKTOP_DOWNLOAD_KEY = 'novuspos:auto-desktop-download'

export function saveBlob(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = fileName || 'novuspos-desktop-setup.exe'
  document.body.append(anchor)
  anchor.click()
  anchor.remove()
  URL.revokeObjectURL(url)
}

/** Descarga el instalador autenticado. Si no hay sesión, redirige a login y retoma al volver. */
export async function requestDesktopDownload(fileName?: string): Promise<void> {
  const token = sessionStore.getToken()
  if (!token) {
    window.sessionStorage.setItem(PENDING_DESKTOP_DOWNLOAD_KEY, fileName || '1')
    navigate('/auth/login')
    return
  }

  const blob = await apiClient.getBlob(LANDING_ENDPOINTS.download, { auth: true })
  saveBlob(blob, fileName || 'novuspos-desktop-setup.exe')
}

/** Ejecuta la descarga pendiente después de autenticarse, una sola vez. */
export async function consumeAutoDesktopDownload(): Promise<boolean> {
  const pending = window.sessionStorage.getItem(AUTO_DESKTOP_DOWNLOAD_KEY)
  if (!pending) return false
  window.sessionStorage.removeItem(AUTO_DESKTOP_DOWNLOAD_KEY)
  await requestDesktopDownload(pending === '1' ? undefined : pending)
  return true
}

export function markDesktopDownloadForAfterAuth(): void {
  const pending = window.sessionStorage.getItem(PENDING_DESKTOP_DOWNLOAD_KEY)
  if (!pending) return
  window.sessionStorage.removeItem(PENDING_DESKTOP_DOWNLOAD_KEY)
  window.sessionStorage.setItem(AUTO_DESKTOP_DOWNLOAD_KEY, pending)
}

export function hasPendingDesktopDownload(): boolean {
  return Boolean(window.sessionStorage.getItem(PENDING_DESKTOP_DOWNLOAD_KEY))
}