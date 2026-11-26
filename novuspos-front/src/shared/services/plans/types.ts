/** Suscripción de NovusPOS Desktop que el dueño configura y el cliente contrata. */
export interface PlanOption {
  /** Clave estable enviada con el pago; los planes iniciales son `novus-mensual` y `novus-anual`. */
  id: string
  name: string
  description: string
  price: number
  currency: string
  interval: 'month' | 'year'
  features: string[]
  /** Resalta el plan recomendado en el catálogo y en la landing. */
  highlighted?: boolean
  /** Un plan oculto deja de ofrecerse, pero no se borra del historial. */
  active: boolean
}
