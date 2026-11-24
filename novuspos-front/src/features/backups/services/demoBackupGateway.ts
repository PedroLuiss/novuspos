import { createDemoBackup } from '../data/backup-data'
import type { BackupSnapshot, BackupUploadRequest } from '../types'
import type { BackupGateway } from './backupGateway'

const STORAGE_KEY = 'novuspos:demo-latest-backup'
const LEGACY_KEY = 'novuspos:demo-backups'
const DEMO_DELAY_MS = 220

interface BackupLite {
  id?: string
  createdAt?: string
  sizeBytes?: number
  source?: string
}

function readState(): BackupSnapshot | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as BackupLite
      if (parsed?.createdAt) return parsed as BackupSnapshot
    }
    const legacy = window.localStorage.getItem(LEGACY_KEY)
    if (legacy) {
      const parsed = JSON.parse(legacy) as BackupLite[]
      if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].createdAt) {
        return parsed[0] as BackupSnapshot
      }
    }
  } catch {
    // Se usa la copia de ejemplo.
  }
  return createDemoBackup()
}

function writeState(backup: BackupSnapshot): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(backup))
  } catch {
    // El modo demo sigue funcionando durante la sesión.
  }
}

function wait(): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, DEMO_DELAY_MS))
}

/** Adaptador demo: una sola copia, persistida en localStorage. */
export const demoBackupGateway: BackupGateway = {
  async getLatest(): Promise<BackupSnapshot | null> {
    await wait()
    return readState()
  },

  async upload(request: BackupUploadRequest): Promise<BackupSnapshot> {
    await wait()
    const backup: BackupSnapshot = {
      id: `bk-${Date.now()}`,
      createdAt: request.createdAt,
      sizeBytes: request.file.size,
      source: request.source,
    }
    writeState(backup)
    return backup
  },
}
