import type { SupportSubmitRequest, SupportTicket } from '../types'
import type { SupportGateway } from './supportGateway'

const DEMO_DELAY_MS = 500

function wait(): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, DEMO_DELAY_MS))
}

/** Adaptador demo: mismo contrato que la API, sin red. */
export const demoSupportGateway: SupportGateway = {
  async submit(_request: SupportSubmitRequest): Promise<SupportTicket> {
    await wait()
    const suffix = Date.now().toString().slice(-6)
    return {
      id: `tk-demo-${suffix}`,
      reference: `TK-${suffix}`,
      message: 'Recibimos tu reporte. Te responderemos al correo que nos dejaste.',
    }
  },
}
