import { ValidationError } from '@/shared/services/apiClient'
import type { BackupUploadRequest } from '../types'
import { resolveBackupGateway } from './backupGatewayFactory'

/** Fachada del módulo: aísla a los hooks del adaptador demo y del HTTP. */
const gateway = resolveBackupGateway()

export const backupService = {
  getLatest: () => gateway.getLatest(),

  async upload(request: BackupUploadRequest) {
    if (!request.file) {
      throw new ValidationError({ file: ['Selecciona la copia que quieres guardar.'] })
    }
    return gateway.upload(request)
  },
}
