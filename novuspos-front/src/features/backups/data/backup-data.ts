import type { BackupKind, BackupRecord, BackupStatus } from '../types'

export const kindLabels: Record<BackupKind, string> = {
  automatic: 'Automática',
  manual: 'Manual',
  shift_close: 'Al cerrar turno',
}

export const statusLabels: Record<BackupStatus, string> = {
  verified: 'Verificada',
  pending: 'En espera',
  failed: 'Con incidencia',
}

export const kindOptions: { value: BackupKind; label: string }[] = [
  { value: 'automatic', label: kindLabels.automatic },
  { value: 'manual', label: kindLabels.manual },
  { value: 'shift_close', label: kindLabels.shift_close },
]

const MB = 1024 * 1024

function daysAgo(days: number, hour = 10, minute = 30): string {
  const date = new Date()
  date.setDate(date.getDate() - days)
  date.setHours(hour, minute, 0, 0)
  return date.toISOString()
}

/** Datos de ejemplo con fechas relativas para que el panel nunca se vea vencido. */
export function createDemoBackups(): BackupRecord[] {
  return [
    {
      id: 'bk-demo-4',
      device: 'Caja Principal',
      kind: 'automatic',
      createdAt: daysAgo(0, 9, 15),
      sizeBytes: 18.4 * MB,
      status: 'verified',
    },
    {
      id: 'bk-demo-3',
      device: 'Caja Principal',
      kind: 'shift_close',
      createdAt: daysAgo(1, 20, 5),
      sizeBytes: 18.1 * MB,
      status: 'verified',
    },
    {
      id: 'bk-demo-2',
      device: 'Caja Principal',
      kind: 'manual',
      createdAt: daysAgo(3, 14, 42),
      sizeBytes: 17.8 * MB,
      status: 'verified',
    },
    {
      id: 'bk-demo-1',
      device: 'Caja Principal',
      kind: 'automatic',
      createdAt: daysAgo(7, 8, 0),
      sizeBytes: 17.2 * MB,
      status: 'failed',
      note: 'No se pudo completar la verificación.',
    },
  ]
}
