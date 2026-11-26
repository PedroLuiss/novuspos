import type { LandingCopy, LandingFeature, LandingFaq, LandingLinkColumn, SectionHeading } from '@/shared/services/landing/types'
import { FieldGroup, LandingField } from './LandingField'
import { LandingListEditor } from './LandingListEditor'
import type { CopyPatch } from './landingPanelTypes'

interface PanelProps {
  copy: LandingCopy
  patch: CopyPatch
}

function HeadingFields({
  heading,
  onChange,
  withDescription = true,
}: {
  heading: SectionHeading
  onChange: (changes: SectionHeading) => void
  withDescription?: boolean
}) {
  return (
    <FieldGroup title="Textos de la sección" description="El título principal y la etiqueta superior.">
      <LandingField label="Etiqueta superior" value={heading.eyebrow} onChange={(eyebrow) => onChange({ ...heading, eyebrow })} />
      <LandingField label="Titular" value={heading.title} onChange={(title) => onChange({ ...heading, title })} />
      {withDescription && (
        <LandingField label="Descripción" multiline value={heading.description} onChange={(description) => onChange({ ...heading, description })} />
      )}
    </FieldGroup>
  )
}

export function HeaderPanel({ copy, patch }: PanelProps) {
  return (
    <FieldGroup title="Menú del sitio" description="Estos enlaces apuntan a las secciones visibles de la landing.">
      <LandingField label="Características" value={copy.header.features} onChange={(features) => patch('header', { features })} />
      <LandingField label="Productos" value={copy.header.products} onChange={(products) => patch('header', { products })} />
      <LandingField label="Precios" value={copy.header.pricing} onChange={(pricing) => patch('header', { pricing })} />
      <LandingField label="Documentación" value={copy.header.docs} onChange={(docs) => patch('header', { docs })} />
      <LandingField label="Acceso de clientes" value={copy.header.login} onChange={(login) => patch('header', { login })} />
    </FieldGroup>
  )
}

export function HeroPanel({ copy, patch }: PanelProps) {
  const hero = copy.hero
  return (
    <div className="flex flex-col gap-space-sm">
      <FieldGroup title="Titular principal" description="La parte destacada aparece en el color de la marca.">
        <LandingField label="Antes del destacado" value={hero.headlineLead} onChange={(headlineLead) => patch('hero', { headlineLead })} />
        <LandingField label="Texto destacado" value={hero.headlineAccent} onChange={(headlineAccent) => patch('hero', { headlineAccent })} />
        <LandingField label="Después del destacado" value={hero.headlineTail} onChange={(headlineTail) => patch('hero', { headlineTail })} />
      </FieldGroup>
      <FieldGroup title="Presentación">
        <LandingField label="Etiqueta del lema" value={hero.sloganLabel} onChange={(sloganLabel) => patch('hero', { sloganLabel })} />
        <LandingField label="Lema" value={hero.slogan} onChange={(slogan) => patch('hero', { slogan })} />
        <LandingField label="Descripción" multiline rows={5} value={hero.description} onChange={(description) => patch('hero', { description })} />
      </FieldGroup>
      <FieldGroup title="Botones y sellos de confianza">
        <LandingField label="Botón principal" value={hero.primaryCta} onChange={(primaryCta) => patch('hero', { primaryCta })} />
        <LandingField label="Nota del botón principal" value={hero.primaryCtaNote} onChange={(primaryCtaNote) => patch('hero', { primaryCtaNote })} />
        <LandingField label="Botón secundario" value={hero.secondaryCta} onChange={(secondaryCta) => patch('hero', { secondaryCta })} />
        <LandingField
          label="Sellos de confianza"
          value={hero.trustBadges.join('\n')}
          multiline
          rows={4}
          hint="Una etiqueta por línea; se muestran hasta cuatro."
          onChange={(value) => patch('hero', { trustBadges: value.split('\n').map((label) => label.trim()).filter(Boolean).slice(0, 4) })}
        />
      </FieldGroup>
    </div>
  )
}

export function FeaturesPanel({ copy, patch }: PanelProps) {
  const features = copy.features
  return (
    <div className="flex flex-col gap-space-sm">
      <HeadingFields heading={features} onChange={(next) => patch('features', next)} />
      <FieldGroup title="Tarjetas de características" description="El icono y el color de cada tarjeta se conservan.">
        <LandingListEditor
          items={features.items}
          columns={[
            { key: 'title', label: 'Título' },
            { key: 'description', label: 'Descripción', multiline: true },
            { key: 'badge', label: 'Frase destacada' },
          ]}
          create={(): LandingFeature => ({ id: `caracteristica-${Date.now()}`, title: 'Nueva característica', description: '', badge: '' })}
          addLabel="Agregar tarjeta"
          onChange={(items) => patch('features', { items })}
        />
      </FieldGroup>
    </div>
  )
}

export function FaqPanel({ copy, patch }: PanelProps) {
  const faq = copy.faq
  return (
    <div className="flex flex-col gap-space-sm">
      <HeadingFields heading={faq} onChange={(next) => patch('faq', next)} withDescription={false} />
      <FieldGroup title="Preguntas y respuestas">
        <LandingListEditor
          items={faq.items}
          columns={[
            { key: 'question', label: 'Pregunta' },
            { key: 'answer', label: 'Respuesta', multiline: true },
          ]}
          create={(): LandingFaq => ({ id: `pregunta-${Date.now()}`, question: 'Nueva pregunta', answer: '' })}
          addLabel="Agregar pregunta"
          onChange={(items) => patch('faq', { items })}
        />
      </FieldGroup>
    </div>
  )
}

export function FinalPanel({ copy, patch }: PanelProps) {
  const finalCta = copy.finalCta
  return (
    <div className="flex flex-col gap-space-sm">
      <HeadingFields heading={finalCta} onChange={(next) => patch('finalCta', next)} />
      <FieldGroup title="Botón de descarga">
        <LandingField label="Texto del botón" value={finalCta.button} onChange={(button) => patch('finalCta', { button })} />
        <LandingField label="Nota bajo el botón" value={finalCta.note} onChange={(note) => patch('finalCta', { note })} />
      </FieldGroup>
    </div>
  )
}

export function FooterPanel({ copy, patch }: PanelProps) {
  const footer = copy.footer
  return (
    <div className="flex flex-col gap-space-sm">
      <FieldGroup title="Presentación y línea legal">
        <LandingField label="Descripción" multiline value={footer.description} onChange={(description) => patch('footer', { description })} />
        <LandingField label="Aviso legal" value={footer.legal} onChange={(legal) => patch('footer', { legal })} />
        <LandingField label="Estado" value={footer.status} onChange={(status) => patch('footer', { status })} />
        <LandingField label="Moneda" value={footer.currency} onChange={(currency) => patch('footer', { currency })} />
      </FieldGroup>
      <FieldGroup title="Columnas de enlaces" description="Separa los enlaces con comas.">
        <LandingListEditor
          items={footer.columns}
          columns={[
            { key: 'title', label: 'Título' },
            { key: 'links', label: 'Enlaces', joined: true, multiline: true },
          ]}
          create={(): LandingLinkColumn => ({ title: 'Nueva columna', links: [] })}
          addLabel="Agregar columna"
          onChange={(columns) => patch('footer', { columns })}
        />
      </FieldGroup>
    </div>
  )
}
