import { MS } from '@/shared/ui/MS'
import { useLatestBackup } from '../hooks/useLatestBackup'
import { BackupCard } from './BackupCard'
import { BackupSkeleton } from './BackupSkeleton'

/** Módulo de Copias de Seguridad: solo la copia vigente. */
export function BackupOverview() {
  const { backup, isLoading, error, refresh } = useLatestBackup()

  if (isLoading && !backup) {
    return <BackupSkeleton />
  }

  return (
    <div className="flex flex-col gap-space-lg">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm">
        <div className="flex items-center gap-space-xs">
          <MS name="cloud_sync" className="text-primary text-[22px]" />
          <div>
            <h1 className="font-headline-md text-headline-md text-on-surface font-bold">Copias de Seguridad</h1>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Tu copia más reciente, siempre lista cuando la necesites.
              {isLoading && <span className="text-primary"> Actualizando…</span>}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => void refresh()}
          className="self-start px-space-md py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md font-semibold flex items-center gap-1.5"
        >
          <MS name="sync" className="text-[18px]" /> Actualizar
        </button>
      </div>

      {error && (
        <div className="p-space-sm rounded-lg bg-error-container text-on-error-container font-body-sm text-body-sm" role="alert">
          {error}
        </div>
      )}

      {backup ? (
        <BackupCard backup={backup} />
      ) : (
        <div className="rounded-xl bg-surface-container-lowest p-space-lg shadow-sm font-body-md text-body-md text-on-surface-variant">
          Todavía no hay una copia registrada en tu cuenta.
        </div>
      )}

      <div className="flex items-start gap-space-xs rounded-lg bg-surface-container p-space-sm">
        <MS name="info" className="text-primary text-[18px] shrink-0 mt-0.5" />
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          Guardamos solo tu copia más reciente para cuidar tu información. Si vuelves a instalar NovusPOS en otra
          computadora, entra con tu cuenta y tus datos quedan como si no hubiera pasado nada.
        </p>
      </div>
    </div>
  )
}
