import type { LandingScreenshot } from '@/shared/services/landing/types'
import { ScreenshotCarousel } from './ScreenshotCarousel'

/** Antes aquí vivía el mockup HTML del POS; hoy muestra las capturas reales configuradas. */
export function HeroMockup({ screenshots }: { screenshots: LandingScreenshot[] }) {
  return <ScreenshotCarousel slides={screenshots} />
}
