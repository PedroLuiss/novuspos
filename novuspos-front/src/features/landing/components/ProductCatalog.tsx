import { PRODUCT_CAPABILITY_ICONS, PRODUCT_GROUP_VISUALS } from '@/shared/services/landing/defaults'
import type { LandingCopy } from '@/shared/services/landing/types'
import { MS } from './HeroHeader'

const iconToneClass: Record<string, string> = {
  primary: 'bg-primary-fixed text-primary',
  secondary: 'bg-secondary-fixed text-secondary',
  neutral: 'bg-surface-container-high text-on-surface',
}

/** Sección de productos: qué se puede dar de alta y qué guarda cada ficha. */
export function ProductCatalog({ section }: { section: LandingCopy['products'] }) {
  return (
    <section id="productos" className="w-full px-margin py-space-xl max-w-7xl mx-auto">
      <div className="text-center max-w-3xl mx-auto mb-space-xl">
        <span className="font-label-sm text-label-sm text-primary uppercase font-bold tracking-widest block mb-space-xs">
          {section.eyebrow}
        </span>
        <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight mb-space-sm">{section.title}</h2>
        {section.description && <p className="font-body-lg text-body-lg text-on-surface-variant">{section.description}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-space-lg">
        {section.groups.map((group, index) => {
          const visual = PRODUCT_GROUP_VISUALS[index] ?? PRODUCT_GROUP_VISUALS[0]
          return (
            <div
              key={`${group.title}-${index}`}
              className="p-space-lg rounded-xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-shadow flex flex-col"
            >
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-space-md ${iconToneClass[visual.iconTone]}`}>
                <MS name={visual.icon} className="text-[28px]" />
              </div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold mb-space-xs">{group.title}</h3>
              <p className="font-body-md text-body-md text-on-surface-variant mb-space-md">{group.description}</p>
              <div className="mt-auto p-space-sm rounded bg-surface-container-low font-mono text-label-sm text-on-surface-variant">
                {group.example}
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-space-xl">
        <div className="text-center max-w-3xl mx-auto mb-space-lg">
          <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold mb-space-xs">{section.catalogTitle}</h3>
          <p className="font-body-md text-body-md text-on-surface-variant">{section.catalogDescription}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
          {section.varieties.map((variety, index) => (
            <div key={`${variety.category}-${index}`} className="rounded-lg bg-surface-container-low p-space-md">
              <h4 className="font-label-md text-label-md text-on-surface font-bold mb-space-sm">{variety.category}</h4>
              <div className="flex flex-wrap gap-space-xs">
                {variety.items.map((item) => (
                  <span key={item} className="px-space-sm py-space-xs rounded-full bg-surface-container-lowest text-body-sm text-on-surface-variant">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-space-xl text-center max-w-3xl mx-auto mb-space-lg">
        <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold mb-space-xs">{section.capabilitiesTitle}</h3>
        <p className="font-body-md text-body-md text-on-surface-variant">{section.capabilitiesDescription}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-space-md">
        {section.capabilities.map((capability, index) => (
          <div key={`${capability.title}-${index}`} className="flex gap-space-sm p-space-md rounded-lg bg-surface-container-lowest border border-outline-variant/30">
            <div className="w-10 h-10 shrink-0 rounded-lg flex items-center justify-center bg-primary-fixed text-primary">
              <MS name={PRODUCT_CAPABILITY_ICONS[index] ?? 'check'} className="text-[22px]" />
            </div>
            <div>
              <h4 className="font-label-md text-label-md text-on-surface font-bold mb-space-xs">{capability.title}</h4>
              <p className="font-body-sm text-body-sm text-on-surface-variant">{capability.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
