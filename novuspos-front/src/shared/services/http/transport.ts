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
  /** Progreso de subida 0-100; al proporcionarlo con FormData se usa XHR. */
  onUploadProgress?: (percent: number) => void
}

async function safeJson(response: Response): Promise<unknown> {
  try {
    return await response.json()
  } catch {
    return null
  }
}

function parseJsonText(text: string): unknown {
  try {
    return JSON.parse(text) as unknown
  } catch {
    return null
  }
}

async function requestWithXhr<T>(path: string, options: ApiRequestOptions, token: string | null, isFormData: boolean): Promise<T> {
  const { body, headers = {}, method = 'POST', responseType = 'json', onUploadProgress } = options

  return new Promise<T>((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open(method, `${API_BASE_URL}${path}`)
    xhr.responseType = responseType === 'blob' ? 'blob' : 'text'
    xhr.setRequestHeader('Accept', 'application/json')
    if (!isFormData) xhr.setRequestHeader('Content-Type', 'application/json')
    if (token) xhr.setRequestHeader('Authorization', `Bearer ${token}`)
    for (const [key, value] of Object.entries(headers)) xhr.setRequestHeader(key, value)

    if (onUploadProgress && xhr.upload) {
      xhr.upload.onprogress = (event) => {
        if (!event.lengthComputable) return
        const percent = Math.min(100, Math.max(0, Math.round((event.loaded / event.total) * 100)))
        onUploadProgress(percent)
      }
    }

    xhr.onerror = () => reject(new ApiError(0, 'No pudimos conectar con el servidor.'))
    xhr.onload = () => {
      const status = xhr.status
      const payload = responseType === 'blob' ? xhr.response : parseJsonText(typeof xhr.response === 'string' ? xhr.response : '')

      if (status === 401) {
        emitUnauthorized()
        reject(new UnauthorizedError())
        return
      }
      if (status === 422) {
        reject(new ValidationError(toValidationIssues(payload)))
        return
      }
      if (status >= 500) {
        reject(new ApiError(status, 'Algo salió mal. Inténtalo de nuevo en unos minutos.'))
        return
      }
      if (status < 200 || status >= 300) {
        reject(new ApiError(status, toErrorMessage(payload, `Error ${status} (${xhr.statusText})`)))
        return
      }
      if (status === 204) {
        resolve(undefined as T)
        return
      }
      if (responseType === 'blob') {
        resolve(xhr.response as T)
        return
      }
      resolve(payload as T)
    }

    if (body === undefined) {
      xhr.send()
      return
    }
    xhr.send(isFormData ? (body as FormData) : JSON.stringify(body))
  })
}

/** Único punto que ejecuta fetch: inyecta Bearer y traduce códigos HTTP a errores. */
export async function request<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const { body, headers = {}, auth = true, responseType = 'json', onUploadProgress, ...rest } = options
  const token = auth ? sessionStore.getToken() : null
  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData

  beginRequest()
  try {
    if (onUploadProgress) {
      return await requestWithXhr<T>(path, options, token, isFormData)
    }

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
