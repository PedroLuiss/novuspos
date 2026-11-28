/** Contenido del panel de control (réplica de Stitch, copy auditado). */

export interface PanelNavItem {
  icon: string
  label: string
  href: string
  active?: boolean
}

export const panelNavItems: PanelNavItem[] = [
  { icon: 'grid_view', label: 'Panel General', href: '/panel', active: true },
  { icon: 'notifications', label: 'Notificaciones', href: '/panel/notificaciones' },
  { icon: 'credit_card', label: 'Suscripción', href: '/panel/suscripcion' },
  { icon: 'cloud_sync', label: 'Copias de Seguridad', href: '/panel/respaldos' },
  { icon: 'headset_mic', label: 'Soporte Técnico', href: '/panel/soporte' },
]
