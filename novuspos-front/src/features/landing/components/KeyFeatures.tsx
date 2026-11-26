import { FEATURE_VISUALS } from '@/shared/services/landing/defaults'
import type { LandingCopy } from '@/shared/services/landing/types'
import { MS } from './HeroHeader'

const iconToneClass: Record<string, string> = {
  primary: 'bg-primary-fixed text-primary',
  secondary: 'bg-secondary-fixed text-secondary',
  neutral: 'bg-surface-container-high text-on-surface',
}

const badgeToneClass: Record<string, string> = {
  primary: 'text-primary',
  secondary: 'text-secondary',
  neutral: 'text-on-surface-variant',
}

/** Tarjetas de características con los textos que edita el dueño. */
export function KeyFeatures({ section }: { section: LandingCopy['features'] }) {
  return (
    <section id="caracteristicas" className="w-full px-margin py-space-xl max-w-7xl mx-auto">
      <div className="text-center max-w-3xl mx-auto mb-space-xl">
        <span className="font-label-sm text-label-sm text-primary uppercase font-bold tracking-widest block mb-space-xs">
          {section.eyebrow}
        </span>
        <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight mb-space-sm">
          {section.title}
        </h2>
        {section.description && (
          <p className="font-body-lg text-body-lg text-on-surface-variant">{section.description}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-lg">
        {section.items.map((feature, index) => {
          const visual = FEATURE_VISUALS[index] ?? FEATURE_VISUALS[0]
          return (
            <div
              key={`${feature.id}-${index}`}
              className="p-space-lg rounded-xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-space-md ${iconToneClass[visual.iconTone]}`}>
                  <MS name={visual.icon} className="text-[28px]" />
                </div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold mb-space-xs">{feature.title}</h3>
                <p className="font-body-md text-body-md text-on-surface-variant mb-space-md">{feature.description}</p>
              </div>
              <div className={`p-space-sm rounded bg-surface-container-low font-mono text-label-sm font-semibold ${badgeToneClass[visual.badgeTone]}`}>
                {feature.badge}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
