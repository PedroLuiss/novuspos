import { sessionStore } from '@/shared/lib/auth-storage'
import { API_URL } from '@/shared/lib/env'
import { ApiError, UnauthorizedError, ValidationError, toErrorMessage, toValidationIssues } from './errors'
import { beginRequest, emitUnauthorized, endRequest } from './events'

export const API_BASE_URL = API_URL

export interface ApiRequestOptions extends Omit<RequestInit, 'body' | 'headers'> {
  body?: unknown
  headers?: Record<string, string>
  auth?: boolean
  /** `blob` para descargas; por defecto se interpreta la respuesta como JSON. */
  responseType?: 'json' | 'blob'
}

async function safeJson(response: Response): Promise<unknown> {
  try {
    return await response.json()
  } catch {
    return null
  }
}

/** Único punto que ejecuta fetch: inyecta Bearer y traduce códigos HTTP a errores. */
export async function request<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const { body, headers = {}, auth = true, responseType = 'json', ...rest } = options
  const token = auth ? sessionStore.getToken() : null
  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData

  beginRequest()
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...rest,
      headers: {
        Accept: 'application/json',
        ...(!isFormData ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
      ...(body !== undefined ? { body: isFormData ? body : JSON.stringify(body) } : {}),
    })

    if (response.status === 401) {
      emitUnauthorized()
      throw new UnauthorizedError()
    }
    if (response.status === 422) {
      throw new ValidationError(toValidationIssues(await safeJson(response)))
    }
    if (response.status >= 500) {
      throw new ApiError(response.status, 'Algo salió mal. Inténtalo de nuevo en unos minutos.')
    }
    if (!response.ok) {
      const payload = await safeJson(response)
      throw new ApiError(response.status, toErrorMessage(payload, `Error ${response.status} (${response.statusText})`))
    }
    if (response.status === 204) return undefined as T
    if (responseType === 'blob') return (await response.blob()) as T

    return (await response.json()) as T
  } finally {
    endRequest()
  }
}
