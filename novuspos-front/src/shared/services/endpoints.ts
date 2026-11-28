/** Contrato de rutas de la API. Un solo lugar para cambiarlos. */
export const AUTH_ENDPOINTS = {
  login: '/auth/login',
  register: '/auth/register',
  me: '/auth/me',
  logout: '/auth/logout',
  forgotPassword: '/auth/forgot-password',
  resetPassword: '/auth/reset-password',
  profile: '/auth/profile',
  sendEmailVerification: '/auth/email/verification-notification',
} as const

/** Contrato de rutas de facturación y suscripciones. */
export const BILLING_ENDPOINTS = {
  /** Catálogo público de suscripciones que ve el cliente. */
  plans: '/billing/plans',
  subscription: '/billing/subscription',
  payments: '/billing/payments',
  /** Cuentas y métodos que ve el usuario al pagar; el dueño los administra en `/admin/payment-methods`. */
  paymentMethods: '/billing/payment-methods',
} as const

/** Contrato de rutas del panel general. */
export const PANEL_ENDPOINTS = {
  overview: '/panel/overview',
  notifications: (params: {
    page: number
    pageSize: number
    search?: string
    type?: string
    status?: string
  }) => {
    const query = new URLSearchParams({ page: String(params.page), pageSize: String(params.pageSize) })
    if (params.search?.trim()) query.set('search', params.search.trim())
    if (params.type && params.type !== 'all') query.set('type', params.type)
    if (params.status && params.status !== 'all') query.set('status', params.status)
    return `/panel/notifications?${query.toString()}`
  },
  unreadNotificationCount: '/panel/notifications/unread-count',
  markNotificationsRead: '/panel/notifications/mark-read',
} as const

/** Contrato de la landing pública que promociona NovusPOS Desktop. */
export const LANDING_ENDPOINTS = {
  config: '/landing/config',
  download: '/landing/download',
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
  /** GET paginado y filtrado; la revisión sigue en `reviewPayment`. */
  paymentHistory: (params: {
    page: number
    pageSize: number
    search?: string
    status?: string
  }) => {
    const query = new URLSearchParams({ page: String(params.page), pageSize: String(params.pageSize) })
    if (params.search?.trim()) query.set('search', params.search.trim())
    if (params.status && params.status !== 'all') query.set('status', params.status)
    return `/admin/payments?${query.toString()}`
  },
  createPayment: '/admin/payments',
  reviewPayment: (paymentId: string) => `/admin/payments/${paymentId}/review`,
  users: '/admin/users',
  /** GET paginado y filtrado del directorio; la edición sigue en `updateUser`. */
  userDirectory: (params: {
    page: number
    pageSize: number
    search?: string
    status?: string
  }) => {
    const query = new URLSearchParams({ page: String(params.page), pageSize: String(params.pageSize) })
    if (params.search?.trim()) query.set('search', params.search.trim())
    if (params.status && params.status !== 'all') query.set('status', params.status)
    return `/admin/users?${query.toString()}`
  },
  /** Lista ligera de comercios para los selectores de destinatarios. */
  userOptions: (params?: { withoutActiveSubscription?: boolean }) => {
    const query = new URLSearchParams()
    if (params?.withoutActiveSubscription) query.set('withoutActiveSubscription', '1')
    const qs = query.toString()
    return `/admin/users/options${qs ? `?${qs}` : ''}`
  },
  createUser: '/admin/users',
  updateUser: (userId: string) => `/admin/users/${userId}`,
  setSubscription: (userId: string) => `/admin/users/${userId}/subscription`,
  /** GET paginado y filtrado del historial de reportes. */
  reportHistory: (params: {
    page: number
    pageSize: number
    search?: string
    source?: string
    status?: string
  }) => {
    const query = new URLSearchParams({ page: String(params.page), pageSize: String(params.pageSize) })
    if (params.search?.trim()) query.set('search', params.search.trim())
    if (params.source && params.source !== 'all') query.set('source', params.source)
    if (params.status && params.status !== 'all') query.set('status', params.status)
    return `/admin/reports?${query.toString()}`
  },
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
  /** GET paginado y filtrado; POST sigue en `emails`. */
  emailHistory: (params: {
    page: number
    pageSize: number
    search?: string
    audience?: string
  }) => {
    const query = new URLSearchParams({ page: String(params.page), pageSize: String(params.pageSize) })
    if (params.search?.trim()) query.set('search', params.search.trim())
    if (params.audience) query.set('audience', params.audience)
    return `/admin/emails?${query.toString()}`
  },
  settings: '/admin/settings',
  /** GET/PUT de la landing que el dueño personaliza en el constructor visual. */
  landing: '/admin/landing',
  landingDownload: '/admin/landing/download',
  /** GET/PUT del catálogo de suscripciones que ofrece NovusPOS Desktop. */
  plans: '/admin/plans',
  /** PUT reemplaza el catálogo completo de métodos y cuentas de cobro. */
  paymentMethods: '/admin/payment-methods',
  /** Perfil del super administrador. */
  profile: '/admin/profile',
  password: '/admin/profile/password',
} as const
