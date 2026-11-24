/** Textos operativos de la copia vigente, sin detalles técnicos. */

export function formatBackupDate(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return '—'
  return new Intl.DateTimeFormat('es', { dateStyle: 'long', timeStyle: 'short' }).format(date)
}

export function backupDayLabel(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return '—'
  const today = new Date()
  const start = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()
  const now = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime()
  const days = Math.round((now - start) / 86_400_000)
  if (days === 0) return 'Hoy'
  if (days === 1) return 'Ayer'
  if (days < 7) return `Hace ${days} días`
  return new Intl.DateTimeFormat('es', { day: 'numeric', month: 'short' }).format(date)
}
