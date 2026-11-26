import { useState } from 'react'
import type { LandingCopy } from '@/shared/services/landing/types'
import { MS } from '@/shared/ui/MS'
import { ComparisonPanel, PricingPanel, ProductsPanel } from './LandingComplexPanels'
import { FaqPanel, FeaturesPanel, FinalPanel, FooterPanel, HeaderPanel, HeroPanel } from './LandingSimplePanels'
import type { CopyPatch } from './landingPanelTypes'

type ContentPanel = 'inicio' | 'caracteristicas' | 'productos' | 'comparativa' | 'precios' | 'preguntas' | 'cierre' | 'pie'

const panels: { key: ContentPanel; label: string; icon: string }[] = [
  { key: 'inicio', label: 'Inicio', icon: 'home' },
  { key: 'caracteristicas', label: 'Características', icon: 'grid_view' },
  { key: 'productos', label: 'Productos', icon: 'inventory_2' },
  { key: 'comparativa', label: 'Comparativa', icon: 'compare' },
  { key: 'precios', label: 'Precios', icon: 'price_change' },
  { key: 'preguntas', label: 'Preguntas', icon: 'help' },
  { key: 'cierre', label: 'Cierre', icon: 'download' },
  { key: 'pie', label: 'Pie', icon: 'space_bar' },
]

/** Editor de textos por sección, con el mismo orden que el visitante ve en la landing. */
export function LandingContentEditor({ copy, patch }: { copy: LandingCopy; patch: CopyPatch }) {
  const [panel, setPanel] = useState<ContentPanel>('inicio')
  const props = { copy, patch }

  return (
    <div className="flex flex-col gap-space-sm">
      <div className="grid grid-cols-2 gap-1">
        {panels.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => setPanel(item.key)}
            aria-pressed={panel === item.key}
            className={`inline-flex items-center gap-1 rounded-lg px-space-xs py-2 font-label-sm text-label-sm font-semibold transition ${
              panel === item.key
                ? 'bg-primary text-on-primary shadow-sm'
                : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            <MS name={item.icon} className="text-[16px]" /> {item.label}
          </button>
        ))}
      </div>

      {panel === 'inicio' ? (
        <div className="flex flex-col gap-space-sm">
          <HeroPanel {...props} />
          <HeaderPanel {...props} />
        </div>
      ) : panel === 'caracteristicas' ? (
        <FeaturesPanel {...props} />
      ) : panel === 'productos' ? (
        <ProductsPanel {...props} />
      ) : panel === 'comparativa' ? (
        <ComparisonPanel {...props} />
      ) : panel === 'precios' ? (
        <PricingPanel {...props} />
      ) : panel === 'preguntas' ? (
        <FaqPanel {...props} />
      ) : panel === 'cierre' ? (
        <FinalPanel {...props} />
      ) : (
        <FooterPanel {...props} />
      )}
    </div>
  )
}
