import { MS } from '@/shared/ui/MS'
import { backupDayLabel, formatBackupDate } from '../lib/backupFormatters'
import type { BackupSnapshot } from '../types'

/** Única tarjeta del módulo: la copia más reciente de la cuenta. */
export function BackupCard({ backup }: { backup: BackupSnapshot }) {
  return (
    <div className="rounded-xl bg-surface-container-lowest p-space-lg shadow-sm flex flex-col gap-space-md sm:flex-row sm:items-center justify-between">
      <div className="flex items-start sm:items-center gap-space-md">
        <div className="w-16 h-16 rounded-xl bg-primary-fixed/60 flex items-center justify-center text-primary shrink-0">
          <MS name="hard_drive" className="text-[34px]" />
        </div>
        <div className="flex flex-col gap-space-xs">
          <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
            Última copia de seguridad
          </span>
          <span className="font-headline-md text-headline-md font-bold text-on-surface leading-tight">
            {backupDayLabel(backup.createdAt)}
          </span>
          <span className="font-label-md text-label-md font-mono text-on-surface-variant">
            {formatBackupDate(backup.createdAt)}
          </span>
        </div>
      </div>
      <span className="inline-flex items-center gap-1.5 self-start sm:self-center px-space-sm py-1.5 rounded-full bg-secondary-container text-on-secondary-container font-label-md text-label-md font-semibold whitespace-nowrap">
        <MS name="cloud_done" className="text-[16px]" /> Lista en tu cuenta
      </span>
    </div>
  )
}
