/** Tipos públicos del panel del super administrador. */

export type AdminSubscriptionStatus = 'active' | 'pending' | 'expired' | 'cancelled'
export type AdminPaymentStatus = 'pending' | 'approved' | 'rejected'
export type AdminReportStatus = 'open' | 'resolved'
export type AdminNoticeType = 'info' | 'success' | 'warning'

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

export interface AdminPayment {
  id: string
  userId: string
  userName: string
  planId: string
  planName: string
  method: 'mobile' | 'transfer'
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
  body: string
  audience: 'all' | string
  audienceLabel: string
  createdAt: string
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
