import type { ReactNode } from 'react'
import { Kbd } from '@/features/landing/components/Kbd'

export interface Feature {
  id: string
  icon: string
  iconTone: 'primary' | 'secondary' | 'neutral'
  title: string
  description: ReactNode
  badge: string
  badgeTone: 'primary' | 'secondary' | 'neutral'
}

export interface Shortcut {
  key: string
  keyVariant: 'primary' | 'surface' | 'secondary'
  ring?: 'primary' | 'secondary'
  title: string
  subtitle: string
  titleTone?: 'on-surface' | 'primary' | 'secondary'
}

export interface ComparisonRow {
  capacity: string
  novuspos: string
  /** Tono del texto en la columna NovusPOS. */
  novusposTone: 'secondary' | 'primary' | 'on-surface'
  /** La celda usa tipografía monoespaciada (valores numéricos). */
  novusposMono?: boolean
  /** La celda envuelve el texto en un `inline-flex` (filas con ✓). */
  novusposWrap?: boolean
  web: string
  webMono?: boolean
}

export interface Faq {
  icon: string
  iconTone: 'primary' | 'secondary' | 'neutral'
  question: string
  answer: string
}

/* Marcado inline idéntico a Stitch: los atajos usan `Kbd`. */

/**
 * Copy verificado contra `novus-post/docs/context/` (contextos 00, 02, 03, 04,
 * 05, 06 y 08). Se eliminaron claims de Stitch sin respaldo en el sistema real:
 * atajos F1-F7, latencia < 0.8ms, papelera de reciclaje, etiquetas DPI, CAS y
 * impresión de recibos de abono.
 */
export const features: Feature[] = [
  {
    id: 'terminal-ventas',
    icon: 'point_of_sale',
    iconTone: 'primary',
    title: 'Terminal de Ventas Ultra Rápida',
    description: (
      <>
        Búsqueda reactiva y paginada por nombre, código o código de barras, navegación de módulos con{' '}
        <Kbd>[ALT+1]</Kbd> a <Kbd>[ALT+7]</Kbd>, cobro en efectivo, tarjeta, mixto <Kbd>[F8]</Kbd> o crédito, y ventas
        en espera persistentes con <Kbd>[ALT+P]</Kbd> que se recuperan con <Kbd>[ALT+E]</Kbd>.
      </>
    ),
    badge: '⚡ Búsqueda paginada y cobro transaccional SQLite',
    badgeTone: 'primary',
  },
  {
    id: 'inventario',
    icon: 'table_view',
    iconTone: 'secondary',
    title: 'Inventario Denso Estilo Excel',
    description: (
      <>
        Grilla densa de 40px con paginación en SQLite, baja lógica (soft delete) que preserva el Kardex, entradas
        masivas <Kbd>[ALT+E]</Kbd>, salidas por merma <Kbd>[ALT+S]</Kbd> y etiquetas con 7 simbologías y medidas en mm.
      </>
    ),
    badge: '📦 Importación / Exportación .xlsx y CSV con BOM UTF-8',
    badgeTone: 'secondary',
  },
  {
    id: 'kardex',
    icon: 'history_edu',
    iconTone: 'neutral',
    title: 'Kardex de Auditoría Inmutable',
    description: (
      <>
        Libro mayor append-only con fecha/hora exacta, usuario responsable, motivo, lote y ticket de referencia.
        Ventas, combos, mermas y devoluciones quedan trazados sin borrar ni reescribir el historial; exportación a XLSX
        y PDF de todos los resultados filtrados.
      </>
    ),
    badge: '🛡 Cero manipulación o descuadre no autorizado',
    badgeTone: 'neutral',
  },
  {
    id: 'corte-z',
    icon: 'account_balance_wallet',
    iconTone: 'neutral',
    title: 'Corte Z & Ecuación de Caja',
    description: (
      <>
        Supervisión continua de la gaveta. El efectivo esperado es{' '}
        <em>Fondo Inicial + Ventas + Abonos + Ingresos manuales - Gastos - Devoluciones en efectivo</em>; tarjeta y
        crédito se excluyen del conteo. El cierre calcula sobrante o faltante en vivo al registrar el efectivo contado.
      </>
    ),
    badge: '💰 Cuadratura al céntimo en cada turno',
    badgeTone: 'neutral',
  },
  {
    id: 'basculas',
    icon: 'balance',
    iconTone: 'primary',
    title: 'Básculas Comerciales RS-232',
    description: (
      <>
        Lectura en vivo desde básculas Torrey, Rhino y Dibal por puerto serial, con puerto COM y baudios configurables
        y persistidos. El pesaje se captura sin digitar manualmente los gramos.
      </>
    ),
    badge: '⚖ Configuración de puerto COM y baudios persistida',
    badgeTone: 'primary',
  },
  {
    id: 'creditos',
    icon: 'badge',
    iconTone: 'secondary',
    title: 'Cuentas por Cobrar & Créditos',
    description: (
      <>
        Cartera integrada con límites de crédito validados al cobrar, indicadores automáticos de{' '}
        <strong className="text-error font-mono">DEUDOR</strong> o{' '}
        <strong className="text-secondary font-mono">AL DÍA</strong>, historial de compras fiadas y abonos que se
        aplican a las deudas más antiguas e impactan la caja del turno activo.
      </>
    ),
    badge: '💳 Abono con efecto inmediato en la gaveta del turno',
    badgeTone: 'secondary',
  },
]

