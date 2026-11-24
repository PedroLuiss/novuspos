import { ValidationError } from '@/shared/services/apiClient'
import { hasBackupErrors, validateBackupForm } from '../lib/backupValidation'
import type { RegisterBackupRequest } from '../types'
import { resolveBackupGateway } from './backupGatewayFactory'

/** Fachada del módulo: valida antes de enviar y aísla a los hooks del adaptador. */
const gateway = resolveBackupGateway()

export const backupService = {
  list: () => gateway.list(),

  async register(request: RegisterBackupRequest) {
    const errors = validateBackupForm({
      device: request.device,
      kind: request.kind,
      createdAt: request.createdAt,
      file: request.file,
      note: request.note,
    })
    if (hasBackupErrors(errors)) {
      throw new ValidationError(
        Object.fromEntries(Object.entries(errors).map(([field, message]) => [field, message ? [message] : []])),
      )
    }
    return gateway.register(request)
  },

  verify: (backupId: string) => gateway.verify(backupId),
  remove: (backupId: string) => gateway.remove(backupId),
  download: (backupId: string) => gateway.download(backupId),
}
