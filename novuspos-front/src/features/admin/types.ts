/** Tipos públicos del panel del super administrador. */

export type AdminSubscriptionStatus = 'active' | 'pending' | 'expired' | 'cancelled'
export type AdminPaymentStatus = 'pending' | 'approved' | 'rejected'
export type AdminReportStatus = 'open' | 'resolved'
export type AdminNoticeType = 'info' | 'success' | 'warning'
export type AdminNoticeTypeFilter = AdminNoticeType | 'all'
export type NotificationPageSize = 20 | 50 | 100

/** Filtros del historial. `audience: ''` = todos; `'all'` = avisos globales; cualquier otro id = ese comercio. */
export interface NotificationQuery {
  page: number
  pageSize: NotificationPageSize
  search: string
  type: AdminNoticeTypeFilter
  audience: string
}

/** Respuesta paginada: Laravel debe filtrar y cortar en servidor, no enviar miles de filas. */
export interface NotificationPage {
  items: AdminNotification[]
  total: number
  page: number
  pageSize: NotificationPageSize
}

export type EmailPageSize = 20 | 50 | 100

/** Filtros del historial de correos. `audience: ''` = todos; `'all'` = correos globales; cualquier otro id = ese comercio. */
export interface EmailQuery {
  page: number
  pageSize: EmailPageSize
  search: string
  audience: string
}

export interface EmailPage {
  items: AdminEmail[]
  total: number
  page: number
  pageSize: EmailPageSize
}

export interface AdminUser {
  id: string
  name: string
  email: string
  businessName: string
  businessType: string
  planId: string
  planName: string
  subscriptionStatus: AdminSubscriptionStatus
  joinedAt: string
  lastPaymentAt: string | null
  openReports: number
}

export type UserStatusFilter = AdminSubscriptionStatus | 'all'
export type UserPageSize = 20 | 50 | 100

/** Filtros del directorio. `status: 'all'` = todos; cualquier otro = ese estado. */
export interface UserQuery {
  page: number
  pageSize: UserPageSize
  search: string
  status: UserStatusFilter
}

/** Conteos globales para las tarjetas, sin importar filtros ni página. */
export interface UserSummary {
  active: number
  pending: number
  inactive: number
  total: number
}

export interface UserPage {
  items: AdminUser[]
  total: number
  page: number
  pageSize: UserPageSize
  summary: UserSummary
}

/** Lista ligera para los selectores de destinatarios de avisos y correos. */
export type UserOption = Pick<AdminUser, 'id' | 'businessName'>

export interface AdminPayment {
  id: string
  userId: string
  userName: string
  planId: string
  planName: string
  /** Clave del catálogo de cobro configurado por el dueño. */
  method: string
  reference: string
  bank: string
  paidAt: string
  amount: number
  currency: string
  status: AdminPaymentStatus
  proofUrl: string
  reviewNote?: string
  createdAt: string
}

export type PaymentStatusFilter = AdminPaymentStatus | 'all'
export type PaymentPageSize = 20 | 50 | 100

/** Filtros del historial de pagos. `status: 'all'` = todos; cualquier otro = ese estado. */
export interface PaymentQuery {
  page: number
  pageSize: PaymentPageSize
  search: string
  status: PaymentStatusFilter
}

/** Conteos globales, sin importar filtros ni página. Alimentan las tarjetas del resumen. */
export interface PaymentSummary {
  pending: number
  approved: number
  rejected: number
  total: number
}

export interface PaymentPage {
  items: AdminPayment[]
  total: number
  page: number
  pageSize: PaymentPageSize
  summary: PaymentSummary
}

export interface AdminReport {
  id: string
  userId: string
  userName: string
  subject: string
  description: string
  source: 'web' | 'desktop'
  status: AdminReportStatus
  createdAt: string
}

export type ReportSourceFilter = AdminReport['source'] | 'all'
export type ReportStatusFilter = AdminReportStatus | 'all'
export type ReportPageSize = 20 | 50 | 100

/** Filtros del historial. `all` en origen o estado = sin filtro. */
export interface ReportQuery {
  page: number
  pageSize: ReportPageSize
  search: string
  source: ReportSourceFilter
  status: ReportStatusFilter
}

/** Conteos globales para las tarjetas, sin importar filtros ni página. */
export interface ReportSummary {
  total: number
  open: number
  resolved: number
  web: number
  desktop: number
}

export interface ReportPage {
  items: AdminReport[]
  total: number
  page: number
  pageSize: ReportPageSize
  summary: ReportSummary
}

export interface AdminNotification {
  id: string
  title: string
  description: string
  link: string
  icon: string
  type: AdminNoticeType
  audience: 'all' | string
  audienceLabel: string
  createdAt: string
}

export interface AdminEmail {
  id: string
  subject: string
  /** HTML saneado, listo para enviar por correo. */
  body: string
  /** Texto plano derivado; opcional para registros antiguos del modo demo. */
  bodyText?: string
  audience: 'all' | string
  audienceLabel: string
  createdAt: string
}

export interface EmailDraft {
  subject: string
  html: string
  audience: string
}

export interface AdminSettings {
  companyName: string
  contactEmail: string
  phone: string
  address: string
  loginPath: string
}

export interface AdminOverview {
  totalUsers: number
  unpaidUsers: number
  pendingPayments: number
  approvedPayments: number
  revenueUsd: number
  openReports: number
  planSales: { planName: string; count: number }[]
  recentPayments: AdminPayment[]
}

export interface AdminSession {
  email: string
  name: string
  token: string
}

export interface UserPatch {
  name?: string
  email?: string
  businessName?: string
  businessType?: string
}
