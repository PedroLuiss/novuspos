import type { BackupSnapshot, BackupUploadRequest } from '../types'

/** Contrato único para el modo demo y para la API del portal. */
export interface BackupGateway {
  getLatest(): Promise<BackupSnapshot | null>
  /** Reemplaza la copia anterior; el servidor guarda siempre solo una. */
  upload(request: BackupUploadRequest): Promise<BackupSnapshot>
}
