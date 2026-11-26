/** Persistencia compartida de la landing en modo demo y normalización de la API. */
import { LANDING_DEFAULTS, SECTION_ORDER } from './defaults'
import type {
  LandingComparisonRow,
  LandingConfig,
  LandingBranding,
  LandingFeature,
  LandingFaq,
  LandingLinkColumn,
  LandingLogo,
  LandingProductCapability,
  LandingProductGroup,
  LandingProductVariety,
  LandingScreenshot,
  LandingSectionId,
  LandingSectionState,
  LandingTheme,
} from './types'

const KEY = 'novuspos:landing'

function record(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value) ? (value as Record<string, unknown>) : {}
}

function text(value: unknown, fallback: string): string {
  return typeof value === 'string' ? value : fallback
}

function color(value: unknown, fallback: string): string {
  const candidate = typeof value === 'string' ? value.trim() : ''
  return /^#[0-9a-f]{6}$/i.test(candidate) ? candidate : fallback
}

function textList(value: unknown, fallback: string[]): string[] {
  if (!Array.isArray(value)) return [...fallback]
  return value.filter((item): item is string => typeof item === 'string' && Boolean(item.trim())).map((item) => item.trim())
}

function list<T>(value: unknown, fallback: T[], normalize: (item: unknown, index: number) => T): T[] {
  if (!Array.isArray(value)) return fallback.map((item, index) => normalize(item, index))
  return value.map((item, index) => normalize(item, index))
}

function themeOf(value: unknown): LandingTheme {
  const source = record(value)
  const fallback = LANDING_DEFAULTS.theme
  return {
    primary: color(source.primary, fallback.primary),
    primaryContainer: color(source.primaryContainer, fallback.primaryContainer),
    secondary: color(source.secondary, fallback.secondary),
    surface: color(source.surface, fallback.surface),
    onSurface: color(source.onSurface, fallback.onSurface),
  }
}

function sectionsOf(value: unknown): LandingSectionState[] {
  const known = new Set<string>(SECTION_ORDER)
  const incoming = Array.isArray(value)
    ? value
        .map((item) => record(item).id)
        .filter((id): id is LandingSectionId => typeof id === 'string' && known.has(id))
    : []
  const ordered = [...new Set(incoming)]
  for (const id of SECTION_ORDER) if (!ordered.includes(id)) ordered.push(id)
  const states = new Map<string, boolean>()
  if (Array.isArray(value)) {
    for (const item of value) {
      const row = record(item)
      if (typeof row.id === 'string' && known.has(row.id)) states.set(row.id, row.visible !== false)
    }
  }
  return ordered.map((id) => ({ id, visible: states.get(id) !== false }))
}

function screenshotSrc(value: string, fallback: string): string {
  if (value.startsWith('/') && !value.startsWith('//')) return value
  if (/^https?:\/\/\S+$/i.test(value)) return value
  if (/^data:image\/(?:jpeg|png|webp);base64,/i.test(value)) return value
  return fallback
}

function screenshotsOf(value: unknown): LandingScreenshot[] {
  return list(value, LANDING_DEFAULTS.screenshots, (item, index) => {
    const row = record(item)
    const fallback = LANDING_DEFAULTS.screenshots[index] ?? { src: '', alt: '', fit: 'contain' as const }
    return {
      src: screenshotSrc(text(row.src, fallback.src).trim(), fallback.src),
      name: text(row.name, fallback.name ?? '') || undefined,
      alt: text(row.alt, fallback.alt),
      fit: row.fit === 'cover' ? 'cover' : 'contain',
    }
  })
}

function logoOf(value: unknown, fallback: LandingLogo): LandingLogo {
  const row = record(value)
  return {
    src: screenshotSrc(text(row.src, fallback.src).trim(), fallback.src),
    name: text(row.name, fallback.name ?? '') || undefined,
    alt: text(row.alt, fallback.alt),
  }
}

function logosOf(value: unknown): LandingBranding {
  const source = record(value)
  return {
    header: logoOf(source.header, LANDING_DEFAULTS.logos.header),
    footer: logoOf(source.footer, LANDING_DEFAULTS.logos.footer),
  }
}

