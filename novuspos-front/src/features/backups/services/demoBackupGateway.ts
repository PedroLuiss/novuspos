import { createDemoBackups } from '../data/backup-data'
import type { BackupRecord, RegisterBackupRequest } from '../types'
import type { BackupGateway } from './backupGateway'

const STORAGE_KEY = 'novuspos:demo-backups'
const DEMO_DELAY_MS = 220

function readState(): BackupRecord[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as BackupRecord[]
      if (Array.isArray(parsed)) return parsed
    }
  } catch {
    // Se usa el estado inicial.
  }
  return createDemoBackups()
}

function writeState(backups: BackupRecord[]): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(backups))
  } catch {
    // El modo demo sigue funcionando en memoria durante la sesión.
  }
}

function wait(): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, DEMO_DELAY_MS))
}

function sortNewest(backups: BackupRecord[]): BackupRecord[] {
  return [...backups].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

/** Adaptador demo: mismo contrato que la API, sin red y con persistencia local. */
export const demoBackupGateway: BackupGateway = {
  async list(): Promise<BackupRecord[]> {
    await wait()
    return sortNewest(readState())
  },

  async register(request: RegisterBackupRequest): Promise<BackupRecord> {
    await wait()
    const record: BackupRecord = {
      id: `bk-${Date.now()}`,
      device: request.device.trim(),
      kind: request.kind,
      createdAt: request.createdAt,
      sizeBytes: request.file.size,
      status: 'pending',
      note: request.note?.trim() || undefined,
      fileName: request.file.name,
    }
    writeState([record, ...readState()])
    return record
  },

  async verify(backupId: string): Promise<BackupRecord> {
    await wait()
    const backups = readState()
    const record = backups.find((item) => item.id === backupId)
    if (!record) throw new Error('No encontramos esa copia.')
    record.status = 'verified'
    writeState(backups)
    return { ...record }
  },

  async remove(backupId: string): Promise<void> {
    await wait()
    writeState(readState().filter((item) => item.id !== backupId))
  },

  async download(backupId: string): Promise<Blob> {
    await wait()
    const record = readState().find((item) => item.id === backupId)
    if (!record) throw new Error('No encontramos esa copia.')
    return new Blob(
      [`Registro de copia de NovusPOS\nEquipo: ${record.device}\nFecha: ${record.createdAt}\nEstado: ${record.status}\n`],
      { type: 'text/plain' },
    )
  },
}
