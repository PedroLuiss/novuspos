import { plansStore } from './plansStore'
import type { PlansGateway } from './plansGateway'

const DEMO_DELAY_MS = 160

function wait(): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, DEMO_DELAY_MS))
}

/** Sin backend: lee el catálogo que configura el dueño en el panel maestro. */
export const demoPlansGateway: PlansGateway = {
  async list() {
    await wait()
    return plansStore.readActive()
  },
}
