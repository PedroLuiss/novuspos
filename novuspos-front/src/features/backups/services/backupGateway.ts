import type { BackupRecord, RegisterBackupRequest } from '../types'

/** Contrato único para el modo demo y para la API del portal. */
export interface BackupGateway {
  list(): Promise<BackupRecord[]>
  register(request: RegisterBackupRequest): Promise<BackupRecord>
  verify(backupId: string): Promise<BackupRecord>
  remove(backupId: string): Promise<void>
  download(backupId: string): Promise<Blob>
}
