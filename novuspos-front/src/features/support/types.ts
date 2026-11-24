/** Tipos públicos del centro de soporte. */

export type SupportTopic = 'acceso' | 'instalacion' | 'ventas' | 'inventario' | 'tickets' | 'otro'

export interface SupportDraft {
  email: string
  topic: SupportTopic | ''
  subject: string
  description: string
}

export interface SupportSubmitRequest {
  email: string
  topic: SupportTopic
  subject: string
  description: string
  source: 'web'
}

export interface SupportTicket {
  id: string
  reference: string
  message?: string
}

export interface SupportFieldErrors {
  email?: string
  topic?: string
  subject?: string
  description?: string
}