function featureOf(item: unknown, index: number): LandingFeature {
  const row = record(item)
  const fallback = LANDING_DEFAULTS.copy.features.items[index]
  return {
    id: text(row.id, fallback?.id ?? `caracteristica-${index + 1}`),
    title: text(row.title, fallback?.title ?? ''),
    description: text(row.description, fallback?.description ?? ''),
    badge: text(row.badge, fallback?.badge ?? ''),
  }
}

function faqOf(item: unknown, index: number): LandingFaq {
  const row = record(item)
  const fallback = LANDING_DEFAULTS.copy.faq.items[index]
  return {
    id: text(row.id, fallback?.id ?? `pregunta-${index + 1}`),
    question: text(row.question, fallback?.question ?? ''),
    answer: text(row.answer, fallback?.answer ?? ''),
  }
}

function comparisonOf(item: unknown, index: number): LandingComparisonRow {
  const row = record(item)
  const fallback = LANDING_DEFAULTS.copy.comparison.rows[index]
  return {
    capacity: text(row.capacity, fallback?.capacity ?? ''),
    novuspos: text(row.novuspos, fallback?.novuspos ?? ''),
    web: text(row.web, fallback?.web ?? ''),
  }
}

function groupOf(item: unknown, index: number): LandingProductGroup {
  const row = record(item)
  const fallback = LANDING_DEFAULTS.copy.products.groups[index]
  return {
    title: text(row.title, fallback?.title ?? ''),
    description: text(row.description, fallback?.description ?? ''),
    example: text(row.example, fallback?.example ?? ''),
  }
}

function capabilityOf(item: unknown, index: number): LandingProductCapability {
  const row = record(item)
  const fallback = LANDING_DEFAULTS.copy.products.capabilities[index]
  return {
    title: text(row.title, fallback?.title ?? ''),
    description: text(row.description, fallback?.description ?? ''),
  }
}

function varietyOf(item: unknown, index: number): LandingProductVariety {
  const row = record(item)
  const fallback = LANDING_DEFAULTS.copy.products.varieties[index]
  return {
    category: text(row.category, fallback?.category ?? ''),
    items: textList(row.items, fallback?.items ?? []),
  }
}

function columnOf(item: unknown, index: number): LandingLinkColumn {
  const row = record(item)
  const fallback = LANDING_DEFAULTS.copy.footer.columns[index]
  return {
    title: text(row.title, fallback?.title ?? ''),
    links: textList(row.links, fallback?.links ?? []),
  }
}

