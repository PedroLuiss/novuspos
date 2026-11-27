import { ValidationError } from '@/shared/services/apiClient'
import { landingStore } from '@/shared/services/landing/landingStore'
import type { LandingConfig } from '@/shared/services/landing/types'
import { paymentMethodsStore } from '@/shared/services/payment-methods/paymentMethodsStore'
import type { PaymentMethodOption } from '@/shared/services/payment-methods/types'
import { plansStore } from '@/shared/services/plans/plansStore'
import type { PlanOption } from '@/shared/services/plans/types'
import { htmlToText } from '@/features/admin/modules/emails/lib/emailHtml'
import {
  demoEmails,
  demoNotifications,
  demoPayments,
  demoReports,
  demoSettings,
  demoUsers,
} from '../data/admin-data'
import type {
  AdminCreatePaymentPayload,
  AdminCreateUserPayload,
  AdminEmail,
  AdminNotification,
  AdminOverview,
  AdminPasswordPayload,
  AdminPayment,
  AdminProfile,
  AdminReport,
  AdminSettings,
  AdminUser,
  EmailPage,
  EmailQuery,
  NotificationPage,
  NotificationQuery,
  PaymentPage,
  PaymentQuery,
  PaymentSummary,
  ReportPage,
  ReportQuery,
  ReportSummary,
  UserOption,
  UserPage,
  UserPatch,
  UserQuery,
  UserSummary,
} from '../types'
import type { AdminGateway } from './adminGateway'

const PREFIX = 'novuspos:admin:'
const DEMO_DELAY_MS = 180

function read<T>(name: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(PREFIX + name)
    if (raw) return JSON.parse(raw) as T
  } catch {
    // Se usa el estado inicial.
  }
  return fallback
}

function write<T>(name: string, value: T): void {
  try {
    window.localStorage.setItem(PREFIX + name, JSON.stringify(value))
  } catch {
    // El modo demo sigue funcionando durante la sesión.
  }
}

function wait(): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, DEMO_DELAY_MS))
}

function users(): AdminUser[] {
  return read('users', demoUsers.map((item) => ({ ...item })))
}

function payments(): AdminPayment[] {
  return read('payments', demoPayments.map((item) => ({ ...item })))
}

function now(): string {
  return new Date().toISOString()
}

/** Conteos de todos los pagos, no de la página ni de los filtros activos. */
function paymentSummary(all: AdminPayment[]): PaymentSummary {
  return {
    pending: all.filter((item) => item.status === 'pending').length,
    approved: all.filter((item) => item.status === 'approved').length,
    rejected: all.filter((item) => item.status === 'rejected').length,
    total: all.length,
  }
}

/** Conteos globales de comercios para las tarjetas del directorio. */
function userSummary(all: AdminUser[]): UserSummary {
  return {
    active: all.filter((item) => item.subscriptionStatus === 'active').length,
    pending: all.filter((item) => item.subscriptionStatus === 'pending').length,
    inactive: all.filter((item) => ['expired', 'cancelled'].includes(item.subscriptionStatus)).length,
    total: all.length,
  }
}

/** Conteos globales de incidencias para las tarjetas del panel. */
function reportSummary(all: AdminReport[]): ReportSummary {
  return {
    total: all.length,
    open: all.filter((item) => item.status === 'open').length,
    resolved: all.filter((item) => item.status === 'resolved').length,
    web: all.filter((item) => item.source === 'web').length,
    desktop: all.filter((item) => item.source === 'desktop').length,
  }
}

const PAGE_SIZES: Array<20 | 50 | 100> = [20, 50, 100]

