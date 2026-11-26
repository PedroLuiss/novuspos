import type { PaymentMethodOption } from './types'

/** Los dos métodos iniciales conservan su nombre aunque el catálogo no cargue. */
const LEGACY_LABELS: Record<string, string> = {
  mobile: 'Pago móvil',
  transfer: 'Transferencia',
}

/** Mapa id → etiqueta legible para historiales que guardaron pagos con otro catálogo. */
export function paymentMethodLabels(methods: PaymentMethodOption[]): Record<string, string> {
  const labels: Record<string, string> = { ...LEGACY_LABELS }
  for (const method of methods) labels[method.id] = method.label
  return labels
}

export function paymentMethodLabel(method: string, labels: Record<string, string>): string {
  if (labels[method]) return labels[method]
  return method ? method.charAt(0).toUpperCase() + method.slice(1) : '—'
}
