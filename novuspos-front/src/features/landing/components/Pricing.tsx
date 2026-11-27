import { usePlans } from '@/shared/hooks/usePlans'
import { plansService } from '@/shared/services/plans/plansService'
import type { PlanOption } from '@/shared/services/plans/types'
import type { LandingCopy, LandingDownload } from '@/shared/services/landing/types'
import { MS } from './HeroHeader'

type PlanBenefits = LandingCopy['pricing']['benefits']

interface PlanPriceProps {
  name: string
  price: string
  period: string
  note: string
  ribbon?: string
  onSale?: boolean
  compatibility: string
  benefits: PlanBenefits
  cta: string
  ctaNote: string
  download: LandingDownload | null
}

/** Tarjeta de precio reutilizable; los planes vienen del catálogo del dueño. */
function PlanPriceCard({ name, price, period, note, ribbon, onSale, compatibility, benefits, cta, ctaNote, download }: PlanPriceProps) {
  return (
    <article
      className={`w-full rounded-2xl bg-surface-container-lowest p-space-xl shadow-xl relative overflow-hidden flex flex-col ${
        onSale ? 'ring-2 ring-primary' : 'ring-1 ring-outline-variant'
      }`}
    >
      {ribbon && (
        <div className="absolute -right-12 top-7 rotate-45 bg-secondary text-on-secondary font-label-sm text-label-sm font-bold py-1 px-14 shadow-sm">
          {ribbon}
        </div>
      )}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-space-sm mb-space-md">
        <div>
          <span className="font-headline-sm text-headline-sm text-on-surface font-bold block">{name}</span>
          <span className="font-body-sm text-body-sm text-on-surface-variant">{compatibility}</span>
        </div>
        <div className="text-left sm:text-right">
          <div className="flex items-baseline gap-1">
            <span className="font-display text-display text-primary font-extrabold font-numeric-total">{price}</span>
            <span className="font-body-md text-body-md text-on-surface-variant font-medium">USD / {period}</span>
          </div>
          <span className="font-label-sm text-label-sm text-secondary font-bold block">{note}</span>
        </div>
      </div>

      <div className="flex flex-col gap-space-sm mb-space-lg">
        {benefits.map((item, index) => (
          <div key={`${item.strong}-${index}`} className="flex items-start gap-space-sm">
            <MS name="check_circle" className="text-secondary text-[20px] shrink-0 mt-0.5" />
            <span className="font-body-md text-body-md text-on-surface">
              <strong>{item.strong}</strong>
              {item.rest}
            </span>
          </div>
        ))}
      </div>

      <a
        href={download?.url || '#descargar'}
        {...(download?.url ? { download: download.fileName || true, target: '_blank', rel: 'noreferrer' } : {})}
        className="mt-auto w-full inline-flex items-center justify-center gap-space-sm px-space-xl py-space-md rounded-lg bg-primary text-on-primary font-headline-sm font-bold shadow-xl cta-shimmer-btn group active:scale-95"
      >
        <MS name="download" className="text-[24px] cta-download-icon transition-transform" />
        <span className="flex flex-col text-left">
          <span>{cta}</span>
          <span className="font-label-sm text-label-sm text-on-primary/80 font-normal">{ctaNote}</span>
        </span>
      </a>
    </article>
  )
}

function priceLabel(plan: PlanOption): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: plan.currency || 'USD',
    minimumFractionDigits: 2,
  }).format(plan.price)
}

/** Sección de precios con los planes y textos que configura el dueño. */
export function Pricing({ section, download }: { section: LandingCopy['pricing']; download: LandingDownload | null }) {
  const { plans } = usePlans()
  const visiblePlans = plans.length > 0 ? plans : plansService.readCached()

  return (
    <section id="precios" className="w-full bg-surface-container-low py-space-xl">
      <div className="px-margin max-w-6xl mx-auto flex flex-col items-center">
        <div className="text-center max-w-2xl mb-space-xl">
          <span className="font-label-sm text-label-sm text-secondary uppercase font-bold tracking-widest block mb-space-xs">
            {section.eyebrow}
          </span>
          <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight mb-space-xs">{section.title}</h2>
          <p className="font-body-md text-body-md text-on-surface-variant">{section.description}</p>
        </div>

        <div className="grid w-full grid-cols-1 md:grid-cols-2 gap-space-md items-stretch">
          {visiblePlans.map((plan) => {
            const monthly = plan.interval === 'month'
            return (
              <PlanPriceCard
                key={plan.id}
                name={plan.name}
                price={priceLabel(plan)}
                period={monthly ? 'mes' : 'año'}
                note={monthly && plan.highlighted ? '¡30 días de prueba gratuita completa!' : monthly ? plan.description : 'Un solo pago al año, sin mensualidades'}
                ribbon={monthly && plan.highlighted ? 'PRIMER MES $0' : undefined}
                onSale={plan.highlighted === true}
                compatibility={section.compatibility}
                benefits={section.benefits}
                cta={section.cta}
                ctaNote={section.ctaNote}
                download={download}
              />
            )
          })}
        </div>

        <p className="font-body-sm text-body-sm text-on-surface-variant text-center mt-space-md">{section.footnote}</p>
      </div>
    </section>
  )
}
