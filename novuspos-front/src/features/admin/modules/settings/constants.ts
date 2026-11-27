import type { PaymentMethodOption } from '@/shared/services/payment-methods/types'

/** Iconos disponibles para identificar cada cuenta de cobro. */
export const PAYMENT_METHOD_ICONS: readonly { value: string; label: string }[] = [
  { value: 'payments', label: 'Pagos' },
  { value: 'smartphone', label: 'Pago móvil' },
  { value: 'account_balance', label: 'Banco' },
  { value: 'local_bank', label: 'Sucursal' },
  { value: 'qr_code', label: 'QR' },
  { value: 'credit_card', label: 'Tarjeta' },
  { value: 'currency_exchange', label: 'Divisa' },
  { value: 'wallet', label: 'Billetera' },
]

export const EMPTY_PAYMENT_METHOD: PaymentMethodOption = {
  id: '',
  label: '',
  description: '',
  icon: 'payments',
  active: true,
  rows: [{ label: '', value: '', mono: false }],
}

export const LOGIN_PATH_ERROR = 'Usa una ruta como /acceso-maestro. No puede ser /, /auth, /panel ni /administracion.'
