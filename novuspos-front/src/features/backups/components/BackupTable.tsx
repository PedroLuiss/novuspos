import { MS } from '@/shared/ui/MS'
import { backupTitle, formatBackupDate, formatBytes } from '../lib/backupFormatters'
import type { BackupRecord } from '../types'
import { BackupStatusChip } from './BackupStatusChip'

interface Props {
  backups: BackupRecord[]
  busyId: string | null
  onVerify: (backupId: string) => void
  onDownload: (record: BackupRecord) => void
  onDelete: (record: BackupRecord) => void
}

/** Historial de copias registradas desde la aplicación de escritorio. */
export function BackupTable({ backups, busyId, onVerify, onDownload, onDelete }: Props) {
  if (backups.length === 0) {
    return (
      <div className="rounded-xl bg-surface-container-lowest p-space-xl shadow-sm flex flex-col items-center text-center gap-space-xs">
        <div className="w-14 h-14 rounded-full bg-surface-container flex items-center justify-center text-primary">
          <MS name="backup" className="text-[28px]" />
        </div>
        <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">Todavía no hay copias registradas</h3>
        <p className="font-body-sm text-body-sm text-on-surface-variant max-w-sm">
          Cuando NovusPOS cree una copia en tu equipo, regístrala aquí para llevar el control y descargarla cuando la necesites.
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-xl bg-surface-container-lowest shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-surface-container-low">
            <tr className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
              <th className="px-space-md py-space-sm font-semibold">Copia</th>
              <th className="px-space-md py-space-sm font-semibold">Equipo</th>
              <th className="px-space-md py-space-sm font-semibold">Fecha</th>
              <th className="px-space-md py-space-sm font-semibold">Tamaño</th>
              <th className="px-space-md py-space-sm font-semibold">Estado</th>
              <th className="px-space-md py-space-sm font-semibold text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {backups.map((record) => (
              <tr key={record.id} className="border-t border-outline-variant hover:bg-surface-container-low/60 transition-colors">
                <td className="px-space-md py-space-sm">
                  <div className="flex items-center gap-space-xs">
                    <div className="w-9 h-9 rounded-lg bg-primary-fixed/40 text-primary flex items-center justify-center shrink-0">
                      <MS name="database" className="text-[19px]" />
                    </div>
                    <span className="font-label-md text-label-md text-on-surface font-semibold">{backupTitle(record)}</span>
                  </div>
                </td>
                <td className="px-space-md py-space-sm font-body-sm text-body-sm text-on-surface-variant">{record.device}</td>
                <td className="px-space-md py-space-sm font-body-sm text-body-sm text-on-surface-variant">{formatBackupDate(record.createdAt)}</td>
                <td className="px-space-md py-space-sm font-body-sm text-body-sm text-on-surface-variant">{formatBytes(record.sizeBytes)}</td>
                <td className="px-space-md py-space-sm"><BackupStatusChip status={record.status} /></td>
                <td className="px-space-md py-space-sm">
                  <div className="flex items-center justify-end gap-space-xs">
                    {record.status === 'pending' && (
                      <button
                        type="button"
                        disabled={busyId === record.id}
                        onClick={() => onVerify(record.id)}
                        title="Verificar copia"
                        aria-label={`Verificar copia del ${formatBackupDate(record.createdAt)}`}
                        className="w-8 h-8 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary flex items-center justify-center disabled:opacity-50"
                      >
                        <MS name="fact_check" className="text-[18px]" />
                      </button>
                    )}
                    <button
                      type="button"
                      disabled={busyId === record.id}
                      onClick={() => onDownload(record)}
                      title="Descargar copia"
                      aria-label={`Descargar copia del ${formatBackupDate(record.createdAt)}`}
                      className="w-8 h-8 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary flex items-center justify-center disabled:opacity-50"
                    >
                      <MS name="file_download" className="text-[18px]" />
                    </button>
                    <button
                      type="button"
                      disabled={busyId === record.id}
                      onClick={() => onDelete(record)}
                      title="Eliminar registro"
                      aria-label={`Eliminar registro del ${formatBackupDate(record.createdAt)}`}
                      className="w-8 h-8 rounded-lg bg-surface-container hover:bg-error-container hover:text-error text-on-surface-variant flex items-center justify-center disabled:opacity-50"
                    >
                      <MS name="delete_outline" className="text-[18px]" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
