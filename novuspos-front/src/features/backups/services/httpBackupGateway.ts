import { apiClient } from '@/shared/services/apiClient'
import { BACKUP_ENDPOINTS } from '@/shared/services/endpoints'
import type { BackupSnapshot, BackupUploadRequest } from '../types'
import type { BackupGateway } from './backupGateway'

type Raw = Record<string, unknown>

function isRecord(value: unknown): value is Raw {
  return typeof value === 'object' && value !== null
}

function normalize(payload: unknown): BackupSnapshot | null {
  if (!payload) return null
  const raw = isRecord(payload)
    ? ((payload.backup ?? payload.data ?? payload) as Raw)
    : null
  if (Array.isArray(payload)) {
    const sorted = [...payload].sort(
      (a: Raw, b: Raw) => new Date(String(b.createdAt)).getTime() - new Date(String(a.createdAt)).getTime(),
    )
    return sorted.length > 0 ? (sorted[0] as BackupSnapshot) : null
  }
  if (!raw || typeof raw.createdAt !== 'string') return null
  return {
    id: typeof raw.id === 'string' ? raw.id : 'latest',
    createdAt: raw.createdAt,
    sizeBytes: typeof raw.sizeBytes === 'number' ? raw.sizeBytes : undefined,
    source: typeof raw.source === 'string' ? raw.source : undefined,
  }
}

/** Adaptador real: la API guarda solo la copia más reciente. */
export const httpBackupGateway: BackupGateway = {
  async getLatest(): Promise<BackupSnapshot | null> {
    return normalize(await apiClient.get<unknown>(BACKUP_ENDPOINTS.latest))
  },

  upload(request: BackupUploadRequest): Promise<BackupSnapshot> {
    const form = new FormData()
    form.append('database', request.file, request.file.name)
    form.append('created_at', request.createdAt)
    if (request.checksum) form.append('sha256', request.checksum)
    form.append('source', request.source ?? 'novuspos-desktop')
    return apiClient.post<unknown>(BACKUP_ENDPOINTS.upload, form).then((payload) => {
      const backup = normalize(payload)
      if (!backup) throw new Error('No pudimos guardar la copia.')
      return backup
    })
  },
}
