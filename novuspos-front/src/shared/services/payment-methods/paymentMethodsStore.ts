/** Catálogo de cobro compartido: el panel maestro escribe y el portal de clientes lee. */
import type { PaymentMethodOption, PaymentMethodRow } from './types'

const KEY = 'novuspos:payment-methods'

export const DEFAULT_PAYMENT_METHODS: PaymentMethodOption[] = [
  {
    id: 'mobile',
    label: 'Pago móvil',
    description: 'Transfiere desde tu banca móvil a este número.',
    icon: 'smartphone',
    active: true,
    rows: [
      { label: 'Banco', value: 'Banco de demostración' },
      { label: 'Número de teléfono', value: '0424-0000000', mono: true },
      { label: 'Titular', value: 'NovusPOS (Demo)' },
      { label: 'Identificación', value: 'J-00000000-0', mono: true },
    ],
  },
  {
    id: 'transfer',
    label: 'Transferencia',
    description: 'Transfiere a la cuenta bancaria de NovusPOS.',
    icon: 'account_balance',
    active: true,
    rows: [
      { label: 'Banco', value: 'Banco de demostración' },
      { label: 'Tipo de cuenta', value: 'Corriente' },
      { label: 'Número de cuenta', value: '0000-0000-00-0000000000', mono: true },
      { label: 'Titular', value: 'NovusPOS (Demo)' },
      { label: 'Identificación', value: 'J-00000000-0', mono: true },
    ],
  },
]

function normalizeRows(value: unknown): PaymentMethodRow[] {
  if (!Array.isArray(value)) return []
  return value
    .filter((row): row is Record<string, unknown> => Boolean(row) && typeof row === 'object')
    .map((row) => ({
      label: typeof row.label === 'string' ? row.label.trim() : '',
      value: typeof row.value === 'string' ? row.value.trim() : '',
      mono: row.mono === true,
    }))
    .filter((row) => row.label && row.value)
}

/** Acepta datos del servidor o de localStorage sin confiar en su forma. */
export function normalizePaymentMethods(value: unknown): PaymentMethodOption[] | null {
  if (!Array.isArray(value)) return null
  const methods: PaymentMethodOption[] = []
  for (const item of value) {
    if (!item || typeof item !== 'object') continue
    const row = item as Record<string, unknown>
    const id = typeof row.id === 'string' ? row.id.trim() : ''
    const label = typeof row.label === 'string' ? row.label.trim() : ''
    if (!id || !label) continue
    methods.push({
      id,
      label,
      description: typeof row.description === 'string' ? row.description.trim() : '',
      icon: typeof row.icon === 'string' && row.icon.trim() ? row.icon.trim() : 'payments',
      active: row.active !== false,
      rows: normalizeRows(row.rows),
    })
  }
  return methods
}

/** Clave legible para métodos nuevos: `Zelle  ·  Banesco` → `zelle-banesco`. */
export function slugifyPaymentMethod(label: string): string {
  const base = label
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return base || 'metodo-de-pago'
}

/** Id estable y único para un método nuevo, derivado del nombre visible. */
export function uniquePaymentMethodId(label: string, usedIds: string[]): string {
  const base = slugifyPaymentMethod(label)
  const used = new Set(usedIds)
  if (!used.has(base)) return base
  let suffix = 2
  while (used.has(`${base}-${suffix}`)) suffix += 1
  return `${base}-${suffix}`
}

export const paymentMethodsStore = {
  read(): PaymentMethodOption[] {
    try {
      const raw = window.localStorage.getItem(KEY)
      if (!raw) return DEFAULT_PAYMENT_METHODS.map((item) => ({ ...item, rows: item.rows.map((row) => ({ ...row })) }))
      return normalizePaymentMethods(JSON.parse(raw)) ?? []
    } catch {
      return DEFAULT_PAYMENT_METHODS.map((item) => ({ ...item, rows: item.rows.map((row) => ({ ...row })) }))
    }
  },
  write(methods: PaymentMethodOption[]): PaymentMethodOption[] {
    const normalized = normalizePaymentMethods(methods) ?? []
    window.localStorage.setItem(KEY, JSON.stringify(normalized))
    return normalized
  },
}
