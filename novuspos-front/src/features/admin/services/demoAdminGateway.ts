import { ValidationError } from '@/shared/services/apiClient'
import {
  demoEmails,
  demoNotifications,
  demoPayments,
  demoReports,
  demoSettings,
  demoUsers,
} from '../data/admin-data'
import type {
  AdminEmail,
  AdminNotification,
  AdminOverview,
  AdminPayment,
  AdminReport,
  AdminSettings,
  AdminUser,
  EmailPage,
  EmailQuery,
  NotificationPage,
  NotificationQuery,
  UserPatch,
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

  async listPayments(): Promise<AdminPayment[]> {
    await wait()
    return [...payments()].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
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

  async listUsers(): Promise<AdminUser[]> {
    await wait()
    return users()
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

  async listReports(): Promise<AdminReport[]> {
    await wait()
    return [...read('reports', demoReports)].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
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
      .filter((item) => !needle || [item.subject, item.body, item.audienceLabel].join(' ').toLowerCase().includes(needle))
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
}
