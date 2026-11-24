import { apiClient } from '@/shared/services/apiClient'
import { PANEL_ENDPOINTS } from '@/shared/services/endpoints'
import type { DashboardSubscriptionStatus, DashboardSummary } from '../types'
import type { DashboardGateway } from './dashboardGateway'

type Raw = Record<string, unknown>

function isRecord(value: unknown): value is Raw {
  return typeof value === 'object' && value !== null
}

function text(value: unknown, fallback = ''): string {
  return typeof value === 'string' && value.trim() ? value : fallback
}

function firstText(source: Raw, keys: string[], fallback = ''): string {
  for (const key of keys) {
    const value = source[key]
    if (typeof value === 'string' && value.trim()) return value
  }
  return fallback
}

function statusOf(value: unknown): DashboardSubscriptionStatus {
  const status = typeof value === 'string' ? value : ''
  if (status === 'pending_review') return 'pending_review'
  if (status === 'cancelled') return 'cancelled'
  if (status === 'expired' || status === 'inactive' || status === 'unpaid') return 'inactive'
  return 'active'
}

/** Acepta los nombres de campo más habituales mientras se publica la API. */
function normalize(payload: unknown): DashboardSummary {
  const raw = isRecord(payload) ? payload : {}
  const plan = isRecord(raw.plan) ? raw.plan : {}
  const lastBackup = isRecord(raw.lastBackup) ? raw.lastBackup : {}
  const dueAt = firstText(raw, ['dueAt', 'renewsAt', 'currentPeriodEnd', 'nextPaymentAt'])
  return {
    organizationName: firstText(raw, ['organizationName', 'organization', 'companyName'], 'tu negocio'),
    planName: firstText(raw, ['planName'], text(plan.name, 'NovusPOS Mensual')),
    subscriptionStatus: statusOf(raw.subscriptionStatus ?? raw.status),
    dueAt,
    activationKey: firstText(raw, ['activationKey', 'licenseKey', 'key']),
    activationKeyRenewsAt: firstText(raw, ['activationKeyRenewsAt', 'keyRenewsAt'], dueAt),
    lastBackupAt:
      firstText(raw, ['lastBackupAt', 'lastBackupDate']) || firstText(lastBackup, ['createdAt']) || null,
  }
}

/** Adaptador real: consume el endpoint del panel cuando la API esté lista. */
export const httpDashboardGateway: DashboardGateway = {
  async getOverview(): Promise<DashboardSummary> {
    return normalize(await apiClient.get<unknown>(PANEL_ENDPOINTS.overview))
  },
}
