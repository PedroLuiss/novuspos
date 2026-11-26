/** Configuración editable de la landing: la escribe el dueño y la consume el sitio público. */

export type LandingSectionId = 'features' | 'products' | 'comparison' | 'pricing' | 'faq' | 'finalCta'

export interface LandingSectionState {
  id: LandingSectionId
  visible: boolean
}

/** Colores MD3 que sobrescriben los tokens de Stitch en la vista previa y en la landing. */
export interface LandingTheme {
  primary: string
  primaryContainer: string
  secondary: string
  surface: string
  onSurface: string
}

export interface SectionHeading {
  eyebrow: string
  title: string
  description: string
}

export interface LandingFeature {
  id: string
  title: string
  description: string
  badge: string
}

export interface LandingFaq {
  id: string
  question: string
  answer: string
}

export interface LandingComparisonRow {
  capacity: string
  novuspos: string
  web: string
}

export interface LandingProductGroup {
  title: string
  description: string
  example: string
}

export interface LandingProductCapability {
  title: string
  description: string
}

export interface LandingProductVariety {
  category: string
  items: string[]
}

export interface LandingScreenshot {
  /** Ruta local, URL absoluta o data URL de una imagen subida por el dueño. */
  src: string
  /** Nombre del archivo subido; se usa solo en el editor. */
  name?: string
  alt: string
  fit: 'contain' | 'cover'
}

export interface LandingLogo {
  /** Ruta local, URL absoluta o data URL del logo subido por el dueño. */
  src: string
  /** Nombre del archivo subido; se usa solo en el editor. */
  name?: string
  alt: string
}

/** El encabezado y el pie pueden mostrar logos distintos. */
export interface LandingBranding {
  header: LandingLogo
  footer: LandingLogo
}

export interface LandingLinkColumn {
  title: string
  links: string[]
}

export interface LandingCopy {
  header: {
    features: string
    products: string
    pricing: string
    docs: string
    login: string
  }
  hero: {
    headlineLead: string
    headlineAccent: string
    headlineTail: string
    sloganLabel: string
    slogan: string
    description: string
    primaryCta: string
    primaryCtaNote: string
    secondaryCta: string
    /** Etiquetas de los sellos; los iconos se conservan fijos por posición. */
    trustBadges: string[]
  }
  features: SectionHeading & { items: LandingFeature[] }
  products: SectionHeading & {
    catalogTitle: string
    catalogDescription: string
    capabilitiesTitle: string
    capabilitiesDescription: string
    groups: LandingProductGroup[]
    varieties: LandingProductVariety[]
    capabilities: LandingProductCapability[]
  }
  comparison: SectionHeading & {
    capacityHeader: string
    novusposHeader: string
    webHeader: string
    rows: LandingComparisonRow[]
  }
  pricing: SectionHeading & {
    compatibility: string
    benefits: { strong: string; rest: string }[]
    cta: string
    ctaNote: string
    footnote: string
  }
  faq: SectionHeading & { items: LandingFaq[] }
  finalCta: SectionHeading & { button: string; note: string }
  footer: {
    description: string
    legal: string
    status: string
    currency: string
    columns: LandingLinkColumn[]
  }
}

export interface LandingConfig {
  theme: LandingTheme
  sections: LandingSectionState[]
  screenshots: LandingScreenshot[]
  logos: LandingBranding
  copy: LandingCopy
  updatedAt?: string
}
