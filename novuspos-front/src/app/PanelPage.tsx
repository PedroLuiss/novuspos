import { BackupOverview } from '@/features/backups/components/BackupOverview'
import { DashboardSection } from '@/features/dashboard/components/DashboardSection'
import { PanelSidebar } from '@/features/panel/components/PanelSidebar'
import { ProfileOverview } from '@/features/profile/components/ProfileOverview'
import { SubscriptionOverview } from '@/features/subscription/components/SubscriptionOverview'
import { SupportOverview } from '@/features/support/components/SupportOverview'

export type PanelSection = 'general' | 'subscription' | 'backups' | 'support' | 'profile'

/** Panel de Control de Clientes: portada y tres módulos conectados a la API. */
export function PanelPage({ section = 'general' }: { section?: PanelSection }) {
  return (
    <div className="w-full bg-surface font-body-md text-on-surface antialiased">
      <PanelSidebar />
      <div className="pl-64">
        <main className="relative pt-16 bg-surface w-full min-h-screen">
          <div className="flex flex-col w-full p-space-md lg:p-space-lg gap-space-lg">
            {section === 'subscription' ? (
              <SubscriptionOverview />
            ) : section === 'backups' ? (
              <BackupOverview />
            ) : section === 'support' ? (
              <SupportOverview />
            ) : section === 'profile' ? (
              <ProfileOverview />
            ) : (
              <DashboardSection />
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
