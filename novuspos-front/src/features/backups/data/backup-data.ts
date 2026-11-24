import type { BackupSnapshot } from '../types'

/** Copia de ejemplo con fecha relativa para que el portal nunca se vea vencido. */
export function createDemoBackup(): BackupSnapshot {
  const date = new Date()
  date.setDate(date.getDate() - 1)
  date.setHours(20, 5, 0, 0)
  return { id: 'bk-demo-latest', createdAt: date.toISOString() }
}
