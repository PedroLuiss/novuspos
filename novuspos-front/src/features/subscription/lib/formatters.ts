/** Formateadores ligeros para fechas y montos del módulo de suscripción. */

const DATE_FORMATTER = new Intl.DateTimeFormat('es-VE', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
})

export function formatMoney(amount: number, currency: string): string {
  return new Intl.NumberFormat('es-VE', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount)
}

export function formatDate(value: string): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return DATE_FORMATTER.format(date)
}

/** Montos en bolívares, con el formato que usa el usuario en Venezuela. */
export function formatBolivares(value: number): string {
  if (!Number.isFinite(value)) return '—'
  return `Bs ${new Intl.NumberFormat('es-VE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)}`
}

export function formatExchangeRate(value: number): string {
  return new Intl.NumberFormat('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value)
}

export function toDateInputValue(value: Date = new Date()): string {
  const offset = value.getTimezoneOffset()
  const local = new Date(value.getTime() - offset * 60_000)
  return local.toISOString().slice(0, 10)
}
