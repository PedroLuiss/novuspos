import { MS } from '@/shared/ui/MS'
import type { DashboardSummary } from '../types'

/** Cabecera de bienvenida del panel. */
export function DashboardBanner({ summary }: { summary: DashboardSummary }) {
  return (
    <div className="relative overflow-hidden rounded-xl bg-surface-container-lowest p-space-lg shadow-sm">
      <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
      <div className="absolute right-48 -bottom-20 w-64 h-64 rounded-full bg-secondary-container/20 blur-2xl pointer-events-none" />
      <div className="relative flex flex-col xl:flex-row xl:items-center justify-between gap-space-md">
        <div className="flex flex-col gap-space-xs max-w-2xl">
          <div className="flex items-center gap-space-sm flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-semibold">
              <span className="w-2 h-2 rounded-full bg-secondary" />
              Tu cuenta NovusPOS
            </span>
            <span className="font-label-sm text-label-sm font-mono text-on-surface-variant">
              Tu clave, tu plan y tu respaldo en un solo lugar
            </span>
            <span className="font-label-sm text-label-sm text-outline-variant">•</span>
            <span className="font-label-sm text-label-sm text-primary font-mono font-medium">NovusPOS para Windows</span>
          </div>
          <h1 className="font-headline-md text-headline-md text-on-surface font-extrabold tracking-tight mt-1">
            Panel de Cliente NovusPOS
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Bienvenido, <span className="font-semibold text-on-surface">{summary.organizationName}</span>. Aquí ves tu
            clave de activación, el estado de tu suscripción y la fecha de tu último respaldo.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-space-sm pt-space-xs xl:pt-0">
          <a
            href="/#descargar"
            className="flex items-center gap-space-sm px-space-md py-space-sm rounded-lg bg-gradient-to-r from-primary-container to-primary text-on-primary font-label-md text-label-md shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
          >
            <MS name="download" className="text-[20px]" />
            <div className="flex flex-col text-left leading-none">
              <span className="font-bold">Descargar NovusPOS</span>
              <span className="font-label-sm text-[10px] opacity-80 font-mono">Para Windows • 30 días gratis</span>
            </div>
          </a>
          <a
            href="/panel/respaldos"
            className="flex items-center gap-space-xs px-space-md py-3 rounded-lg bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors font-label-md text-label-md"
          >
            <MS name="cloud_upload" className="text-[18px]" />
            <span>Respaldos</span>
          </a>
        </div>
      </div>
    </div>
  )
}
