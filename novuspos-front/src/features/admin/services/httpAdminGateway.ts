import { apiClient } from '@/shared/services/apiClient'
import { ADMIN_ENDPOINTS } from '@/shared/services/endpoints'
import type { PaymentMethodOption } from '@/shared/services/payment-methods/types'
import { adminSessionStore } from '../lib/adminSession'
import type {
  AdminEmail,
  AdminNotification,
  AdminOverview,
  AdminPayment,
  ReportPage,
  ReportQuery,
  AdminSession,
  AdminSettings,
  AdminUser,
  EmailPage,
  UserOption,
  UserPage,
  UserQuery,
  EmailQuery,
  NotificationPage,
  NotificationQuery,
  PaymentPage,
  PaymentQuery,
  UserPatch,
} from '../types'
import type { AdminGateway } from './adminGateway'

/** El panel maestro usa su propio token, no la sesión del cliente. */
function authHeaders(): Record<string, string> {
  const token = adminSessionStore.read()?.token
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export const httpAdminGateway: AdminGateway = {
  async login(email, password) {
    return apiClient.post<AdminSession>(ADMIN_ENDPOINTS.login, { email, password }, { auth: false })
  },

  getOverview: () => apiClient.get<AdminOverview>(ADMIN_ENDPOINTS.overview, { headers: authHeaders() }),
  listPayments: (query: PaymentQuery) => apiClient.get<PaymentPage>(ADMIN_ENDPOINTS.paymentHistory(query), { headers: authHeaders() }),
  reviewPayment: (paymentId, approved, note) =>
    apiClient.patch<AdminPayment>(ADMIN_ENDPOINTS.reviewPayment(paymentId), { approved, note }, { headers: authHeaders() }),
  listUsers: (query: UserQuery) => apiClient.get<UserPage>(ADMIN_ENDPOINTS.userDirectory(query), { headers: authHeaders() }),
  listUserOptions: () => apiClient.get<UserOption[]>(ADMIN_ENDPOINTS.userOptions, { headers: authHeaders() }),
  updateUser: (userId, patch: UserPatch) =>
    apiClient.patch<AdminUser>(ADMIN_ENDPOINTS.updateUser(userId), patch, { headers: authHeaders() }),
  setSubscription: (userId, planId, active) =>
    apiClient.patch<AdminUser>(ADMIN_ENDPOINTS.setSubscription(userId), { planId, active }, { headers: authHeaders() }),
  listReports: (query: ReportQuery) => apiClient.get<ReportPage>(ADMIN_ENDPOINTS.reportHistory(query), { headers: authHeaders() }),
  listNotifications: (query: NotificationQuery) =>
    apiClient.get<NotificationPage>(ADMIN_ENDPOINTS.notificationHistory(query), { headers: authHeaders() }),

  createNotification: (input) =>
    apiClient.post<AdminNotification>(ADMIN_ENDPOINTS.notifications, input, { headers: authHeaders() }),
  listEmails: (query: EmailQuery) =>
    apiClient.get<EmailPage>(ADMIN_ENDPOINTS.emailHistory(query), { headers: authHeaders() }),
  createEmail: (input) => apiClient.post<AdminEmail>(ADMIN_ENDPOINTS.emails, input, { headers: authHeaders() }),
  getSettings: () => apiClient.get<AdminSettings>(ADMIN_ENDPOINTS.settings, { headers: authHeaders() }),
  saveSettings: (settings) => apiClient.put<AdminSettings>(ADMIN_ENDPOINTS.settings, settings, { headers: authHeaders() }),
  savePaymentMethods: (methods) =>
    apiClient.put<PaymentMethodOption[]>(ADMIN_ENDPOINTS.paymentMethods, { methods }, { headers: authHeaders() }),
}
