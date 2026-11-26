/**
 * Compatibilidad con componentes que todavía importan este módulo.
 * La fuente de verdad del copy es `shared/services/landing/defaults.ts`:
 * el dueño la edita en `/administracion/landing`.
 */
import { LANDING_DEFAULTS } from '@/shared/services/landing/defaults'
import type {
  LandingComparisonRow,
  LandingFeature,
  LandingFaq,
  LandingProductCapability,
  LandingProductGroup,
  LandingProductVariety,
  LandingScreenshot,
} from '@/shared/services/landing/types'

export type Feature = LandingFeature
export type ComparisonRow = LandingComparisonRow
export type Faq = LandingFaq
export type ProductGroup = LandingProductGroup
export type ProductCapability = LandingProductCapability
export type ProductVariety = LandingProductVariety
export type ScreenshotSlide = LandingScreenshot

export const features = LANDING_DEFAULTS.copy.features.items
export const comparisonRows = LANDING_DEFAULTS.copy.comparison.rows
export const pricingBenefits = LANDING_DEFAULTS.copy.pricing.benefits
export const faqs = LANDING_DEFAULTS.copy.faq.items
export const productGroups = LANDING_DEFAULTS.copy.products.groups
export const productCapabilities = LANDING_DEFAULTS.copy.products.capabilities
export const productVarieties = LANDING_DEFAULTS.copy.products.varieties
export const screenshots = LANDING_DEFAULTS.screenshots

export interface Shortcut {
  key: string
  keyVariant: 'primary' | 'surface' | 'secondary'
  ring?: 'primary' | 'secondary'
  title: string
  subtitle: string
  titleTone?: 'on-surface' | 'primary' | 'secondary'
}

/** Atajos reales del escritorio (sección actualmente desactivada en la landing). */
export const shortcuts: Shortcut[] = [
  { key: 'ALT+1', keyVariant: 'primary', title: 'Punto de Venta', subtitle: 'Abrir el punto de venta' },
  { key: 'ALT+2', keyVariant: 'surface', title: 'Inventario', subtitle: 'Catálogo y existencia' },
  { key: 'ALT+3', keyVariant: 'surface', title: 'Kardex', subtitle: 'Historial y auditoría' },
  { key: 'ALT+4', keyVariant: 'surface', title: 'Caja', subtitle: 'Revisar tu caja' },
  { key: 'ALT+5', keyVariant: 'surface', title: 'Clientes', subtitle: 'Abonos y deudas' },
  {
    key: 'F12',
    keyVariant: 'primary',
    ring: 'primary',
    title: 'Cobro Estándar',
    subtitle: 'Ventana de cobro',
    titleTone: 'primary',
  },
  {
    key: 'ALT+Q',
    keyVariant: 'secondary',
    ring: 'secondary',
    title: 'Cobro Rápido',
    subtitle: 'Cobro en un clic',
    titleTone: 'secondary',
  },
]

export interface MockProduct {
  sku: string
  stock: string
  name: string
  desc: string
  price: string
  priceSuffix?: string
  active?: boolean
}

export const mockProducts: MockProduct[] = [
  { sku: '#SKU-0019', stock: 'Stock: 48', name: 'Coca Cola 600ml Pet', desc: 'Refresco embotellado', price: '$18.50' },
  { sku: '#SKU-0044', stock: 'Stock: 120', name: 'Pan Blanco Bimbo Gde', desc: 'Panificación de caja', price: '$46.00' },
  {
    sku: 'COM3 ACTIVO',
    stock: 'Báscula',
    name: 'Aguacate Hass Selección',
    desc: 'Pesaje en vivo (1.450 kg)',
    price: '$58.00',
    priceSuffix: '/kg',
    active: true,
  },
]

export interface MockCartRow {
  name: string
  qty: string
  unit: string
  total: string
  variant: 'bg-surface-container-low' | 'bg-surface-container-lowest'
}

export const mockCartRows: MockCartRow[] = [
  { name: 'Coca Cola 600ml Pet', qty: '2 unids', unit: '$18.50', total: '$37.00', variant: 'bg-surface-container-low' },
  {
    name: 'Aguacate Hass (báscula conectada)',
    qty: '1.450 kg',
    unit: '$58.00',
    total: '$84.10',
    variant: 'bg-surface-container-lowest',
  },
  { name: 'Pan Blanco Bimbo Gde', qty: '1 unids', unit: '$46.00', total: '$46.00', variant: 'bg-surface-container-lowest' },
]
