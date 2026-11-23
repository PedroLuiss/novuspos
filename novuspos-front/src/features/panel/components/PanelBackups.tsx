import { backups } from '@/features/panel/data/panel-data'
import { MS } from '@/shared/ui/MS'

/** Centro de respaldos (réplica de Stitch). */
export function PanelBackups() {
  return (
    <div className="rounded-xl bg-surface-container-lowest p-space-lg shadow-sm flex flex-col gap-space-md" id="respaldos-section">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm">
        <div className="flex items-center gap-space-xs">
          <MS name="cloud_sync" className="text-primary-container text-[24px]" />
          <div>
            <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">Centro de Respaldos</h2>
            <span className="font-body-sm text-body-sm text-on-surface-variant">
              Copias de tu catálogo, ventas y turnos.
            </span>
          </div>
        </div>
        <div className="flex items-center gap-space-sm">
          <span className="font-label-sm text-label-sm font-mono text-secondary flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-secondary" /> Copias en tu equipo
          </span>
          <button className="px-space-md py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md transition-colors flex items-center gap-1.5">
            <MS name="sync" className="text-[18px]" />
            Forzar Respaldo Ahora
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-space-sm">
        {backups.map((backup) => (
          <div
            key={backup.name}
            className="p-space-md rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors flex flex-col md:flex-row md:items-center justify-between gap-space-sm"
          >
            <div className="flex items-center gap-space-md">
              <div className="w-10 h-10 rounded-lg bg-surface-container-lowest flex items-center justify-center text-primary shadow-sm">
                <MS name="database" className="text-[20px]" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-label-md text-label-md font-mono font-bold text-on-surface">{backup.name}</span>
                  {backup.recent && (
                    <span className="px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-label-sm text-[10px] font-bold">
                      MÁS RECIENTE
                    </span>
                  )}
                </div>
                <span className="font-body-sm text-body-sm text-on-surface-variant font-mono">{backup.meta}</span>
              </div>
            </div>
            <div className="flex items-center gap-space-md justify-between md:justify-end">
              <span className="font-label-sm text-label-sm font-mono font-bold text-on-surface">{backup.size}</span>
              <div className="flex items-center gap-space-xs">
                <button className="px-space-md py-1.5 rounded-lg bg-surface-container-lowest hover:bg-surface-bright text-primary font-label-md text-label-md font-semibold transition-colors flex items-center gap-1 shadow-sm">
                  <MS name="file_download" className="text-[16px]" />
                  Descargar copia
                </button>
                <button
                  className="px-space-sm py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-colors"
                  aria-label="Restaurar copia"
                >
                  <MS name="settings_backup_restore" className="text-[18px]" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-space-sm rounded-lg bg-surface-container flex items-center justify-between flex-wrap gap-2 text-on-surface-variant font-body-sm text-body-sm">
        <div className="flex items-center gap-2">
          <MS name="lock" className="text-secondary text-[18px]" />
          <span>Tus respaldos se guardan en tu computadora y puedes descargarlos cuando quieras.</span>
        </div>
        <a href="/" className="font-label-sm text-label-sm text-primary hover:underline font-semibold">
          Ver cómo funciona
        </a>
      </div>
    </div>
  )
}
