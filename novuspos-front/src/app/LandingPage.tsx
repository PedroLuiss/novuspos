import { ComparisonTable } from '@/features/landing/components/ComparisonTable'
import { FinalCta } from '@/features/landing/components/FinalCta'
import { HardwareFaq } from '@/features/landing/components/HardwareFaq'
import { Hero } from '@/features/landing/components/Hero'
import { KeyFeatures } from '@/features/landing/components/KeyFeatures'
import { Pricing } from '@/features/landing/components/Pricing'
import { SiteHeader } from '@/features/landing/components/SiteHeader'
import { Footer } from '@/features/landing/components/Footer'

/** Composición de la landing oficial — idéntica al diseño de Stitch.
 *  Orden de secciones: Hero → KeyFeatures → KeyboardCheatSheet → ComparisonTable → Pricing → HardwareFaq → FinalCta → Footer.
 */
export function LandingPage() {
  return (
    <div className="w-full bg-surface">
      <SiteHeader />
      <main className="w-full pt-20 bg-surface">
        <Hero />
        <KeyFeatures />
        {/* <KeyboardCheatSheet /> */}
        <ComparisonTable />
        <Pricing />
        <HardwareFaq />
        <FinalCta />
      </main>
      <Footer />
    </div>
  )
}
