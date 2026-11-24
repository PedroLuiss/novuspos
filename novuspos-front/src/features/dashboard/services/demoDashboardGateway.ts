import { createDemoSummary, demoActivationKey, readDemoBackupDate } from '../data/dashboard-data'
import { isOverdue } from '../lib/dashboardFormatters'
import type { DashboardSummary, DashboardSubscriptionStatus } from '../types'
import type { DashboardGateway } from './dashboardGateway'

const BILLING_KEY = 'novuspos:demo-billing'
const DEMO_DELAY_MS = 220

interface DemoBillingLite {
  subscription?: {
    id?: string
    status?: string
    planId?: string
    startedAt?: string
    renewsAt?: string
  }
}

function readBilling(): DemoBillingLite {
  try {
    const raw = window.localStorage.getItem(BILLING_KEY)
    if (raw) return JSON.parse(raw) as DemoBillingLite
  } catch {
    // Se usa el resumen de ejemplo.
  }
  return {}
}

function statusOf(status: string | undefined, renewsAt: string | undefined): DashboardSubscriptionStatus {
  if (status === 'pending_review') return 'pending_review'
  if (status === 'cancelled') return 'cancelled'
  if (status === 'expired' || status === 'inactive' || status === 'unpaid') return 'inactive'
  if (status === 'active' && renewsAt && isOverdue(renewsAt)) return 'inactive'
  return 'active'
}

function wait(): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, DEMO_DELAY_MS))
}

/** Adaptador demo: mismo contrato que la API, sin red. */
export const demoDashboardGateway: DashboardGateway = {
  async getOverview(): Promise<DashboardSummary> {
    await wait()
    const fallback = createDemoSummary()
    const { subscription } = readBilling()
    if (!subscription) return fallback

    const dueAt = subscription.renewsAt ?? fallback.dueAt
    const seed = `${subscription.id ?? 'demo'}-${subscription.startedAt ?? 'inicial'}`
    return {
      organizationName: fallback.organizationName,
      planName: subscription.planId === 'novus-mensual' ? 'NovusPOS Mensual' : fallback.planName,
      subscriptionStatus: statusOf(subscription.status, dueAt),
      dueAt,
      activationKey: demoActivationKey(seed),
      activationKeyRenewsAt: dueAt,
      lastBackupAt: readDemoBackupDate(),
    }
  },
}
