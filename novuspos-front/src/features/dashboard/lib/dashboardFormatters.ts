/** Textos amigables para las fechas del panel. */

export function lastBackupLabel(iso: string | null): string {
  if (!iso) return 'Sin copias aún'
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return 'Sin copias aún'
  const today = new Date()
  const start = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()
  const now = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime()
  const days = Math.round((now - start) / 86_400_000)
  if (days === 0) return 'Hoy'
  if (days === 1) return 'Ayer'
  if (days < 7) return `Hace ${days} días`
  return new Intl.DateTimeFormat('es', { day: 'numeric', month: 'short' }).format(date)
}

export function formatPanelDate(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return '—'
  return new Intl.DateTimeFormat('es', { day: 'numeric', month: 'long', year: 'numeric' }).format(date)
}

export function isOverdue(iso: string): boolean {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return false
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return date.getTime() < today.getTime()
}
