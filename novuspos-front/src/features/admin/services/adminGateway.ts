import type {
  AdminEmail,
  AdminNotification,
  AdminOverview,
  AdminPayment,
  AdminReport,
  AdminSession,
  AdminSettings,
  AdminUser,
  UserPatch,
} from '../types'

/** Contrato único del super panel: demo y API cumplen la misma interfaz. */
export interface AdminGateway {
  login(email: string, password: string): Promise<AdminSession>
  getOverview(): Promise<AdminOverview>
  listPayments(): Promise<AdminPayment[]>
  reviewPayment(paymentId: string, approved: boolean, note?: string): Promise<AdminPayment>
  listUsers(): Promise<AdminUser[]>
  updateUser(userId: string, patch: UserPatch): Promise<AdminUser>
  setSubscription(userId: string, planId: string, active: boolean): Promise<AdminUser>
  listReports(): Promise<AdminReport[]>
  listNotifications(): Promise<AdminNotification[]>
  createNotification(input: Omit<AdminNotification, 'id' | 'createdAt'>): Promise<AdminNotification>
  listEmails(): Promise<AdminEmail[]>
  createEmail(input: Omit<AdminEmail, 'id' | 'createdAt'>): Promise<AdminEmail>
  getSettings(): Promise<AdminSettings>
  saveSettings(settings: AdminSettings): Promise<AdminSettings>
}
