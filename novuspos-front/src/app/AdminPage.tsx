import type { ComponentType } from 'react'
import { AdminLayout } from '@/features/admin/core'
import type { AdminSection } from '@/features/admin/core/config/adminSections'
import { AdminOverview } from '@/features/admin/modules/overview'
import { EmailsPage } from '@/features/admin/modules/emails'
import { LandingBuilderPage } from '@/features/admin/modules/landing'
import { NotificationsPage } from '@/features/admin/modules/notifications'
import { PaymentsPage } from '@/features/admin/modules/payments'
import { PlansPage } from '@/features/admin/modules/plans'
import { ReportsPage } from '@/features/admin/modules/reports'
import { SettingsPage } from '@/features/admin/modules/settings'
import { UsersPage } from '@/features/admin/modules/users'

export type { AdminSection } from '@/features/admin/core/config/adminSections'

/** Registro inmutable: agregar una sección no obliga a tocar el JSX. */
const SECTION_VIEWS: Record<AdminSection, ComponentType> = {
  overview: AdminOverview,
  plans: PlansPage,
  landing: LandingBuilderPage,
  payments: PaymentsPage,
  users: UsersPage,
  reports: ReportsPage,
  notifications: NotificationsPage,
  emails: EmailsPage,
  settings: SettingsPage,
}

/** Panel del dueño: compone el layout maestro y el módulo solicitado. */
export function AdminPage({ section }: { section: AdminSection }) {
  const View = SECTION_VIEWS[section]
  return (
    <AdminLayout section={section}>
      <View />
    </AdminLayout>
  )
}
