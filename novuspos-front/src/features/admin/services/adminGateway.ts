import type { PlanOption } from '@/shared/services/plans/types'
import type { PaymentMethodOption } from '@/shared/services/payment-methods/types'
import type {
  AdminEmail,
  AdminNotification,
  AdminOverview,
  EmailPage,
  EmailQuery,
  NotificationPage,
  NotificationQuery,
  AdminPayment,
  PaymentPage,
  PaymentQuery,
  ReportPage,
  ReportQuery,
  AdminSession,
  AdminSettings,
  AdminUser,
  UserOption,
  UserPage,
  UserPatch,
  UserQuery,
} from '../types'

/** Contrato único del super panel: demo y API cumplen la misma interfaz. */
export interface AdminGateway {
  login(email: string, password: string): Promise<AdminSession>
  getOverview(): Promise<AdminOverview>
  listPayments(query: PaymentQuery): Promise<PaymentPage>
  reviewPayment(paymentId: string, approved: boolean, note?: string): Promise<AdminPayment>
  listUsers(query: UserQuery): Promise<UserPage>
  listUserOptions(): Promise<UserOption[]>
  updateUser(userId: string, patch: UserPatch): Promise<AdminUser>
  setSubscription(userId: string, planId: string, active: boolean): Promise<AdminUser>
  listReports(query: ReportQuery): Promise<ReportPage>
  listNotifications(query: NotificationQuery): Promise<NotificationPage>
  createNotification(input: Omit<AdminNotification, 'id' | 'createdAt'>): Promise<AdminNotification>
  listEmails(query: EmailQuery): Promise<EmailPage>
  createEmail(input: Omit<AdminEmail, 'id' | 'createdAt'>): Promise<AdminEmail>
  getSettings(): Promise<AdminSettings>
  saveSettings(settings: AdminSettings): Promise<AdminSettings>
  /** Catálogo completo de suscripciones, incluidas las ocultas. */
  listPlans(): Promise<PlanOption[]>
  savePlans(plans: PlanOption[]): Promise<PlanOption[]>
  /** Reemplaza el catálogo completo de cuentas y métodos que ve el usuario al pagar. */
  savePaymentMethods(methods: PaymentMethodOption[]): Promise<PaymentMethodOption[]>
}
