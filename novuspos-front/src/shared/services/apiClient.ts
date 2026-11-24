import type { AuthUser } from '@/shared/lib/auth-types'
import { request, type ApiRequestOptions } from './http/transport'

/** Fachada pública del cliente HTTP; el resto de la app no importa el transporte. */
export { API_BASE_URL } from './http/transport'

export {
  ApiError,
  UnauthorizedError,
  ValidationError,
  type ValidationIssues,
} from './http/errors'
export { setUnauthorizedHandler, clearUnauthorizedHandler, subscribeLoading } from './http/events'
export type { ApiRequestOptions } from './http/transport'

export interface LoginResponse {
  token: string
  user: AuthUser
}

export const apiClient = {
  get: <T>(path: string, options?: ApiRequestOptions) => request<T>(path, { ...options, method: 'GET' }),
  /** Descarga autenticada; el transporte devuelve un Blob en vez de JSON. */
  getBlob: (path: string, options?: ApiRequestOptions) =>
    request<Blob>(path, { ...options, method: 'GET', responseType: 'blob' }),
  post: <T>(path: string, body?: unknown, options?: ApiRequestOptions) =>
    request<T>(path, { ...options, method: 'POST', body }),
  put: <T>(path: string, body?: unknown, options?: ApiRequestOptions) =>
    request<T>(path, { ...options, method: 'PUT', body }),
  patch: <T>(path: string, body?: unknown, options?: ApiRequestOptions) =>
    request<T>(path, { ...options, method: 'PATCH', body }),
  delete: <T>(path: string, options?: ApiRequestOptions) => request<T>(path, { ...options, method: 'DELETE' }),
}
