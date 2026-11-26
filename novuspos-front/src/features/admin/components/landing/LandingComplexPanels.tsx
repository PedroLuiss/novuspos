import type { LandingCopy, LandingComparisonRow, LandingProductCapability, LandingProductGroup, LandingProductVariety, SectionHeading } from '@/shared/services/landing/types'
import { FieldGroup, LandingField } from './LandingField'
import { LandingListEditor } from './LandingListEditor'
import type { CopyPatch } from './landingPanelTypes'

interface PanelProps {
  copy: LandingCopy
  patch: CopyPatch
}

function HeadingFields({ heading, onChange }: { heading: SectionHeading; onChange: (changes: SectionHeading) => void }) {
  return (
    <FieldGroup title="Textos de la sección">
      <LandingField label="Etiqueta superior" value={heading.eyebrow} onChange={(eyebrow) => onChange({ ...heading, eyebrow })} />
      <LandingField label="Titular" value={heading.title} onChange={(title) => onChange({ ...heading, title })} />
      <LandingField label="Descripción" multiline value={heading.description} onChange={(description) => onChange({ ...heading, description })} />
    </FieldGroup>
  )
}

export function ProductsPanel({ copy, patch }: PanelProps) {
  const products = copy.products
  return (
    <div className="flex flex-col gap-space-sm">
      <HeadingFields heading={products} onChange={(next) => patch('products', next)} />
      <FieldGroup title="Bloques internos" description="Textos que aparecen entre las tarjetas de productos.">
        <LandingField label="Titular del catálogo de ejemplo" value={products.catalogTitle} onChange={(catalogTitle) => patch('products', { catalogTitle })} />
        <LandingField label="Descripción del catálogo" multiline value={products.catalogDescription} onChange={(catalogDescription) => patch('products', { catalogDescription })} />
        <LandingField label="Titular de datos de ficha" value={products.capabilitiesTitle} onChange={(capabilitiesTitle) => patch('products', { capabilitiesTitle })} />
        <LandingField label="Descripción de datos de ficha" multiline value={products.capabilitiesDescription} onChange={(capabilitiesDescription) => patch('products', { capabilitiesDescription })} />
      </FieldGroup>
      <FieldGroup title="Grupos de productos">
        <LandingListEditor
          items={products.groups}
          columns={[
            { key: 'title', label: 'Título' },
            { key: 'description', label: 'Descripción', multiline: true },
            { key: 'example', label: 'Ejemplos' },
          ]}
          create={(): LandingProductGroup => ({ title: 'Nuevo grupo', description: '', example: '' })}
          addLabel="Agregar grupo"
          onChange={(groups) => patch('products', { groups })}
        />
      </FieldGroup>
      <FieldGroup title="Categorías de ejemplo" description="Separa los productos con comas.">
        <LandingListEditor
          items={products.varieties}
          columns={[
            { key: 'category', label: 'Categoría' },
            { key: 'items', label: 'Productos', joined: true, multiline: true },
          ]}
          create={(): LandingProductVariety => ({ category: 'Nueva categoría', items: [] })}
          addLabel="Agregar categoría"
          onChange={(varieties) => patch('products', { varieties })}
        />
      </FieldGroup>
      <FieldGroup title="Datos que guarda cada ficha">
        <LandingListEditor
          items={products.capabilities}
          columns={[
            { key: 'title', label: 'Título' },
            { key: 'description', label: 'Descripción', multiline: true },
          ]}
          create={(): LandingProductCapability => ({ title: 'Nuevo dato', description: '' })}
          addLabel="Agregar dato"
          onChange={(capabilities) => patch('products', { capabilities })}
        />
      </FieldGroup>
    </div>
  )
}

export function ComparisonPanel({ copy, patch }: PanelProps) {
  const comparison = copy.comparison
  return (
    <div className="flex flex-col gap-space-sm">
      <HeadingFields heading={comparison} onChange={(next) => patch('comparison', next)} />
      <FieldGroup title="Cabeceras de la tabla">
        <LandingField label="Primera columna" value={comparison.capacityHeader} onChange={(capacityHeader) => patch('comparison', { capacityHeader })} />
        <LandingField label="Columna NovusPOS" value={comparison.novusposHeader} onChange={(novusposHeader) => patch('comparison', { novusposHeader })} />
        <LandingField label="Columna de comparación" value={comparison.webHeader} onChange={(webHeader) => patch('comparison', { webHeader })} />
      </FieldGroup>
      <FieldGroup title="Filas de la comparativa" description="Usa ✓ y × para marcar ventajas y diferencias.">
        <LandingListEditor
          items={comparison.rows}
          columns={[
            { key: 'capacity', label: 'Capacidad' },
            { key: 'novuspos', label: 'NovusPOS', multiline: true },
            { key: 'web', label: 'Otras opciones', multiline: true },
          ]}
          create={(): LandingComparisonRow => ({ capacity: 'Nueva capacidad', novuspos: '', web: '' })}
          addLabel="Agregar fila"
          onChange={(rows) => patch('comparison', { rows })}
        />
      </FieldGroup>
    </div>
  )
}

export function PricingPanel({ copy, patch }: PanelProps) {
  const pricing = copy.pricing
  return (
    <div className="flex flex-col gap-space-sm">
      <HeadingFields heading={pricing} onChange={(next) => patch('pricing', next)} />
      <FieldGroup title="Textos de los planes">
        <LandingField label="Compatibilidad" value={pricing.compatibility} onChange={(compatibility) => patch('pricing', { compatibility })} />
        <LandingField label="Botón de descarga" value={pricing.cta} onChange={(cta) => patch('pricing', { cta })} />
        <LandingField label="Nota del botón" value={pricing.ctaNote} onChange={(ctaNote) => patch('pricing', { ctaNote })} />
        <LandingField label="Nota final" value={pricing.footnote} onChange={(footnote) => patch('pricing', { footnote })} />
      </FieldGroup>
      <FieldGroup title="Beneficios de los planes" description="La parte destacada aparece en negrita y el resto continúa la frase.">
        <LandingListEditor
          items={pricing.benefits}
          columns={[
            { key: 'strong', label: 'Inicio en negrita' },
            { key: 'rest', label: 'Continuación' },
          ]}
          create={() => ({ strong: 'Nuevo beneficio', rest: '' })}
          addLabel="Agregar beneficio"
          onChange={(benefits) => patch('pricing', { benefits })}
        />
      </FieldGroup>
    </div>
  )
}