/** Atajos reales del dashboard (00-MASTER §5): ALT+1…ALT+7 por módulo. */
export const shortcuts: Shortcut[] = [
  { key: 'ALT+1', keyVariant: 'primary', title: 'Punto de Venta', subtitle: 'Ir a la terminal' },
  { key: 'ALT+2', keyVariant: 'surface', title: 'Inventario', subtitle: 'Catálogo y existencia' },
  { key: 'ALT+3', keyVariant: 'surface', title: 'Kardex', subtitle: 'Historial y auditoría' },
  { key: 'ALT+4', keyVariant: 'surface', title: 'Caja', subtitle: 'Arqueo de efectivo' },
  { key: 'ALT+5', keyVariant: 'surface', title: 'Clientes', subtitle: 'Abonos y deudas' },
  {
    key: 'F12',
    keyVariant: 'primary',
    ring: 'primary',
    title: 'Cobro Estándar',
    subtitle: 'Modal de pago',
    titleTone: 'primary',
  },
  {
    key: 'ALT+Q',
    keyVariant: 'secondary',
    ring: 'secondary',
    title: 'Cobro Rápido',
    subtitle: '1-Click ticket directo',
    titleTone: 'secondary',
  },
]

/**
 * Copy verificado contra `novus-post/docs/context/` (00, 01, 02, 05 y 08).
 * Se eliminaron los claims sin respaldo: latencia en milisegundos y
 * "ESC/POS directo al puerto RAW" (la impresión física aún no está integrada).
 */
export const comparisonRows: ComparisonRow[] = [
  {
    capacity: 'Operatividad sin Internet',
    novuspos: '✓ Núcleo POS offline-first con SQLite local en modo WAL',
    novusposTone: 'secondary',
    novusposWrap: true,
    web: '× Se congela, no cobra o pierde el carrito',
  },
  {
    capacity: 'Respuesta del catálogo',
    novuspos: '✓ Búsqueda local paginada en SQLite (50 por página), sin viaje de red',
    novusposTone: 'primary',
    web: '× Depende de la latencia del servidor',
  },
  {
    capacity: 'Compatibilidad Báscula RS-232',
    novuspos: '✓ Lectura serial con puerto COM y baudios configurables (Torrey, Rhino, Dibal)',
    novusposTone: 'on-surface',
    novusposWrap: true,
    web: '× Requiere servidores puente locales o no es compatible',
  },
  {
    capacity: 'Documentos de venta (ticket/factura)',
    novuspos: '✓ PDF vectorial nativo 80mm/58mm/Carta con descarga directa',
    novusposTone: 'on-surface',
    novusposWrap: true,
    web: 'Abre molesta ventana flotante del navegador "Imprimir..."',
  },
  {
    capacity: 'Costo mensual recurrente',
    novuspos: 'Solo $4.99 USD / mes (1er mes Gratis)',
    novusposTone: 'secondary',
    web: '$29 a $79 USD / mes + cobros por terminal',
  },
]

