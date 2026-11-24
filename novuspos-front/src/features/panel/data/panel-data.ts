/** Contenido del panel de control (réplica de Stitch, copy auditado). */

export interface PanelNavItem {
  icon: string
  label: string
  href: string
  active?: boolean
}

export const panelNavItems: PanelNavItem[] = [
  { icon: 'grid_view', label: 'Panel General', href: '/panel', active: true },
  { icon: 'devices', label: 'Cajas Registradoras', href: '/panel' },
  { icon: 'credit_card', label: 'Suscripción', href: '/panel/suscripcion' },
  { icon: 'cloud_sync', label: 'Copias de Seguridad', href: '/panel' },
  { icon: 'headset_mic', label: 'Soporte Técnico', href: '/panel' },
]

export interface BackupItem {
  name: string
  meta: string
  detail: string
  recent?: boolean
}

function backupName(daysAgo: number, suffix = ''): string {
  const date = new Date()
  date.setDate(date.getDate() - daysAgo)
  const stamp = date.toISOString().slice(0, 10).replace(/-/g, '_')
  return `respaldo_novuspos_${stamp}${suffix}`
}

export const backups: BackupItem[] = [
  {
    name: backupName(0),
    meta: 'Caja #1 • copia disponible en tu equipo',
    detail: 'Copia reciente',
    recent: true,
  },
  {
    name: backupName(1, '_cierre'),
    meta: 'Caja #1 • copia al cerrar el turno',
    detail: 'Cierre de turno',
  },
  {
    name: backupName(2, '_cierre'),
    meta: 'Caja #1 • copia al cerrar el turno',
    detail: 'Cierre de turno',
  },
]
