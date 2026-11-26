import { landingStore } from './landingStore'
import type { LandingGateway } from './landingGateway'

const DEMO_DELAY_MS = 160

function wait(): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, DEMO_DELAY_MS))
}

/** Sin backend: dueño y landing comparten `novuspos:landing`. */
export const demoLandingGateway: LandingGateway = {
  async getLanding() {
    await wait()
    return landingStore.read()
  },
  async saveLanding(config) {
    await wait()
    return landingStore.write(config)
  },
}
