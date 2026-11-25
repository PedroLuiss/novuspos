import { MS } from '@/shared/ui/MS'
import { lastBackupLabel } from '../lib/dashboardFormatters'

/** Recordatorio de la copia más reciente; el detalle vive en su módulo. */
export function LastBackupCard({ lastBackupAt }: { lastBackupAt: string | null }) {
  return (
    <div className="rounded-xl bg-surface-container-lowest p-space-lg shadow-sm flex flex-col gap-space-sm h-full">
      <div className="flex items-center gap-space-xs">
        <MS name="hard_drive" className="text-secondary text-[22px]" />
        <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">Tu último respaldo</h2>
      </div>
      <div className="flex items-baseline gap-space-xs">
        <span className="font-headline-md text-headline-md font-bold text-on-surface">
          {lastBackupLabel(lastBackupAt)}
        </span>
        <span className="font-body-sm text-body-sm text-on-surface-variant">en tu cuenta</span>
      </div>
      <p className="font-body-sm text-body-sm text-on-surface-variant">
        Guardamos solo tu copia más reciente, siempre lista para recuperar tus datos.
      </p>
      <a
        href="/panel/respaldos"
        className="mt-auto self-start flex items-center gap-1 font-label-md text-label-md font-semibold text-primary hover:underline"
      >
        Ver detalle <MS name="arrow_forward" className="text-[16px]" />
      </a>
    </div>
  )
}
