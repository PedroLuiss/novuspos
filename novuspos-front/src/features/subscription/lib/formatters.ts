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

export function toDateInputValue(value: Date = new Date()): string {
  const offset = value.getTimezoneOffset()
  const local = new Date(value.getTime() - offset * 60_000)
  return local.toISOString().slice(0, 10)
}
