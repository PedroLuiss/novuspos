import type { AdminOverview } from '@/features/admin/core/types'

export interface OverviewMetric {
  key: 'totalUsers' | 'unpaidUsers' | 'pendingPayments' | 'openReports'
  label: string
  hint: string
  icon: string
  accent: string
}

export const OVERVIEW_METRICS: readonly OverviewMetric[] = [
  { key: 'totalUsers', label: 'Usuarios registrados', hint: 'Comercios en la plataforma', icon: 'group', accent: 'border-t-primary' },
  { key: 'unpaidUsers', label: 'Sin suscripción al día', hint: 'Requieren renovación', icon: 'person_off', accent: 'border-t-error' },
  { key: 'pendingPayments', label: 'Pagos por validar', hint: 'Listos para tu revisión', icon: 'pending_actions', accent: 'border-t-[#c77800]' },
  { key: 'openReports', label: 'Reportes abiertos', hint: 'Solicitudes por atender', icon: 'report_problem', accent: 'border-t-secondary' },
]

/** Colores SVG de la dona, alineados con los tokens MD3 del panel. */
export const DONUT_COLORS = ['#003ec7', '#6cf8bb', '#b7c4ff', '#c3c5d9'] as const

/** Colores de las barras de la leyenda, en el mismo orden que la dona. */
export const DONUT_LEGEND_COLORS = ['bg-primary', 'bg-secondary-fixed-dim', 'bg-primary-fixed-dim', 'bg-outline-variant'] as const

export const PAYMENT_STATUS_LABELS: Record<string, string> = {
  approved: 'Aprobado',
  pending: 'Pendiente',
  rejected: 'Rechazado',
}

export function overviewMetricValue(overview: AdminOverview, key: OverviewMetric['key']): number {
  return overview[key]
}
