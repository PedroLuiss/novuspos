import { faqs } from '@/features/landing/data/landing-data'
import { MS } from './HeroHeader'

const iconToneClass: Record<string, string> = {
  primary: 'text-primary',
  secondary: 'text-secondary',
  neutral: 'text-on-surface',
}

/** Sección de preguntas frecuentes y hardware. */
export function HardwareFaq() {
  return (
    <section className="w-full px-margin py-space-xl max-w-5xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-space-xl">
        <span className="font-label-sm text-label-sm text-primary uppercase font-bold tracking-widest block mb-space-xs">
          PREGUNTAS FRECUENTES
        </span>
        <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight">
          Todo lo que necesitas saber antes de instalar
        </h2>
      </div>

      <div className="flex flex-col gap-space-md">
        {faqs.map((faq) => (
          <div key={faq.question} className="p-space-lg rounded-xl bg-surface-container-lowest shadow-sm">
            <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold mb-space-xs flex items-center gap-space-xs">
              <MS name={faq.icon} className={`${iconToneClass[faq.iconTone]} text-[22px]`} />
              {faq.question}
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant">{faq.answer}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
