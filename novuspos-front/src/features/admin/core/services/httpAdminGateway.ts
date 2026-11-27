import { apiClient } from '@/shared/services/apiClient'
import { ADMIN_ENDPOINTS, LANDING_ENDPOINTS } from '@/shared/services/endpoints'
import { normalizeLandingConfig } from '@/shared/services/landing/landingStore'
import type { LandingConfig } from '@/shared/services/landing/types'
import type { PaymentMethodOption } from '@/shared/services/payment-methods/types'
import { normalizePlans } from '@/shared/services/plans/plansStore'
import type { PlanOption } from '@/shared/services/plans/types'
import { adminSessionStore } from '@/features/admin/core/lib/adminSession'
import type {
  AdminEmail,
  AdminNotification,
  AdminOverview,
  AdminPayment,
  AdminProfile,
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
  createPayment: (payload) => apiClient.post<AdminPayment>(ADMIN_ENDPOINTS.createPayment, payload, { headers: authHeaders() }),
  reviewPayment: (paymentId, approved, note) =>
    apiClient.patch<AdminPayment>(ADMIN_ENDPOINTS.reviewPayment(paymentId), { approved, note }, { headers: authHeaders() }),
  listUsers: (query: UserQuery) => apiClient.get<UserPage>(ADMIN_ENDPOINTS.userDirectory(query), { headers: authHeaders() }),
  listUserOptions: (params) => apiClient.get<UserOption[]>(ADMIN_ENDPOINTS.userOptions(params), { headers: authHeaders() }),
  createUser: (payload) => apiClient.post<AdminUser>(ADMIN_ENDPOINTS.createUser, payload, { headers: authHeaders() }),
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
  async getLanding(): Promise<LandingConfig> {
    const payload = await apiClient.get<unknown>(ADMIN_ENDPOINTS.landing, { headers: authHeaders() })
    const data = payload && typeof payload === 'object' && !Array.isArray(payload)
      ? (payload as Record<string, unknown>).config ?? payload
      : payload
    return normalizeLandingConfig(data)
  },
  saveLanding: (config) => apiClient.put<LandingConfig>(ADMIN_ENDPOINTS.landing, { config }, { headers: authHeaders() }),
  async uploadLandingDownload(file, version, onProgress) {
    const form = new FormData()
    form.append('file', file)
    if (version?.trim()) form.append('version', version.trim())
    const payload = await apiClient.post<{ download: LandingConfig['download'] }>(ADMIN_ENDPOINTS.landingDownload, form, {
      headers: authHeaders(),
      onUploadProgress: onProgress,
    })
    if (!payload.download) throw new Error('No se recibió el instalador.')
    return payload.download
  },
  downloadLandingInstaller: () => apiClient.getBlob(LANDING_ENDPOINTS.download, { headers: authHeaders() }),
  async deleteLandingDownload() {
    await apiClient.delete(ADMIN_ENDPOINTS.landingDownload, { headers: authHeaders() })
  },
  async listPlans(): Promise<PlanOption[]> {
    const payload = await apiClient.get<unknown>(ADMIN_ENDPOINTS.plans, { headers: authHeaders() })
    const list = Array.isArray(payload)
      ? payload
      : payload && typeof payload === 'object'
        ? (payload as Record<string, unknown>).plans ?? (payload as Record<string, unknown>).items ?? []
        : []
    return normalizePlans(list) ?? []
  },
  savePlans: (plans) => apiClient.put<PlanOption[]>(ADMIN_ENDPOINTS.plans, { plans }, { headers: authHeaders() }),
  savePaymentMethods: (methods) =>
    apiClient.put<PaymentMethodOption[]>(ADMIN_ENDPOINTS.paymentMethods, { methods }, { headers: authHeaders() }),
  getProfile: () => apiClient.get<AdminProfile>(ADMIN_ENDPOINTS.profile, { headers: authHeaders() }),
  updateProfile: (profile) => apiClient.put<AdminProfile>(ADMIN_ENDPOINTS.profile, profile, { headers: authHeaders() }),
  updatePassword: (payload) =>
    apiClient.put<{ message: string }>(ADMIN_ENDPOINTS.password, payload, { headers: authHeaders() }),
}
