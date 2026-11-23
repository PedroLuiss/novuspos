import { productCapabilities, productGroups } from '@/features/landing/data/landing-data'
import { MS } from './HeroHeader'

const iconToneClass: Record<string, string> = {
  primary: 'bg-primary-fixed text-primary',
  secondary: 'bg-secondary-fixed text-secondary',
  neutral: 'bg-surface-container-high text-on-surface',
}

/** Sección de productos: qué se puede dar de alta y qué guarda cada ficha. */
export function ProductCatalog() {
  return (
    <section id="productos" className="w-full px-margin py-space-xl max-w-7xl mx-auto">
      <div className="text-center max-w-3xl mx-auto mb-space-xl">
        <span className="font-label-sm text-label-sm text-primary uppercase font-bold tracking-widest block mb-space-xs">
          CATÁLOGO DE PRODUCTOS
        </span>
        <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight mb-space-sm">
          Cualquier producto tiene su lugar aquí
        </h2>
        <p className="font-body-lg text-body-lg text-on-surface-variant">
          Abarrotes, ropa, comida por peso, paquetes o servicios. Te contamos cómo puedes darlos de alta y qué datos
          guarda cada uno para que cobrar sea rápido.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-space-lg">
        {productGroups.map((group) => (
          <div
            key={group.title}
            className="p-space-lg rounded-xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-shadow flex flex-col"
          >
            <div
              className={`w-12 h-12 rounded-lg flex items-center justify-center mb-space-md ${iconToneClass[group.iconTone]}`}
            >
              <MS name={group.icon} className="text-[28px]" />
            </div>
            <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold mb-space-xs">{group.title}</h3>
            <p className="font-body-md text-body-md text-on-surface-variant mb-space-md">{group.description}</p>
            <div className="mt-auto p-space-sm rounded bg-surface-container-low font-mono text-label-sm text-on-surface-variant">
              {group.example}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-space-xl text-center max-w-3xl mx-auto mb-space-lg">
        <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold mb-space-xs">
          Cada ficha guarda lo que necesitas al cobrar
        </h3>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Estos datos se llenan una sola vez y después aparecen donde hacen falta: al buscar el producto, en el carrito
          y en el ticket.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-space-md">
        {productCapabilities.map((capability) => (
          <div
            key={capability.title}
            className="flex gap-space-sm p-space-md rounded-lg bg-surface-container-lowest border border-outline-variant/30"
          >
            <div className="w-10 h-10 shrink-0 rounded-lg flex items-center justify-center bg-primary-fixed text-primary">
              <MS name={capability.icon} className="text-[22px]" />
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
