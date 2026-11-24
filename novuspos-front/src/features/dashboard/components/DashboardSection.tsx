import { MS } from '@/shared/ui/MS'
import { useDashboard } from '../hooks/useDashboard'
import { AccessCard } from './AccessCard'
import { DashboardBanner } from './DashboardBanner'
import { InstallerCard } from './InstallerCard'
import { LastBackupCard } from './LastBackupCard'

/** Compone el panel general a partir de una sola carga de datos. */
export function DashboardSection() {
  const { summary, isLoading, error, refresh } = useDashboard()

  if (isLoading && !summary) {
    return (
      <div className="rounded-xl bg-surface-container-lowest p-space-xl shadow-sm flex items-center justify-center gap-space-xs text-on-surface-variant">
        <MS name="progress_activity" className="animate-spin text-primary text-xl" />
        <span className="font-body-md text-body-md">Cargando tu panel…</span>
      </div>
    )
  }

  if (!summary) {
    return (
      <div className="rounded-xl bg-surface-container-lowest p-space-lg shadow-sm flex flex-col gap-space-sm">
        <p className="font-body-md text-body-md text-error">{error ?? 'No pudimos cargar tu panel.'}</p>
        <button
          type="button"
          onClick={() => void refresh()}
          className="self-start px-space-md py-2 rounded-lg bg-primary text-on-primary font-label-md text-label-md font-semibold"
        >
          Reintentar
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-space-lg">
      <DashboardBanner summary={summary} />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-md items-stretch">
        <div className="lg:col-span-7">
          <AccessCard summary={summary} />
        </div>
        <div className="lg:col-span-5 flex flex-col gap-space-md">
          <LastBackupCard lastBackupAt={summary.lastBackupAt} />
          <InstallerCard />
        </div>
      </div>
      {error && (
        <div className="p-space-sm rounded-lg bg-error-container text-on-error-container font-body-sm text-body-sm" role="alert">
          {error}
        </div>
      )}
    </div>
  )
}
