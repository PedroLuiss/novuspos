import { MS } from '@/shared/ui/MS'
import { formatBytes, relativeDay } from '../lib/backupFormatters'
import type { BackupRecord } from '../types'

interface Stat {
  label: string
  value: string
  detail: string
  icon: string
}

function buildStats(backups: BackupRecord[]): Stat[] {
  const verified = backups.filter((item) => item.status === 'verified').length
  const totalBytes = backups.reduce((sum, item) => sum + item.sizeBytes, 0)
  const latest = backups.reduce<BackupRecord | null>(
    (current, item) => (!current || new Date(item.createdAt) > new Date(current.createdAt) ? item : current),
    null,
  )
  return [
    {
      label: 'Copias registradas',
      value: String(backups.length),
      detail: `${verified} verificadas`,
      icon: 'inventory_2',
    },
    {
      label: 'Última copia',
      value: latest ? relativeDay(latest.createdAt) : 'Sin copias',
      detail: latest ? 'Disponible en tu equipo' : 'Registra la primera',
      icon: 'event_available',
    },
    {
      label: 'Espacio usado',
      value: formatBytes(totalBytes),
      detail: 'Entre todas las copias',
      icon: 'storage',
    },
    {
      label: 'Estado general',
      value: backups.some((item) => item.status === 'failed') ? 'Revisar' : 'Al día',
      detail: backups.some((item) => item.status === 'pending') ? 'Hay copias en espera' : 'Todo en orden',
      icon: 'verified_user',
    },
  ]
}

/** Indicadores resumidos del registro de copias. */
export function BackupStats({ backups }: { backups: BackupRecord[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-space-sm">
      {buildStats(backups).map((stat) => (
        <div key={stat.label} className="rounded-xl bg-surface-container-lowest p-space-md shadow-sm flex items-start gap-space-sm">
          <div className="w-10 h-10 rounded-lg bg-primary-fixed/50 text-primary flex items-center justify-center shrink-0">
            <MS name={stat.icon} className="text-[20px]" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-label-sm text-label-sm text-on-surface-variant">{stat.label}</span>
            <span className="font-headline-sm text-headline-sm text-on-surface font-bold truncate">{stat.value}</span>
            <span className="font-body-sm text-body-sm text-outline truncate">{stat.detail}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
