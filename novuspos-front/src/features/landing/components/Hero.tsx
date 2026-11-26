import type { LandingCopy, LandingScreenshot } from '@/shared/services/landing/types'
import { HeroHeader } from './HeroHeader'
import { HeroMockup } from './HeroMockup'

/** Hero principal: glow ambiental + propuesta de valor + carrusel de capturas. */
export function Hero({
  hero,
  screenshots,
}: {
  hero: LandingCopy['hero']
  screenshots: LandingScreenshot[]
}) {
  return (
    <div className="relative w-full overflow-hidden" id="inicio">
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-gradient-to-b from-primary-fixed/40 via-surface-tint/10 to-transparent blur-3xl pointer-events-none rounded-full" />
      <HeroHeader hero={hero}>
        <HeroMockup screenshots={screenshots} />
      </HeroHeader>
    </div>
  )
}
