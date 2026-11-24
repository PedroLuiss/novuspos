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