export const faqs: Faq[] = [
  {
    icon: 'database',
    iconTone: 'primary',
    question: '¿Cómo garantiza NovusPOS que no se pierdan mis datos sin internet?',
    answer:
      'NovusPOS implementa un motor SQLite nativo en modo WAL (Write-Ahead Logging). Cada venta, cobro o ajuste de inventario se escribe de manera atómica e instantánea en el disco duro o SSD de tu computadora. Si se corta la energía o se desconecta la red, ningún registro queda a medias.',
  },
  {
    icon: 'settings_input_hdmi',
    iconTone: 'secondary',
    question: '¿Qué marcas de básculas comerciales e impresoras son compatibles?',
    answer:
      'Las ventas generan documentos PDF vectoriales nativos en formato ticket 80mm, ticket 58mm o carta, con descarga directa; la impresión térmica ESC/POS y el pulso de gaveta aún no están integrados. Las etiquetas se imprimen con el diálogo nativo de Windows (no ESC/POS ni ZPL). En básculas, la lectura en vivo por puerto RS-232 (COM y baudios configurables) está conectada para Torrey, Rhino y Dibal; la validación con hardware físico sigue pendiente.',
  },
  {
    icon: 'computer',
    iconTone: 'neutral',
    question: '¿Cuáles son los requisitos mínimos de sistema en Windows?',
    answer:
      'NovusPOS es una aplicación nativa para Windows (Electron de 64 bits) con interfaz Fluent/WinUI 3 y base de datos SQLite local, sin dependencia de un servidor en la fase monopuesto actual. La ventana principal se inicia maximizada y conserva un mínimo de 960 × 600 px para no perder la disposición del POS. No hay cifras oficiales documentadas de CPU, RAM o espacio en disco: el consumo de SQLite crece con el catálogo y los respaldos locales.',
  },
]

/** Catálogo del mockup del terminal (hero). */
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
  {
    sku: '#SKU-0019',
    stock: 'Stock: 48',
    name: 'Coca Cola 600ml Pet',
    desc: 'Refresco embotellado',
    price: '$18.50',
  },
  {
    sku: '#SKU-0044',
    stock: 'Stock: 120',
    name: 'Pan Blanco Bimbo Gde',
    desc: 'Panificación de caja',
    price: '$46.00',
  },
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
    name: 'Aguacate Hass (Báscula RS-232)',
    qty: '1.450 kg',
    unit: '$58.00',
    total: '$84.10',
    variant: 'bg-surface-container-lowest',
  },
  { name: 'Pan Blanco Bimbo Gde', qty: '1 unids', unit: '$46.00', total: '$46.00', variant: 'bg-surface-container-low' },
]

/** Captura del sistema mostrada en el carrusel del hero. */
export interface ScreenshotSlide {
  src: string
  alt: string
}

/**
 * Capturas del sistema NovusPOS (carpeta `public/imagen/`).
 * Agrega aquí más entradas con el mismo formato para activar el relevo entre
 * la imagen de arriba y la de abajo; el carrusel las alterna automáticamente.
 */
export const screenshots: ScreenshotSlide[] = [
  {
    src: '/imagen/novusposventa.png',
    alt: 'Terminal de ventas NovusPOS Desktop: catálogo, carrito, báscula RS-232 y cobro rápido',
  },
]
