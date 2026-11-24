import { MS } from '@/shared/ui/MS'
import { installerInfo } from '../data/dashboard-data'

/** Tarjeta de descarga del instalador: contenido fijo, sin datos de la cuenta. */
export function InstallerCard() {
  return (
    <div className="rounded-xl bg-surface-container-lowest p-space-lg shadow-sm flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between mb-space-sm">
          <div className="flex items-center gap-space-xs">
            <MS name="system_update" className="text-secondary text-[22px]" />
            <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">NovusPOS para Windows</h2>
          </div>
          <span className="font-label-sm text-label-sm font-mono text-on-surface-variant">
            {installerInfo.releaseLabel}
          </span>
        </div>
        <p className="font-body-md text-body-md text-on-surface-variant mb-space-sm">
          Descarga lista para instalar y empezar a vender.
        </p>
        <div className="flex flex-col gap-space-xs my-space-sm p-space-sm rounded-lg bg-surface-container-low">
          <span className="font-label-sm text-[11px] font-bold text-on-surface tracking-wider uppercase">
            Lo que incluye:
          </span>
          {installerInfo.highlights.map((highlight) => (
            <div key={highlight} className="flex items-start gap-space-xs text-on-surface-variant font-body-sm text-body-sm">
              <MS name="check" className="text-secondary text-[16px] shrink-0 mt-0.5" />
              <span>{highlight}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="pt-space-md flex flex-col gap-space-xs">
        <a
          href={installerInfo.downloadHref}
          className="w-full py-2.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md font-semibold flex items-center justify-center gap-2 transition-colors"
        >
          <MS name="download_for_offline" className="text-[18px]" />
          Descargar instalador de Windows
        </a>
        <div className="flex items-center justify-between text-on-surface-variant px-space-xs pt-1">
          <span className="font-label-sm text-[11px] font-mono">Windows 10 / 11 • 64 bits</span>
          <a href="/#interfaz-en-vivo" className="font-label-sm text-[11px] text-primary hover:underline">
            Ver capturas del sistema
          </a>
        </div>
      </div>
    </div>
  )
}
