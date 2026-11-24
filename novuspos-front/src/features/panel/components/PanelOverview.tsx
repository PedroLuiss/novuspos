import { useAuth } from '@/shared/hooks/useAuth'
import { MS } from '@/shared/ui/MS'

/** Banner de identidad y fila de KPIs del panel (réplica de Stitch). */
export function PanelOverview() {
  const { user } = useAuth()

  return (
    <>
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
                Suscripción y pagos en un solo lugar
              </span>
              <span className="font-label-sm text-label-sm font-mono text-outline-variant">•</span>
              <span className="font-label-sm text-label-sm text-primary font-mono font-medium">NovusPOS para Windows</span>
            </div>
            <h1 className="font-headline-md text-headline-md text-on-surface font-extrabold tracking-tight mt-1">
              Panel de Cliente NovusPOS
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Bienvenido, <span className="font-semibold text-on-surface">{user?.organizationName ?? 'tu negocio'}</span>.
              Administra tu licencia, tus respaldos y la descarga de NovusPOS para Windows.
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
            <button
              className="flex items-center gap-space-xs px-space-md py-3 rounded-lg bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors font-label-md text-label-md"
              onClick={() => document.getElementById('respaldos-section')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <MS name="cloud_upload" className="text-[18px]" />
              <span>Respaldos</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-space-md">
        {/* Estado de membresía */}
        <div className="rounded-xl bg-surface-container-lowest p-space-md shadow-sm flex flex-col justify-between relative overflow-hidden group hover:translate-y-[-2px] transition-transform">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
                Mi Suscripción
              </span>
              <a href="/panel/suscripcion" className="font-headline-sm text-headline-sm text-on-surface font-bold mt-1 hover:text-primary transition-colors">
                Ver detalle
              </a>
            </div>
            <div className="w-10 h-10 rounded-lg bg-secondary-container/50 flex items-center justify-center text-secondary">
              <MS name="verified" className="text-[22px]" />
            </div>
          </div>
          <div className="mt-space-md pt-space-sm flex items-center justify-between">
            <span className="font-label-sm text-label-sm font-mono text-secondary font-medium flex items-center gap-1">
              <MS name="event_repeat" className="text-[14px]" /> Planes y pagos
            </span>
            <a href="/panel/suscripcion" className="font-label-sm text-label-sm font-mono text-primary font-bold hover:underline">
              Ir al módulo →
            </a>
          </div>
        </div>

        {/* Equipos */}
        <div className="rounded-xl bg-surface-container-lowest p-space-md shadow-sm flex flex-col justify-between relative overflow-hidden group hover:translate-y-[-2px] transition-transform">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
                Tu Equipo de Cobro
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="font-headline-sm text-headline-sm text-on-surface font-bold">1</span>
                <span className="font-body-md text-body-md text-on-surface-variant font-mono">/ 1 en uso</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-primary-fixed/60 flex items-center justify-center text-primary">
              <MS name="desktop_windows" className="text-[22px]" />
            </div>
          </div>
          <div className="mt-space-md pt-space-sm flex flex-col gap-1">
            <div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden">
              <div className="bg-primary h-full rounded-full w-full" />
            </div>
            <div className="flex justify-between items-center text-on-surface-variant">
              <span className="font-label-sm text-[11px] font-mono">Windows 10 / 11</span>
              <span className="font-label-sm text-[11px] font-mono text-secondary">Listo</span>
            </div>
          </div>
        </div>

        {/* Respaldos */}
        <div className="rounded-xl bg-surface-container-lowest p-space-md shadow-sm flex flex-col justify-between relative overflow-hidden group hover:translate-y-[-2px] transition-transform">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
                Último Respaldo
              </span>
              <span className="font-headline-sm text-headline-sm text-on-surface font-bold mt-1">En tu equipo</span>
            </div>
            <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary-container">
              <MS name="cloud_done" className="text-[22px]" />
            </div>
          </div>
          <div className="mt-space-md pt-space-sm flex items-center justify-between">
            <span className="font-label-sm text-label-sm font-mono text-on-surface-variant truncate max-w-[150px]">
              Registro de copias
            </span>
            <a href="/panel/respaldos" className="font-label-sm text-label-sm font-mono text-primary font-bold hover:underline">
              Ver detalle →
            </a>
          </div>
        </div>

        {/* Soporte */}
        <div className="rounded-xl bg-surface-container-lowest p-space-md shadow-sm flex flex-col justify-between relative overflow-hidden group hover:translate-y-[-2px] transition-transform">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
                Soporte y Garantía
              </span>
              <span className="font-headline-sm text-headline-sm text-on-surface font-bold mt-1">Desde la app</span>
            </div>
            <div className="w-10 h-10 rounded-lg bg-secondary-container/40 flex items-center justify-center text-secondary">
              <MS name="support_agent" className="text-[22px]" />
            </div>
          </div>
          <div className="mt-space-md pt-space-sm flex items-center justify-between">
            <span className="font-label-sm text-label-sm font-mono text-secondary flex items-center gap-1 font-semibold">
              <MS name="check_circle" className="text-[14px]" /> Consulta tus tickets
            </span>
            <a href="/" className="font-label-sm text-label-sm text-primary font-semibold cursor-pointer hover:underline">
              Centro de ayuda
            </a>
          </div>
        </div>
      </div>
    </>
  )
}
