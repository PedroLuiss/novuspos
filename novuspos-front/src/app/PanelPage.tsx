import { PanelBackups } from '@/features/panel/components/PanelBackups'
import { PanelBilling } from '@/features/panel/components/PanelBilling'
import { PanelLicense } from '@/features/panel/components/PanelLicense'
import { PanelOverview } from '@/features/panel/components/PanelOverview'
import { PanelSidebar } from '@/features/panel/components/PanelSidebar'

/** Panel de Control de Clientes — réplica del dashboard de Stitch. */
export function PanelPage() {
  return (
    <div className="w-full bg-surface font-body-md text-on-surface antialiased">
      <PanelSidebar />
      <div className="pl-64">
        <main className="relative pt-16 bg-surface w-full min-h-screen">
          <div className="flex flex-col w-full p-space-md lg:p-space-lg gap-space-lg">
            <PanelOverview />
            <PanelLicense />
            <PanelBilling />
            <PanelBackups />
          </div>
        </main>
      </div>
    </div>
  )
}
