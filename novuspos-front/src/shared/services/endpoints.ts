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

/** Contrato de rutas del panel general. */
export const PANEL_ENDPOINTS = {
  overview: '/panel/overview',
} as const

/**
 * Contrato de rutas de copias de seguridad.
 * Solo se guarda la copia más reciente: `POST` reemplaza a la anterior.
 * El multipart es compatible con lo que envía NovusPOS Desktop.
 */
export const BACKUP_ENDPOINTS = {
  latest: '/backups/latest',
  upload: '/backups',
} as const

/** Contrato de rutas del centro de soporte. */
export const SUPPORT_ENDPOINTS = {
  submit: '/support/tickets',
} as const

/** Contrato de la tasa de cambio del día (BCV). */
export const EXCHANGE_RATE_ENDPOINTS = {
  today: '/billing/exchange-rate',
} as const

/** Contrato del panel del super administrador (dueño de NovusPOS). */
export const ADMIN_ENDPOINTS = {
  login: '/admin/login',
  overview: '/admin/overview',
  payments: '/admin/payments',
  reviewPayment: (paymentId: string) => `/admin/payments/${paymentId}/review`,
  users: '/admin/users',
  updateUser: (userId: string) => `/admin/users/${userId}`,
  setSubscription: (userId: string) => `/admin/users/${userId}/subscription`,
  reports: '/admin/reports',
  notifications: '/admin/notifications',
  /** GET paginado y filtrado; POST sigue en `notifications`. */
  notificationHistory: (params: {
    page: number
    pageSize: number
    search?: string
    type?: string
    audience?: string
  }) => {
    const query = new URLSearchParams({ page: String(params.page), pageSize: String(params.pageSize) })
    if (params.search?.trim()) query.set('search', params.search.trim())
    if (params.type && params.type !== 'all') query.set('type', params.type)
    if (params.audience) query.set('audience', params.audience)
    return `/admin/notifications?${query.toString()}`
  },
  emails: '/admin/emails',
  settings: '/admin/settings',
} as const
