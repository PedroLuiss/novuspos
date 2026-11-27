/**
 * API pública del panel del super administrador.
 *
 * Los consumidores externos (App, resolver de rutas) importan solo desde aquí
 * o desde los sub-barrels de `core/` y `modules/`; nunca desde rutas internas.
 */

export {
  ADMIN_SECTIONS,
  ADMIN_SECTION_GROUPS,
  AdminGate,
  AdminLayout,
  AdminLoginPage,
  adminService,
  getAdminSectionLabel,
  getAdminSectionPath,
  resolveAdminSection,
} from './core'

export type { AdminSection, AdminSectionGroup, AdminSectionMeta } from './core'

export {
  DEFAULT_ADMIN_SETTINGS,
  getAdminLoginPath,
  normalizeLoginPath,
} from './core/lib/adminSettings'

export { AdminOverview } from './modules/overview'
export { PlansPage } from './modules/plans'
export { LandingBuilderPage } from './modules/landing'
export { PaymentsPage } from './modules/payments'
export { UsersPage } from './modules/users'
export { ReportsPage } from './modules/reports'
export { NotificationsPage } from './modules/notifications'
export { EmailsPage } from './modules/emails'
export { SettingsPage } from './modules/settings'
