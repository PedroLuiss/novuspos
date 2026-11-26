import type {
  AdminEmail,
  AdminNotification,
  AdminOverview,
  EmailPage,
  EmailQuery,
  NotificationPage,
  NotificationQuery,
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
  listNotifications(query: NotificationQuery): Promise<NotificationPage>
  createNotification(input: Omit<AdminNotification, 'id' | 'createdAt'>): Promise<AdminNotification>
  listEmails(query: EmailQuery): Promise<EmailPage>
  createEmail(input: Omit<AdminEmail, 'id' | 'createdAt'>): Promise<AdminEmail>
  getSettings(): Promise<AdminSettings>
  saveSettings(settings: AdminSettings): Promise<AdminSettings>
}
