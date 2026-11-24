import type { RecoveryLinkParams } from '../types'

/** Parámetros del enlace de recuperación: función pura y testeable. */
export function readRecoveryLinkParams(search: string): RecoveryLinkParams {
  const params = new URLSearchParams(search)
  const token = params.get('token')?.trim() ?? ''
  const email = params.get('email')?.trim() ?? ''
  return { token: token || null, email: email || null }
}

/** Href del enlace de demostración que se muestra tras solicitar la recuperación. */
export function buildRecoveryLink(token: string, email: string): string {
  const query = new URLSearchParams({ token })
  if (email) query.set('email', email)
  return `/auth/restablecer?${query.toString()}`
}
