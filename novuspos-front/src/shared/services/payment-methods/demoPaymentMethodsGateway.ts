import { paymentMethodsStore } from './paymentMethodsStore'
import type { PaymentMethodsGateway } from './paymentMethodsGateway'

const DEMO_DELAY_MS = 160

function wait(): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, DEMO_DELAY_MS))
}

/** Sin backend: lee el catálogo que guarda el dueño desde Ajustes. */
export const demoPaymentMethodsGateway: PaymentMethodsGateway = {
  async list() {
    await wait()
    return paymentMethodsStore.read()
  },
}
