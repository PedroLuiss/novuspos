import type { BackupFieldErrors, BackupKind } from '../types'

const MAX_FILE_BYTES = 500 * 1024 * 1024

export interface BackupFormValues {
  device: string
  kind: BackupKind | null
  createdAt: string
  file: File | null
  note?: string
}

export function validateBackupForm(values: BackupFormValues): BackupFieldErrors {
  const errors: BackupFieldErrors = {}

  if (!values.device.trim()) errors.device = 'Escribe el nombre del equipo.'
  else if (values.device.trim().length < 2) errors.device = 'El nombre del equipo es demasiado corto.'

  if (!values.kind) errors.kind = 'Elige el tipo de copia.'

  if (!values.createdAt) {
    errors.createdAt = 'Indica cuándo se hizo la copia.'
  } else {
    const date = new Date(values.createdAt)
    if (Number.isNaN(date.getTime())) errors.createdAt = 'La fecha no es válida.'
    else if (date.getTime() > Date.now() + 60_000) errors.createdAt = 'La fecha no puede ser futura.'
  }

  if (!values.file) errors.file = 'Selecciona el archivo de la copia.'
  else if (values.file.size === 0) errors.file = 'El archivo está vacío.'
  else if (values.file.size > MAX_FILE_BYTES) errors.file = 'El archivo es demasiado grande.'

  if ((values.note?.length ?? 0) > 200) errors.note = 'La nota es demasiado larga.'

  return errors
}

export function hasBackupErrors(errors: BackupFieldErrors): boolean {
  return Object.values(errors).some(Boolean)
}
