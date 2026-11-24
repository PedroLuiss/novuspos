import type { SupportSubmitRequest, SupportTicket } from '../types'

/** Contrato único para el modo demo y para la API del soporte. */
export interface SupportGateway {
  submit(request: SupportSubmitRequest): Promise<SupportTicket>
}
