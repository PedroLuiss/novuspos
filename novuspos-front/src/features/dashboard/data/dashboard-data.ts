import { sessionStore } from '@/shared/lib/auth-storage'
import type { DashboardSummary } from '../types'

export const subscriptionStatusLabels = {
  active: 'Activa',
  pending_review: 'Pago en revisión',
  inactive: 'Inactiva · pendiente de pago',
  cancelled: 'Cancelada',
} as const

/** Textos fijos del instalador: no dependen de la cuenta. */
export const installerInfo = {
  releaseLabel: 'Marzo 2026',
  downloadHref: '/#descargar',
  highlights: [
    'Peso automático desde tu báscula al cobrar.',
    'Etiquetas con código de barras en el tamaño que elijas.',
    'Tus ventas e inventario al día al abrir el programa.',
  ],
} as const

function daysAgo(days: number): string {
  const date = new Date()
  date.setDate(date.getDate() - days)
  date.setHours(9, 15, 0, 0)
  return date.toISOString()
}

function daysAhead(days: number): string {
  const date = new Date()
  date.setDate(date.getDate() + days)
  date.setHours(9, 15, 0, 0)
  return date.toISOString()
}

/** Lee solo la fecha de la copia vigente, sin importar el formato del registro. */
export function readDemoBackupDate(): string | null {
  try {
    const latest = window.localStorage.getItem('novuspos:demo-latest-backup')
    if (latest) {
      const parsed = JSON.parse(latest) as { createdAt?: string }
      if (parsed?.createdAt) return parsed.createdAt
    }
    const legacy = window.localStorage.getItem('novuspos:demo-backups')
    if (legacy) {
      const parsed = JSON.parse(legacy) as { createdAt?: string }[]
      if (Array.isArray(parsed) && parsed[0]?.createdAt) return parsed[0].createdAt
    }
  } catch {
    // Se usa la fecha de ejemplo.
  }
  return daysAgo(0)
}

/** Clave de demostración: cambia cuando cambia el pago aprobado. */
export function demoActivationKey(seed: string): string {
  let hash = 2166136261
  for (let index = 0; index < seed.length; index += 1) {
    hash ^= seed.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }
  const code = (hash >>> 0).toString(36).toUpperCase().padStart(8, '0').slice(0, 8)
  return `NVUS-${code.slice(0, 4)}-${code.slice(4, 8)}-DEMO-${code.slice(0, 4)}`
}

export function createDemoSummary(): DashboardSummary {
  const dueAt = daysAhead(10)
  return {
    organizationName: sessionStore.getUser()?.organizationName ?? 'tu negocio',
    planName: 'NovusPOS Mensual',
    subscriptionStatus: 'active',
    dueAt,
    activationKey: demoActivationKey('demo-inicial'),
    activationKeyRenewsAt: dueAt,
    lastBackupAt: readDemoBackupDate(),
  }
}
