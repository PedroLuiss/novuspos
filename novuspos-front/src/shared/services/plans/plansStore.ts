/** Catálogo compartido de suscripciones: el dueño lo escribe y el portal lo lee. */
import type { PlanOption } from './types'

const KEY = 'novuspos:plans'

export const DEFAULT_PLANS: PlanOption[] = [
  {
    id: 'novus-mensual',
    name: 'NovusPOS Mensual',
    description: 'Todo el sistema para un comercio, en una computadora.',
    price: 4.99,
    currency: 'USD',
    interval: 'month',
    highlighted: true,
    active: true,
    features: [
      'Ventas, inventario y caja en el mismo equipo',
      'Clientes y cuentas corrientes',
      'Respaldos de tu información',
      'Actualizaciones y soporte',
    ],
  },
  {
    id: 'novus-anual',
    name: 'NovusPOS Anual',
    description: 'El mismo sistema, pagando una sola vez al año.',
    price: 59.99,
    currency: 'USD',
    interval: 'year',
    active: true,
    features: [
      'Ventas, inventario y caja en el mismo equipo',
      'Clientes y cuentas corrientes',
      'Respaldos de tu información',
      'Actualizaciones y soporte',
      'Un solo pago al año, sin mensualidades',
    ],
  },
]

function clone(plans: PlanOption[]): PlanOption[] {
  return plans.map((plan) => ({ ...plan, features: [...plan.features] }))
}

function slugifyPlan(name: string): string {
  const base = name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return base || 'nueva-suscripcion'
}

/** Id legible y único derivado del nombre visible. */
export function uniquePlanId(name: string, usedIds: string[]): string {
  const base = slugifyPlan(name)
  const used = new Set(usedIds)
  if (!used.has(base)) return base
  let suffix = 2
  while (used.has(`${base}-${suffix}`)) suffix += 1
  return `${base}-${suffix}`
}

/** Acepta datos de Laravel o de localStorage sin confiar en su forma. */
export function normalizePlans(value: unknown): PlanOption[] | null {
  if (!Array.isArray(value)) return null
  const plans: PlanOption[] = []
  for (const item of value) {
    if (!item || typeof item !== 'object') continue
    const row = item as Record<string, unknown>
    const id = typeof row.id === 'string' ? row.id.trim() : ''
    const name = typeof row.name === 'string' ? row.name.trim() : ''
    const price = typeof row.price === 'number' ? row.price : Number(row.price)
    if (!id || !name || !Number.isFinite(price) || price < 0) continue
    const features = Array.isArray(row.features)
      ? row.features.filter((feature): feature is string => typeof feature === 'string' && Boolean(feature.trim())).map((feature) => feature.trim())
      : []
    plans.push({
      id,
      name,
      description: typeof row.description === 'string' ? row.description.trim() : '',
      price,
      currency: typeof row.currency === 'string' && row.currency.trim() ? row.currency.trim() : 'USD',
      interval: row.interval === 'year' ? 'year' : 'month',
      features,
      highlighted: row.highlighted === true,
      active: row.active !== false,
    })
  }
  return plans
}

export const plansStore = {
  read(): PlanOption[] {
    try {
      const raw = window.localStorage.getItem(KEY)
      if (!raw) return clone(DEFAULT_PLANS)
      return normalizePlans(JSON.parse(raw)) ?? clone(DEFAULT_PLANS)
    } catch {
      return clone(DEFAULT_PLANS)
    }
  },
  readActive(): PlanOption[] {
    return this.read().filter((plan) => plan.active)
  },
  write(plans: PlanOption[]): PlanOption[] {
    const normalized = normalizePlans(plans) ?? []
    window.localStorage.setItem(KEY, JSON.stringify(normalized))
    return normalized
  },
}
