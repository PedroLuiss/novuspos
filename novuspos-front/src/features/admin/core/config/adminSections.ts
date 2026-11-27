/** Registro único de secciones del panel maestro: rutas, etiquetas, iconos y menú. */

export type AdminSection =
  | 'overview'
  | 'plans'
  | 'landing'
  | 'payments'
  | 'users'
  | 'reports'
  | 'notifications'
  | 'emails'
  | 'settings'
  | 'profile'

export interface AdminSectionMeta {
  key: AdminSection
  navLabel: string
  headerLabel: string
  icon: string
  href: string
}

export const ADMIN_SECTIONS: readonly AdminSectionMeta[] = [
  { key: 'overview', navLabel: 'Resumen', headerLabel: 'Resumen', icon: 'dashboard', href: '/administracion' },
  { key: 'plans', navLabel: 'Suscripciones', headerLabel: 'Suscripciones', icon: 'workspace_premium', href: '/administracion/suscripciones' },
  { key: 'landing', navLabel: 'Landing', headerLabel: 'Constructor de landing', icon: 'web_traffic', href: '/administracion/landing' },
  { key: 'payments', navLabel: 'Pagos', headerLabel: 'Pagos', icon: 'payments', href: '/administracion/pagos' },
  { key: 'users', navLabel: 'Usuarios', headerLabel: 'Usuarios', icon: 'group', href: '/administracion/usuarios' },
  { key: 'reports', navLabel: 'Reportes', headerLabel: 'Reportes', icon: 'report_problem', href: '/administracion/reportes' },
  { key: 'notifications', navLabel: 'Notificaciones', headerLabel: 'Notificaciones', icon: 'notifications', href: '/administracion/notificaciones' },
  { key: 'emails', navLabel: 'Correos', headerLabel: 'Correos', icon: 'mail', href: '/administracion/correos' },
  { key: 'settings', navLabel: 'Ajustes', headerLabel: 'Ajustes', icon: 'settings', href: '/administracion/ajustes' },
  { key: 'profile', navLabel: 'Mi Perfil', headerLabel: 'Mi Perfil', icon: 'person', href: '/administracion/perfil' },
]

const SECTION_META = Object.fromEntries(ADMIN_SECTIONS.map((item) => [item.key, item])) as Record<AdminSection, AdminSectionMeta>

export interface AdminSectionGroup {
  label: string
  items: readonly AdminSectionMeta[]
}

function sectionItems(...keys: AdminSection[]): readonly AdminSectionMeta[] {
  return keys.map((key) => SECTION_META[key])
}

export const ADMIN_SECTION_GROUPS: readonly AdminSectionGroup[] = [
  { label: 'Operación', items: sectionItems('overview', 'plans', 'landing', 'payments', 'users', 'reports') },
  { label: 'Comunicación', items: sectionItems('notifications', 'emails') },
  { label: 'Sistema', items: sectionItems('settings') },
]

export function getAdminSectionLabel(section: AdminSection): string {
  return SECTION_META[section].headerLabel
}

export function getAdminSectionPath(section: AdminSection): string {
  return SECTION_META[section].href
}

/** Resolución pura de pathname → sección; la UI y el router comparten esta única tabla. */
export function resolveAdminSection(pathname: string): AdminSection {
  const match = ADMIN_SECTIONS.find(
    (item) => item.key !== 'overview' && pathname.startsWith(item.href),
  )
  return match?.key ?? 'overview'
}
