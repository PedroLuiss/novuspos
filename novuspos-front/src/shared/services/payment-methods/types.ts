/** Datos de cobro que el dueño configura y el usuario ve al pagar su suscripción. */
export interface PaymentMethodRow {
  label: string
  value: string
  mono?: boolean
}

export interface PaymentMethodOption {
  /** Clave estable enviada con el pago. En el catálogo inicial son `mobile` y `transfer`. */
  id: string
  label: string
  description: string
  icon: string
  active: boolean
  rows: PaymentMethodRow[]
}
