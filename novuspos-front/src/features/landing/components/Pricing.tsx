import { MS } from './HeroHeader'

/** Sección de precios: un solo plan transparente. */
export function Pricing() {
  return (
    <section id="precios" className="w-full bg-surface-container-low py-space-xl">
      <div className="px-margin max-w-5xl mx-auto flex flex-col items-center">
        <div className="text-center max-w-2xl mb-space-xl">
          <span className="font-label-sm text-label-sm text-secondary uppercase font-bold tracking-widest block mb-space-xs">
            PRECIO TRANSPARENTE • CERO SORPRESAS
          </span>
          <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight mb-space-xs">
            Un solo plan con todo incluido
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Sin límites de artículos, sin costos ocultos por cajeros y sin comisiones sobre tus ventas.
          </p>
        </div>

        {/* Pricing Card */}
        <div className="w-full max-w-xl rounded-2xl bg-surface-container-lowest p-space-xl shadow-xl ring-2 ring-primary relative overflow-hidden">
          <div className="absolute -right-12 top-7 rotate-45 bg-secondary text-on-secondary font-label-sm text-label-sm font-bold py-1 px-14 shadow-sm">
            PRIMER MES $0
          </div>
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-space-lg">
            <div>
              <span className="font-headline-sm text-headline-sm text-on-surface font-bold block">
                Licencia Profesional NovusPOS
              </span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                Para Windows 10 o Windows 11
              </span>
            </div>
            <div className="mt-space-sm sm:mt-0 text-left sm:text-right">
              <div className="flex items-baseline gap-1">
                <span className="font-display text-display text-primary font-extrabold font-numeric-total">$4.99</span>
                <span className="font-body-md text-body-md text-on-surface-variant font-medium">USD / mes</span>
              </div>
              <span className="font-label-sm text-label-sm text-secondary font-bold block">
                ¡30 días de prueba gratuita completa!
              </span>
            </div>
          </div>

          {/* Beneficios en lenguaje de negocio, sin detalles técnicos internos. */}
          <div className="flex flex-col gap-space-sm mb-space-xl">
            {[
              { strong: 'Instalación completa', rest: ' en tu computadora, lista para trabajar desde el primer día.' },
              { strong: 'Catálogo y ventas', rest: ' sin costos por volumen ni comisiones sobre tus ventas.' },
              { strong: 'Básculas conectadas', rest: ' y tickets en 80/58 mm listos para imprimir o descargar.' },
              { strong: 'Cierre de caja, control de efectivo', rest: ' e historial completo de movimientos.' },
              { strong: 'Soporte desde la propia aplicación', rest: ', sin salir del programa.' },
              { strong: 'Respaldos de tu información', rest: ' y restauración cuando lo necesites.' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-space-sm">
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
            className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-space-sm px-space-xl py-space-md rounded-lg bg-primary text-on-primary font-headline-sm font-bold shadow-xl cta-shimmer-btn group active:scale-95"
          >
            <MS name="download" className="text-[24px] cta-download-icon transition-transform" />
            <span className="flex flex-col text-left">
              <span>Descargar para Windows</span>
              <span className="font-label-sm text-label-sm text-on-primary/80 font-normal">
                v2.4.0 (.exe) • ~85 MB • 30 Días Gratis
              </span>
            </span>
          </a>
          <p className="font-body-sm text-body-sm text-on-surface-variant text-center mt-space-sm">
            No requerimos tarjeta de crédito para iniciar tu período de prueba en Windows.
          </p>
        </div>
      </div>
    </section>
  )
}
