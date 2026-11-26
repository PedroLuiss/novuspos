import { AdminLayout } from '@/features/admin/components/AdminLayout'
import { AdminOverview } from '@/features/admin/components/AdminOverview'
import { EmailsPage } from '@/features/admin/components/EmailsPage'
import { LandingBuilderPage } from '@/features/admin/components/landing/LandingBuilderPage'
import { NotificationsPage } from '@/features/admin/components/NotificationsPage'
import { PaymentsPage } from '@/features/admin/components/PaymentsPage'
import { PlansPage } from '@/features/admin/components/PlansPage'
import { ReportsPage } from '@/features/admin/components/ReportsPage'
import { SettingsPage } from '@/features/admin/components/SettingsPage'
import { UsersPage } from '@/features/admin/components/UsersPage'

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

/** Panel del dueño: compone el layout maestro y el módulo solicitado. */
export function AdminPage({ section }: { section: AdminSection }) {
  return (
    <AdminLayout section={section}>
      {section === 'plans' ? (
        <PlansPage />
      ) : section === 'landing' ? (
        <LandingBuilderPage />
      ) : section === 'payments' ? (
        <PaymentsPage />
      ) : section === 'users' ? (
        <UsersPage />
      ) : section === 'reports' ? (
        <ReportsPage />
      ) : section === 'notifications' ? (
        <NotificationsPage />
      ) : section === 'emails' ? (
        <EmailsPage />
      ) : section === 'settings' ? (
        <SettingsPage />
      ) : (
        <AdminOverview />
      )}
    </AdminLayout>
  )
}
