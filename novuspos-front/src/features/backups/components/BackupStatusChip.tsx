import { MS } from '@/shared/ui/MS'
import { statusLabels } from '../data/backup-data'
import type { BackupStatus } from '../types'

const styles: Record<BackupStatus, { icon: string; className: string }> = {
  verified: { icon: 'verified', className: 'bg-secondary-container text-on-secondary-container' },
  pending: { icon: 'schedule', className: 'bg-tertiary-container text-on-tertiary-container' },
  failed: { icon: 'error_outline', className: 'bg-error-container text-on-error-container' },
}

export function BackupStatusChip({ status }: { status: BackupStatus }) {
  const style = styles[status]
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full font-label-sm text-label-sm font-semibold ${style.className}`}>
      <MS name={style.icon} className="text-[14px]" />
      {statusLabels[status]}
    </span>
  )
}
