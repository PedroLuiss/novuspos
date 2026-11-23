import { authBenefits } from '@/features/auth/data/auth-data'
import { MS } from '@/shared/ui/MS'

/** Columna izquierda del split de auth: branding, promesas y garantías (réplica de Stitch). */
export function AuthBrandPanel() {
  return (
    <div className="lg:col-span-5 relative overflow-hidden bg-gradient-to-br from-primary-container via-primary to-on-secondary-fixed p-space-lg lg:p-space-xl flex flex-col justify-between text-on-primary">
      {/* Efectos de luces y refracción */}
      <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-primary-fixed/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full bg-secondary-container/20 blur-3xl pointer-events-none" />

      {/* Header / logo */}
      <div className="relative z-10">
        <div className="flex items-center gap-space-sm mb-space-md">
          <a href="#/" className="flex items-center">
            <img alt="NovusPOS Logo" className="h-10 w-auto object-contain" src="/novuspos-logo-white.png" />
          </a>
        </div>
        <span className="inline-flex items-center gap-space-xs px-3 py-1 rounded-full bg-on-primary/10 text-on-primary font-label-sm text-label-sm backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-secondary-container animate-ping" />
          LISTO PARA WINDOWS · TRABAJA SIN INTERNET
        </span>
        <h1 className="font-headline-lg text-headline-lg mt-space-md text-on-primary tracking-tight">
          Potencia tu caja registradora al instante.
        </h1>
        <p className="font-body-md text-body-md text-primary-fixed mt-space-xs">
          El punto de venta ágil, diseñado para tiendas de retail, abarrotes y comercio moderno.
        </p>
      </div>

      {/* Tarjeta de métricas operativas con sparkline */}
      <div className="relative z-10 my-space-lg p-space-md rounded-lg bg-on-primary/10 backdrop-blur-md">
        <div className="flex items-center justify-between mb-space-sm">
          <div className="flex items-center gap-space-xs">
            <MS name="speed" filled className="text-secondary-container" />
            <span className="font-label-md text-label-md text-on-primary">Rendimiento Operativo</span>
          </div>
          <span className="font-label-sm text-label-sm text-secondary-container bg-on-secondary-fixed/50 px-2 py-0.5 rounded-full">
            Sin depender de internet
          </span>
        </div>
        <svg className="w-full h-12 text-secondary-container overflow-visible" fill="none" viewBox="0 0 240 40" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 32 L40 28 L80 30 L120 18 L160 22 L200 8 L240 4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
          <path d="M0 32 L40 28 L80 30 L120 18 L160 22 L200 8 L240 4 V 40 H 0 Z" fill="currentColor" fillOpacity="0.12" />
          <circle className="fill-secondary-container" cx="200" cy="8" r="3.5" />
          <circle className="fill-on-primary" cx="240" cy="4" r="4.5" />
        </svg>
        <div className="grid grid-cols-2 gap-space-sm mt-space-sm pt-space-sm">
          <div className="flex flex-col">
            <span className="font-label-sm text-label-sm text-primary-fixed">Tiempo por cobro</span>
            <span className="font-numeric-keypad text-numeric-keypad text-on-primary">Al instante</span>
          </div>
          <div className="flex flex-col text-right">
            <span className="font-label-sm text-label-sm text-primary-fixed">Tu información</span>
            <span className="font-numeric-keypad text-numeric-keypad text-secondary-container">Siempre listo</span>
          </div>
        </div>
      </div>

      {/* Beneficios inmediatos */}
      <div className="relative z-10 space-y-space-sm">
        {authBenefits.map((benefit) => (
          <div key={benefit.title} className="flex items-start gap-space-sm">
            <div className="w-7 h-7 rounded-full bg-secondary-container/20 flex items-center justify-center shrink-0 mt-0.5">
              <MS name={benefit.icon} className="text-secondary-container text-[18px]" />
            </div>
            <div>
              <p className="font-label-md text-label-md text-on-primary">{benefit.title}</p>
              <p className="font-body-sm text-body-sm text-primary-fixed">{benefit.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tarjeta de garantía de prueba */}
      <div className="relative z-10 mt-space-lg pt-space-md bg-on-primary/5 rounded-lg p-space-md backdrop-blur-sm">
        <div className="flex items-center gap-space-sm mb-space-xs">
          <MS name="workspace_premium" filled className="text-secondary-container text-[16px]" />
          <span className="font-label-sm text-label-sm text-primary-fixed">Prueba sin riesgo</span>
        </div>
        <p className="font-body-sm text-body-sm text-on-primary italic">
          “Empieza con 30 días de acceso total: ventas, inventario, caja y clientes. Sin tarjeta y sin compromiso.”
        </p>
        <div className="flex items-center gap-space-xs mt-space-xs">
          <span className="font-label-md text-label-md text-on-primary">Primer mes $0</span>
          <span className="font-body-sm text-body-sm text-primary-fixed">· Luego $4.99 USD/mes</span>
        </div>
      </div>

      {/* Metadata legal de la columna */}
      <div className="relative z-10 mt-space-md pt-space-xs flex items-center justify-between text-primary-fixed font-label-sm text-label-sm">
        <span>Tu información se queda en tu equipo</span>
        <span>© NovusPOS</span>
      </div>
    </div>
  )
}
