import { FAQ_VISUALS } from '@/shared/services/landing/defaults'
import type { LandingCopy } from '@/shared/services/landing/types'
import { MS } from './HeroHeader'

const iconToneClass: Record<string, string> = {
  primary: 'text-primary',
  secondary: 'text-secondary',
  neutral: 'text-on-surface',
}

/** Preguntas frecuentes editables; los iconos se conservan por posición. */
export function HardwareFaq({ section }: { section: LandingCopy['faq'] }) {
  return (
    <section className="w-full px-margin py-space-xl max-w-5xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-space-xl">
        <span className="font-label-sm text-label-sm text-primary uppercase font-bold tracking-widest block mb-space-xs">
          {section.eyebrow}
        </span>
        <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight">{section.title}</h2>
        {section.description && <p className="font-body-lg text-body-lg text-on-surface-variant mt-space-sm">{section.description}</p>}
      </div>

      <div className="flex flex-col gap-space-md">
        {section.items.map((faq, index) => {
          const visual = FAQ_VISUALS[index] ?? FAQ_VISUALS[0]
          return (
            <div key={`${faq.id}-${index}`} className="p-space-lg rounded-xl bg-surface-container-lowest shadow-sm">
              <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold mb-space-xs flex items-center gap-space-xs">
                <MS name={visual.icon} className={`${iconToneClass[visual.iconTone]} text-[22px]`} />
                {faq.question}
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant">{faq.answer}</p>
            </div>
          )
        })}
      </div>
    </section>
  )
}
