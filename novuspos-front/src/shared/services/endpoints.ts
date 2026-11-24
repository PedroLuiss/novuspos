/** Contrato de rutas de la API. Un solo lugar para cambiarlos. */
export const AUTH_ENDPOINTS = {
  login: '/auth/login',
  register: '/auth/register',
  me: '/auth/me',
  logout: '/auth/logout',
  forgotPassword: '/auth/forgot-password',
  resetPassword: '/auth/reset-password',
} as const

/** Contrato de rutas de facturación y suscripciones. */
export const BILLING_ENDPOINTS = {
  plans: '/billing/plans',
  subscription: '/billing/subscription',
  payments: '/billing/payments',
  reviewPayment: (paymentId: string) => `/billing/payments/${paymentId}/review`,
} as const

/** Contrato de rutas del registro de copias de seguridad. */
export const BACKUP_ENDPOINTS = {
  list: '/backups',
  create: '/backups',
  verify: (backupId: string) => `/backups/${backupId}/verify`,
  download: (backupId: string) => `/backups/${backupId}/download`,
  remove: (backupId: string) => `/backups/${backupId}`,
} as const
