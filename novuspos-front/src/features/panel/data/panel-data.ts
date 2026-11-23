/** Contenido del panel de control (réplica de Stitch, copy auditado). */

export interface PanelNavItem {
  icon: string
  label: string
  active?: boolean
}

export const panelNavItems: PanelNavItem[] = [
  { icon: 'grid_view', label: 'Panel General', active: true },
  { icon: 'devices', label: 'Cajas Registradoras' },
  { icon: 'credit_card', label: 'Suscripción ($4.99)' },
  { icon: 'cloud_sync', label: 'Copias de Seguridad' },
  { icon: 'headset_mic', label: 'Soporte Técnico' },
]

export interface Invoice {
  folio: string
  period: string
  chargeDate: string
  method: string
  amount: string
  status: string
}

export const invoices: Invoice[] = [
  { folio: 'INV-2026-0326', period: '26 Mar 2026 - 26 Abr 2026', chargeDate: '26/03/2026 09:12', method: 'Visa •••• 4821', amount: '$4.99 USD', status: 'PAGADO' },
  { folio: 'INV-2026-0226', period: '26 Feb 2026 - 26 Mar 2026', chargeDate: '26/02/2026 09:10', method: 'Visa •••• 4821', amount: '$4.99 USD', status: 'PAGADO' },
  { folio: 'INV-2026-0126', period: '26 Ene 2026 - 26 Feb 2026', chargeDate: '26/01/2026 09:10', method: 'Visa •••• 4821', amount: '$4.99 USD', status: 'PAGADO' },
]

export interface BackupItem {
  name: string
  meta: string
  size: string
  recent?: boolean
}

export const backups: BackupItem[] = [
  {
    name: 'respaldo_novuspos_2026_03_28_1030',
    meta: 'Generado hoy a las 10:30 AM • Caja #1 • 1,420 productos • 385 ventas',
    size: '14.2 MB',
    recent: true,
  },
  {
    name: 'respaldo_novuspos_2026_03_27_2300_cierre',
    meta: 'Cierre de turno ayer 11:00 PM • Caja #1 • 1,420 productos',
    size: '14.1 MB',
  },
  {
    name: 'respaldo_novuspos_2026_03_26_2300_cierre',
    meta: 'Cierre de turno 26 Mar 11:00 PM • Caja #1 • 1,418 productos',
    size: '13.9 MB',
  },
]
