/** Tipos públicos del módulo de copias de seguridad. */

/** Solo existe una copia vigente por cuenta: la más reciente. */
export interface BackupSnapshot {
  id: string
  createdAt: string
  /** Tamaño opcional, para uso interno; no se muestra en la interfaz. */
  sizeBytes?: number
  /** Origen de la copia, para uso interno; no se muestra en la interfaz. */
  source?: string
}

/** Carga que envía NovusPOS Desktop. Los campos internos no se muestran al usuario. */
export interface BackupUploadRequest {
  createdAt: string
  file: File
  checksum?: string
  source?: string
}
