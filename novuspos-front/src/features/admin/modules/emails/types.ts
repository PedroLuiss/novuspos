import type { AdminEmail } from '@/features/admin/core/types'

export type {
  AdminEmail,
  EmailDraft,
  EmailPage,
  EmailPageSize,
  EmailQuery,
  UserOption,
} from '@/features/admin/core/types'

/** Correo listo para publicar: aún sin id ni fecha de creación. */
export type EmailInput = Omit<AdminEmail, 'id' | 'createdAt'>