export const demoAdminGateway: AdminGateway = {
  async login(email, password) {
    await wait()
    if (!email.includes('@') || password.length < 4) {
      throw new ValidationError({ password: ['Revisa el correo y la contraseña del dueño.'] })
    }
    return { email: email.trim(), name: 'Dueño de NovusPOS', token: `admin-demo-${Date.now()}` }
  },

  async getOverview(): Promise<AdminOverview> {
    await wait()
    const allUsers = users()
    const allPayments = payments()
    const approved = allPayments.filter((item) => item.status === 'approved')
    const planSales = allUsers.reduce<{ planName: string; count: number }[]>((list, user) => {
      const found = list.find((item) => item.planName === user.planName)
      if (found) found.count += 1
      else list.push({ planName: user.planName, count: 1 })
      return list
    }, [])
    return {
      totalUsers: allUsers.length,
      unpaidUsers: allUsers.filter((item) => item.subscriptionStatus === 'expired' || item.subscriptionStatus === 'cancelled').length,
      pendingPayments: allPayments.filter((item) => item.status === 'pending').length,
      approvedPayments: approved.length,
      revenueUsd: approved.reduce((sum, item) => sum + item.amount, 0),
      openReports: read('reports', demoReports).filter((item) => item.status === 'open').length,
      planSales,
      recentPayments: [...allPayments].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5),
    }
  },

  async listPayments(query: PaymentQuery): Promise<PaymentPage> {
    await wait()
    const all = payments()
    const needle = query.search.trim().toLowerCase()
    const filtered = all
      .filter((item) => query.status === 'all' || item.status === query.status)
      .filter((item) => !needle || [item.userName, item.reference, item.bank, item.planName].join(' ').toLowerCase().includes(needle))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt) || b.id.localeCompare(a.id))

    const pageSize = PAGE_SIZES.includes(query.pageSize) ? query.pageSize : 20
    const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
    const page = Math.min(Math.max(1, query.page), totalPages)
    return {
      items: filtered.slice((page - 1) * pageSize, page * pageSize),
      total: filtered.length,
      page,
      pageSize,
      summary: paymentSummary(all),
    }
  },

  async createPayment(payload: AdminCreatePaymentPayload): Promise<AdminPayment> {
    await wait()
    const allUsers = users()
    const user = allUsers.find((item) => item.id === payload.userId)
    if (!user) throw new Error('No encontramos ese usuario.')

    const planName = payload.planId === 'novus-anual' ? 'NovusPOS Anual' : 'NovusPOS Mensual'
    const payment: AdminPayment = {
      id: `p-${Date.now()}`,
      userId: payload.userId,
      userName: user.businessName || user.name,
      planId: payload.planId,
      planName,
      method: payload.method,
      reference: payload.reference,
      bank: payload.bank ?? '',
      paidAt: payload.paidAt,
      amount: payload.amount ?? 0,
      currency: payload.currency ?? 'USD',
      status: payload.status,
      proofUrl: payload.proofDataUrl ?? '',
      reviewNote: payload.note,
      createdAt: now(),
    }

    write('payments', [payment, ...payments()])

    if (payload.status === 'approved') {
      user.planId = payment.planId
      user.planName = payment.planName
      user.subscriptionStatus = 'active'
      user.lastPaymentAt = payment.paidAt
      write('users', allUsers)
    } else {
      user.planId = payment.planId
      user.planName = payment.planName
      user.subscriptionStatus = 'pending'
      write('users', allUsers)
    }

    return payment
  },

  async reviewPayment(paymentId, approved, note) {
    await wait()
    const all = payments()
    const payment = all.find((item) => item.id === paymentId)
    if (!payment) throw new Error('No encontramos ese pago.')
    payment.status = approved ? 'approved' : 'rejected'
    payment.reviewNote = note?.trim() || undefined
    write('payments', all)
    if (approved) {
      const allUsers = users()
      const user = allUsers.find((item) => item.id === payment.userId)
      if (user) {
        user.subscriptionStatus = 'active'
        user.planId = payment.planId
        user.planName = payment.planName
        user.lastPaymentAt = payment.paidAt
        write('users', allUsers)
      }
    }
    return { ...payment }
  },

  async listUsers(query: UserQuery): Promise<UserPage> {
    await wait()
    const all = users()
    const needle = query.search.trim().toLowerCase()
    const filtered = all
      .filter((item) => query.status === 'all' || item.subscriptionStatus === query.status)
      .filter((item) => !needle || [item.name, item.email, item.businessName, item.businessType].join(' ').toLowerCase().includes(needle))
      .sort((a, b) => b.joinedAt.localeCompare(a.joinedAt) || b.id.localeCompare(a.id))

    const pageSize = PAGE_SIZES.includes(query.pageSize) ? query.pageSize : 20
    const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
    const page = Math.min(Math.max(1, query.page), totalPages)
    return {
      items: filtered.slice((page - 1) * pageSize, page * pageSize),
      total: filtered.length,
      page,
      pageSize,
      summary: userSummary(all),
    }
  },

  async listUserOptions(): Promise<UserOption[]> {
    await wait()
    return users().map(({ id, businessName }) => ({ id, businessName }))
  },

  async createUser(payload: AdminCreateUserPayload): Promise<AdminUser> {
    await wait()
    const user: AdminUser = {
      id: `u-${Date.now()}`,
      name: payload.name,
      email: payload.email,
      businessName: payload.businessName,
      businessType: payload.businessType ?? '',
      planId: '',
      planName: 'Sin plan',
      subscriptionStatus: 'cancelled',
      joinedAt: now(),
      lastPaymentAt: null,
      openReports: 0,
    }
    write('users', [user, ...users()])
    return user
  },

  async updateUser(userId, patch: UserPatch): Promise<AdminUser> {
    await wait()
    const all = users()
    const user = all.find((item) => item.id === userId)
    if (!user) throw new Error('No encontramos ese usuario.')
    Object.assign(user, patch)
    write('users', all)
    return { ...user }
  },

  async setSubscription(userId, planId, active): Promise<AdminUser> {
    await wait()
    const all = users()
    const user = all.find((item) => item.id === userId)
    if (!user) throw new Error('No encontramos ese usuario.')
    user.planId = planId
    user.planName = planId === 'novus-anual' ? 'NovusPOS Anual' : 'NovusPOS Mensual'
    user.subscriptionStatus = active ? 'active' : 'cancelled'
    if (active) user.lastPaymentAt = now().slice(0, 10)
    write('users', all)
    return { ...user }
  },

  async listReports(query: ReportQuery): Promise<ReportPage> {
    await wait()
    const all = read('reports', demoReports)
    const needle = query.search.trim().toLowerCase()
    const filtered = all
      .filter((item) => query.source === 'all' || item.source === query.source)
      .filter((item) => query.status === 'all' || item.status === query.status)
      .filter((item) => !needle || [item.userName, item.subject, item.description].join(' ').toLowerCase().includes(needle))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt) || b.id.localeCompare(a.id))

    const pageSize = PAGE_SIZES.includes(query.pageSize) ? query.pageSize : 20
    const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
    const page = Math.min(Math.max(1, query.page), totalPages)
    return {
      items: filtered.slice((page - 1) * pageSize, page * pageSize),
      total: filtered.length,
      page,
      pageSize,
      summary: reportSummary(all),
    }
  },

  async listNotifications(query: NotificationQuery): Promise<NotificationPage> {
    await wait()
    const needle = query.search.trim().toLowerCase()
    const filtered = read('notifications', demoNotifications)
      .filter((item) => query.type === 'all' || item.type === query.type)
      .filter((item) => !query.audience || item.audience === query.audience)
      .filter((item) => !needle || [item.title, item.description, item.audienceLabel, item.link].join(' ').toLowerCase().includes(needle))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt) || b.id.localeCompare(a.id))

    const pageSize = PAGE_SIZES.includes(query.pageSize) ? query.pageSize : 20
    const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
    const page = Math.min(Math.max(1, query.page), totalPages)
    return {
      items: filtered.slice((page - 1) * pageSize, page * pageSize),
      total: filtered.length,
      page,
      pageSize,
    }
  },

  async createNotification(input): Promise<AdminNotification> {
    await wait()
    const notification: AdminNotification = { ...input, id: `n-${Date.now()}`, createdAt: now() }
    write('notifications', [notification, ...read('notifications', demoNotifications)])
    return notification
  },

  async listEmails(query: EmailQuery): Promise<EmailPage> {
    await wait()
    const needle = query.search.trim().toLowerCase()
    const filtered = read('emails', demoEmails)
      .filter((item) => !query.audience || item.audience === query.audience)
      .filter((item) => !needle || [item.subject, item.bodyText ?? htmlToText(item.body), item.audienceLabel].join(' ').toLowerCase().includes(needle))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt) || b.id.localeCompare(a.id))

    const pageSize = PAGE_SIZES.includes(query.pageSize) ? query.pageSize : 20
    const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
    const page = Math.min(Math.max(1, query.page), totalPages)
    return {
      items: filtered.slice((page - 1) * pageSize, page * pageSize),
      total: filtered.length,
      page,
      pageSize,
    }
  },

  async createEmail(input): Promise<AdminEmail> {
    await wait()
    const email: AdminEmail = { ...input, id: `e-${Date.now()}`, createdAt: now() }
    write('emails', [email, ...read('emails', demoEmails)])
    return email
  },

  async getSettings(): Promise<AdminSettings> {
    await wait()
    return read('settings', { ...demoSettings })
  },

  async saveSettings(settings): Promise<AdminSettings> {
    await wait()
    write('settings', settings)
    return settings
  },

  async getLanding(): Promise<LandingConfig> {
    await wait()
    return landingStore.read()
  },

  async saveLanding(config: LandingConfig): Promise<LandingConfig> {
    await wait()
    return landingStore.write(config)
  },

  async listPlans(): Promise<PlanOption[]> {
    await wait()
    return plansStore.read()
  },

  async savePlans(plans: PlanOption[]): Promise<PlanOption[]> {
    await wait()
    return plansStore.write(plans)
  },

  async savePaymentMethods(methods: PaymentMethodOption[]): Promise<PaymentMethodOption[]> {
    await wait()
    return paymentMethodsStore.write(methods)
  },

  async getProfile(): Promise<AdminProfile> {
    await wait()
    return read('profile', { name: 'Dueño de NovusPOS', email: 'admin@novuspos.com' })
  },

  async updateProfile(profile: AdminProfile): Promise<AdminProfile> {
    await wait()
    write('profile', profile)
    return profile
  },

  async updatePassword(_payload: AdminPasswordPayload): Promise<{ message: string }> {
    await wait()
    return { message: 'Contraseña actualizada correctamente.' }
  },
}
