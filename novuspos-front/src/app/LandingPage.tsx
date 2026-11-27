import { Fragment, type ReactNode } from 'react'
import { useLandingConfig } from '@/shared/hooks/useLandingConfig'
import { themeToStyle } from '@/shared/services/landing/landingPreview'
import type { LandingConfig, LandingSectionId } from '@/shared/services/landing/types'
import { ComparisonTable } from '@/features/landing/components/ComparisonTable'
import { FinalCta } from '@/features/landing/components/FinalCta'
import { HardwareFaq } from '@/features/landing/components/HardwareFaq'
import { Hero } from '@/features/landing/components/Hero'
import { KeyFeatures } from '@/features/landing/components/KeyFeatures'
import { Pricing } from '@/features/landing/components/Pricing'
import { ProductCatalog } from '@/features/landing/components/ProductCatalog'
import { SiteHeader } from '@/features/landing/components/SiteHeader'
import { Footer } from '@/features/landing/components/Footer'

/** Orden: Hero → secciones configurables → Footer. El dueño decide visibilidad y orden. */
function renderSection(id: LandingSectionId, config: LandingConfig): ReactNode {
  switch (id) {
    case 'features':
      return <KeyFeatures section={config.copy.features} />
    case 'products':
      return <ProductCatalog section={config.copy.products} />
    case 'comparison':
      return <ComparisonTable section={config.copy.comparison} />
    case 'pricing':
      return <Pricing section={config.copy.pricing} download={config.download} />
    case 'faq':
      return <HardwareFaq section={config.copy.faq} />
    case 'finalCta':
      return <FinalCta section={config.copy.finalCta} download={config.download} />
  }
}

export function LandingPage() {
  const { config } = useLandingConfig()
  const visible = config.sections.filter((section) => section.visible)

  return (
    <div className="w-full bg-surface" style={themeToStyle(config.theme)}>
      <SiteHeader header={config.copy.header} logo={config.logos.header} visibleSections={visible.map((section) => section.id)} />
      <main className="w-full pt-20 bg-surface">
        <Hero hero={config.copy.hero} screenshots={config.screenshots} download={config.download} />
        {visible.map((section) => (
          <Fragment key={section.id}>{renderSection(section.id, config)}</Fragment>
        ))}
      </main>
      <Footer footer={config.copy.footer} logo={config.logos.footer} />
    </div>
  )
}
