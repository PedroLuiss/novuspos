import { sessionStore } from '@/shared/lib/auth-storage'
import { navigate } from '@/shared/router/navigation'

/** Bus de eventos HTTP: desacopla transporte, sesión y UI (Observer). */

type UnauthorizedHandler = () => void
type LoadingListener = (loading: boolean) => void

let unauthorizedHandler: UnauthorizedHandler | null = null
const loadingListeners = new Set<LoadingListener>()
let pendingRequests = 0

function defaultUnauthorizedHandler(): void {
  sessionStore.clear()
  if (typeof window !== 'undefined' && window.location.pathname !== '/auth/login') {
    navigate('/auth/login', { replace: true })
  }
}

export function setUnauthorizedHandler(handler: UnauthorizedHandler): void {
  unauthorizedHandler = handler
}

/** Restaura el comportamiento por defecto al desmontar el provider. */
export function clearUnauthorizedHandler(): void {
  unauthorizedHandler = null
}

export function emitUnauthorized(): void {
  const handler = unauthorizedHandler ?? defaultUnauthorizedHandler
  handler()
}

export function subscribeLoading(listener: LoadingListener): () => void {
  loadingListeners.add(listener)
  return () => {
    loadingListeners.delete(listener)
  }
}

function notifyLoading(): void {
  const loading = pendingRequests > 0
  loadingListeners.forEach((listener) => listener(loading))
}

export function beginRequest(): void {
  pendingRequests += 1
  notifyLoading()
}

export function endRequest(): void {
  pendingRequests = Math.max(0, pendingRequests - 1)
  notifyLoading()
}
