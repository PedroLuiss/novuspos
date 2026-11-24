import { apiClient } from '@/shared/services/apiClient'
import { BACKUP_ENDPOINTS } from '@/shared/services/endpoints'
import type { BackupRecord, RegisterBackupRequest } from '../types'
import type { BackupGateway } from './backupGateway'

/** Adaptador real: el registro se envía como carga multipart con el archivo. */
export const httpBackupGateway: BackupGateway = {
  list(): Promise<BackupRecord[]> {
    return apiClient.get<BackupRecord[]>(BACKUP_ENDPOINTS.list)
  },

  register(request: RegisterBackupRequest): Promise<BackupRecord> {
    const form = new FormData()
    form.append('device', request.device.trim())
    form.append('kind', request.kind)
    form.append('createdAt', request.createdAt)
    form.append('file', request.file, request.file.name)
    if (request.note?.trim()) form.append('note', request.note.trim())
    return apiClient.post<BackupRecord>(BACKUP_ENDPOINTS.create, form)
  },

  verify(backupId: string): Promise<BackupRecord> {
    return apiClient.patch<BackupRecord>(BACKUP_ENDPOINTS.verify(backupId), {})
  },

  remove(backupId: string): Promise<void> {
    return apiClient.delete<void>(BACKUP_ENDPOINTS.remove(backupId))
  },

  download(backupId: string): Promise<Blob> {
    return apiClient.getBlob(BACKUP_ENDPOINTS.download(backupId))
  },
}
