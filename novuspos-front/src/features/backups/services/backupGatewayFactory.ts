import { AUTH_BACKEND } from '@/shared/lib/env'
import { demoBackupGateway } from './demoBackupGateway'
import { httpBackupGateway } from './httpBackupGateway'
import type { BackupGateway } from './backupGateway'

/** VITE_AUTH_MODE elige demo o API para todo el panel, incluidos los respaldos. */
export function resolveBackupGateway(): BackupGateway {
  return AUTH_BACKEND === 'demo' ? demoBackupGateway : httpBackupGateway
}
