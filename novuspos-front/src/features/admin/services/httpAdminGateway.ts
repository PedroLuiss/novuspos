import { apiClient } from '@/shared/services/apiClient'
import { ADMIN_ENDPOINTS } from '@/shared/services/endpoints'
import { adminSessionStore } from '../lib/adminSession'
import type {
  AdminEmail,
  AdminNotification,
  AdminOverview,
  AdminPayment,
  AdminReport,
  AdminSession,
  AdminSettings,
  AdminUser,
  NotificationPage,
  NotificationQuery,
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
  listPayments: () => apiClient.get<AdminPayment[]>(ADMIN_ENDPOINTS.payments, { headers: authHeaders() }),
  reviewPayment: (paymentId, approved, note) =>
    apiClient.patch<AdminPayment>(ADMIN_ENDPOINTS.reviewPayment(paymentId), { approved, note }, { headers: authHeaders() }),
  listUsers: () => apiClient.get<AdminUser[]>(ADMIN_ENDPOINTS.users, { headers: authHeaders() }),
  updateUser: (userId, patch: UserPatch) =>
    apiClient.patch<AdminUser>(ADMIN_ENDPOINTS.updateUser(userId), patch, { headers: authHeaders() }),
  setSubscription: (userId, planId, active) =>
    apiClient.patch<AdminUser>(ADMIN_ENDPOINTS.setSubscription(userId), { planId, active }, { headers: authHeaders() }),
  listReports: () => apiClient.get<AdminReport[]>(ADMIN_ENDPOINTS.reports, { headers: authHeaders() }),
  listNotifications: (query: NotificationQuery) =>
    apiClient.get<NotificationPage>(ADMIN_ENDPOINTS.notificationHistory(query), { headers: authHeaders() }),

  createNotification: (input) =>
    apiClient.post<AdminNotification>(ADMIN_ENDPOINTS.notifications, input, { headers: authHeaders() }),
  listEmails: () => apiClient.get<AdminEmail[]>(ADMIN_ENDPOINTS.emails, { headers: authHeaders() }),
  createEmail: (input) => apiClient.post<AdminEmail>(ADMIN_ENDPOINTS.emails, input, { headers: authHeaders() }),
  getSettings: () => apiClient.get<AdminSettings>(ADMIN_ENDPOINTS.settings, { headers: authHeaders() }),
  saveSettings: (settings) => apiClient.put<AdminSettings>(ADMIN_ENDPOINTS.settings, settings, { headers: authHeaders() }),
}
