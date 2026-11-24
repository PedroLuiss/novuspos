import { PanelBackups } from '@/features/panel/components/PanelBackups'
import { PanelLicense } from '@/features/panel/components/PanelLicense'
import { PanelOverview } from '@/features/panel/components/PanelOverview'
import { PanelSidebar } from '@/features/panel/components/PanelSidebar'
import { SubscriptionOverview } from '@/features/subscription/components/SubscriptionOverview'

export type PanelSection = 'general' | 'subscription'

/** Panel de Control de Clientes — réplica del dashboard de Stitch con módulos. */
export function PanelPage({ section = 'general' }: { section?: PanelSection }) {
  return (
    <div className="w-full bg-surface font-body-md text-on-surface antialiased">
      <PanelSidebar />
      <div className="pl-64">
        <main className="relative pt-16 bg-surface w-full min-h-screen">
          <div className="flex flex-col w-full p-space-md lg:p-space-lg gap-space-lg">
            {section === 'subscription' ? (
              <SubscriptionOverview />
            ) : (
              <>
                <PanelOverview />
                <PanelLicense />
                <SubscriptionOverview />
                <PanelBackups />
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
