import { pricingBenefits } from '../data/landing-data'
import { MS } from './HeroHeader'

interface PlanPriceProps {
  name: string
  price: string
  period: string
  note: string
  ribbon?: string
  onSale?: boolean
}

/** Tarjeta de precio reutilizable para el plan mensual y el anual. */
function PlanPriceCard({ name, price, period, note, ribbon, onSale }: PlanPriceProps) {
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
          <span className="font-body-sm text-body-sm text-on-surface-variant">Para Windows 10 o Windows 11</span>
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
        {pricingBenefits.map((item) => (
          <div key={item.strong} className="flex items-start gap-space-sm">
            <MS name="check_circle" className="text-secondary text-[20px] shrink-0 mt-0.5" />
            <span className="font-body-md text-body-md text-on-surface">
              <strong>{item.strong}</strong>
              {item.rest}
            </span>
          </div>
        ))}
      </div>

      <a
        href="#descargar"
        className="mt-auto w-full inline-flex items-center justify-center gap-space-sm px-space-xl py-space-md rounded-lg bg-primary text-on-primary font-headline-sm font-bold shadow-xl cta-shimmer-btn group active:scale-95"
      >
        <MS name="download" className="text-[24px] cta-download-icon transition-transform" />
        <span className="flex flex-col text-left">
          <span>Descargar para Windows</span>
          <span className="font-label-sm text-label-sm text-on-primary/80 font-normal">30 días gratis • sin tarjeta</span>
        </span>
      </a>
    </article>
  )
}

/** Sección de precios: plan mensual y plan anual. */
export function Pricing() {
  return (
    <section id="precios" className="w-full bg-surface-container-low py-space-xl">
      <div className="px-margin max-w-6xl mx-auto flex flex-col items-center">
        <div className="text-center max-w-2xl mb-space-xl">
          <span className="font-label-sm text-label-sm text-secondary uppercase font-bold tracking-widest block mb-space-xs">
            PRECIO TRANSPARENTE • CERO SORPRESAS
          </span>
          <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight mb-space-xs">
            Elige cómo quieres pagar
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Mes a mes si prefieres empezar con calma, o un solo pago al año si ya sabes que NovusPOS es para ti. Sin
            límites de artículos, costos ocultos ni comisiones sobre tus ventas.
          </p>
        </div>

        <div className="grid w-full grid-cols-1 md:grid-cols-2 gap-space-md items-stretch">
          <PlanPriceCard
            name="NovusPOS Mensual"
            price="$4.99"
            period="mes"
            note="¡30 días de prueba gratuita completa!"
            ribbon="PRIMER MES $0"
            onSale
          />
          <PlanPriceCard
            name="NovusPOS Anual"
            price="$59.99"
            period="año"
            note="Un solo pago al año, sin mensualidades"
          />
        </div>

        <p className="font-body-sm text-body-sm text-on-surface-variant text-center mt-space-md">
          No requerimos tarjeta de crédito para iniciar tu período de prueba en Windows.
        </p>
      </div>
    </section>
  )
}