/** Acepta localStorage, JSON de Laravel o un objeto parcial; nunca devuelve datos no serializables. */
export function normalizeLandingConfig(value: unknown): LandingConfig {
  const source = record(value)
  const copy = record(source.copy)
  const defaults = LANDING_DEFAULTS.copy
  const section = (name: keyof typeof defaults) => record(copy[name])
  const heading = (name: 'features' | 'products' | 'comparison' | 'pricing' | 'faq' | 'finalCta') => {
    const current = section(name)
    const fallback = defaults[name]
    return {
      eyebrow: text(current.eyebrow, fallback.eyebrow),
      title: text(current.title, fallback.title),
      description: text(current.description, fallback.description),
    }
  }
  const header = section('header')
  const hero = section('hero')
  const products = section('products')
  const comparison = section('comparison')
  const pricing = section('pricing')
  const footer = section('footer')

  return {
    theme: themeOf(source.theme),
    sections: sectionsOf(source.sections),
    screenshots: screenshotsOf(source.screenshots),
    logos: logosOf(source.logos),
    updatedAt: typeof source.updatedAt === 'string' ? source.updatedAt : undefined,
    copy: {
      header: {
        features: text(header.features, defaults.header.features),
        products: text(header.products, defaults.header.products),
        pricing: text(header.pricing, defaults.header.pricing),
        docs: text(header.docs, defaults.header.docs),
        login: text(header.login, defaults.header.login),
      },
      hero: {
        headlineLead: text(hero.headlineLead, defaults.hero.headlineLead),
        headlineAccent: text(hero.headlineAccent, defaults.hero.headlineAccent),
        headlineTail: text(hero.headlineTail, defaults.hero.headlineTail),
        sloganLabel: text(hero.sloganLabel, defaults.hero.sloganLabel),
        slogan: text(hero.slogan, defaults.hero.slogan),
        description: text(hero.description, defaults.hero.description),
        primaryCta: text(hero.primaryCta, defaults.hero.primaryCta),
        primaryCtaNote: text(hero.primaryCtaNote, defaults.hero.primaryCtaNote),
        secondaryCta: text(hero.secondaryCta, defaults.hero.secondaryCta),
        trustBadges: textList(hero.trustBadges, defaults.hero.trustBadges),
      },
      features: {
        ...heading('features'),
        items: list(section('features').items, defaults.features.items, featureOf),
      },
      products: {
        ...heading('products'),
        catalogTitle: text(products.catalogTitle, defaults.products.catalogTitle),
        catalogDescription: text(products.catalogDescription, defaults.products.catalogDescription),
        capabilitiesTitle: text(products.capabilitiesTitle, defaults.products.capabilitiesTitle),
        capabilitiesDescription: text(products.capabilitiesDescription, defaults.products.capabilitiesDescription),
        groups: list(products.groups, defaults.products.groups, groupOf),
        varieties: list(products.varieties, defaults.products.varieties, varietyOf),
        capabilities: list(products.capabilities, defaults.products.capabilities, capabilityOf),
      },
      comparison: {
        ...heading('comparison'),
        capacityHeader: text(comparison.capacityHeader, defaults.comparison.capacityHeader),
        novusposHeader: text(comparison.novusposHeader, defaults.comparison.novusposHeader),
        webHeader: text(comparison.webHeader, defaults.comparison.webHeader),
        rows: list(comparison.rows, defaults.comparison.rows, comparisonOf),
      },
      pricing: {
        ...heading('pricing'),
        compatibility: text(pricing.compatibility, defaults.pricing.compatibility),
        benefits: list(pricing.benefits, defaults.pricing.benefits, (item, index) => {
          const row = record(item)
          const fallback = defaults.pricing.benefits[index]
          return {
            strong: text(row.strong, fallback?.strong ?? ''),
            rest: text(row.rest, fallback?.rest ?? ''),
          }
        }),
        cta: text(pricing.cta, defaults.pricing.cta),
        ctaNote: text(pricing.ctaNote, defaults.pricing.ctaNote),
        footnote: text(pricing.footnote, defaults.pricing.footnote),
      },
      faq: {
        ...heading('faq'),
        items: list(section('faq').items, defaults.faq.items, faqOf),
      },
      finalCta: {
        ...heading('finalCta'),
        button: text(section('finalCta').button, defaults.finalCta.button),
        note: text(section('finalCta').note, defaults.finalCta.note),
      },
      footer: {
        description: text(footer.description, defaults.footer.description),
        legal: text(footer.legal, defaults.footer.legal),
        status: text(footer.status, defaults.footer.status),
        currency: text(footer.currency, defaults.footer.currency),
        columns: list(footer.columns, defaults.footer.columns, columnOf),
      },
    },
  }
}

export const landingStore = {
  read(): LandingConfig {
    try {
      const raw = window.localStorage.getItem(KEY)
      return raw ? normalizeLandingConfig(JSON.parse(raw)) : normalizeLandingConfig(LANDING_DEFAULTS)
    } catch {
      return normalizeLandingConfig(LANDING_DEFAULTS)
    }
  },
  write(config: LandingConfig): LandingConfig {
    const normalized = normalizeLandingConfig({ ...config, updatedAt: new Date().toISOString() })
    window.localStorage.setItem(KEY, JSON.stringify(normalized))
    return normalized
  },
  reset(): LandingConfig {
    return this.write(normalizeLandingConfig(LANDING_DEFAULTS))
  },
}
