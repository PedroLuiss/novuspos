/** Formateadores del panel maestro, sin depender de otras features. */

export function formatUsd(value: number): string {
  return new Intl.NumberFormat('es-VE', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(value)
}

export function formatAdminDate(value: string): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('es', { day: '2-digit', month: 'short', year: 'numeric' }).format(date)
}

export const statusLabels = {
  active: 'Activa',
  pending: 'Pendiente',
  expired: 'Vencida',
  cancelled: 'Cancelada',
  approved: 'Aprobado',
  rejected: 'Rechazado',
  open: 'Abierto',
  resolved: 'Atendido',
  info: 'Información',
  success: 'Éxito',
  warning: 'Advertencia',
} as const

type Tone = 'neutral' | 'info' | 'success' | 'warning' | 'error'

/** Mapea estados de dominio a colores semánticos del panel. */
export function paymentTone(status: string): Tone {
  if (status === 'approved') return 'success'
  if (status === 'pending') return 'warning'
  return 'error'
}

export function subscriptionTone(status: string): Tone {
  if (status === 'active') return 'success'
  if (status === 'pending') return 'warning'
  if (status === 'expired' || status === 'cancelled') return 'error'
  return 'neutral'
}

export function reportTone(status: string): Tone {
  return status === 'open' ? 'warning' : 'success'
}

export function noticeTone(type: string): Tone {
  if (type === 'success') return 'success'
  if (type === 'warning') return 'warning'
  return 'info'
}
