/** Tipos públicos del módulo de copias de seguridad. */

export type BackupKind = 'automatic' | 'manual' | 'shift_close'

/** Estado operativo que se muestra al usuario; sin detalles técnicos. */
export type BackupStatus = 'verified' | 'pending' | 'failed'

export interface BackupRecord {
  id: string
  device: string
  kind: BackupKind
  createdAt: string
  sizeBytes: number
  status: BackupStatus
  note?: string
  /** Solo se usa internamente para el nombre del archivo al descargar. */
  fileName?: string
}

export interface RegisterBackupRequest {
  device: string
  kind: BackupKind
  createdAt: string
  file: File
  note?: string
}

export interface BackupFieldErrors {
  device?: string
  kind?: string
  createdAt?: string
  file?: string
  note?: string
}
