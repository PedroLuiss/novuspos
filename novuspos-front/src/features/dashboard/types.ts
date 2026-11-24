/** Tipos públicos del panel general. */

export type DashboardSubscriptionStatus = 'active' | 'pending_review' | 'inactive' | 'cancelled'

export interface DashboardSummary {
  organizationName: string
  planName: string
  /** Estado efectivo enviado por la API; en demo se deriva de la fecha de pago. */
  subscriptionStatus: DashboardSubscriptionStatus
  /** Fecha en la que corresponde el próximo pago. */
  dueAt: string
  /** Clave completa que activa el sistema de escritorio; cambia con cada pago. */
  activationKey: string
  /** Fecha en la que se renueva la clave con el siguiente pago. */
  activationKeyRenewsAt: string
  lastBackupAt: string | null
}
