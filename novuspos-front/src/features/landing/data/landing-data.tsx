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

export const features: Feature[] = [
  {
    id: 'terminal-ventas',
    icon: 'point_of_sale',
    iconTone: 'primary',
    title: 'Terminal de Ventas Ultra Rápida',
    description: (
      <>
        Búsqueda reactiva de productos por código o descripción, atajos de función F1-F7, cobro mixto (efectivo,
        tarjeta, crédito de tienda) y función de venta en espera con un toque vía <Kbd>[ALT+P]</Kbd>.
      </>
    ),
    badge: '⚡ Latencia por escaneo: < 0.8ms',
    badgeTone: 'primary',
  },
  {
    id: 'inventario',
    icon: 'table_view',
    iconTone: 'secondary',
    title: 'Inventario Denso Estilo Excel',
    description: (
      <>
        Control de stock en grilla editable rápida, papelera de reciclaje y soft delete, entradas directas{' '}
        <Kbd>[ALT+E]</Kbd>, salidas masivas <Kbd>[ALT+S]</Kbd> y generador de códigos de barras EAN-13/Code128 con
        etiquetas DPI configurables.
      </>
    ),
    badge: '📦 Importación / Exportación .xlsx instantánea',
    badgeTone: 'secondary',
  },
  {
    id: 'kardex',
    icon: 'history_edu',
    iconTone: 'neutral',
    title: 'Kardex de Auditoría Inmutable',
    description: (
      <>
        Rastro histórico segundo a segundo de cada unidad que entra, sale o se ajusta por merma. Nada se borra a
        espaldas del administrador: registro riguroso de usuario responsable, motivo de ajuste y exportación forense a
        Excel.
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
        Supervisión continua de la gaveta de dinero. La fórmula matemática es indiscutible:{' '}
        <em>Fondo Inicial + Ventas + Abonos - Gastos = Total Esperado</em>. Cierre ciego por cajero y alerta inmediata
        de faltantes o sobrantes.
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
        Driver universal nativo para protocolos seriales COM/USB. Compatibilidad probada y comprobada con básculas
        líderes: Torrey (L-EQ/PCR), Rhino (BAR-8), Dibal y CAS. Pesaje automático sin digitar manualmente los gramos.
      </>
    ),
    badge: '⚖ Lectura continua en puerto serial COM1-COM8',
    badgeTone: 'primary',
  },
  {
    id: 'creditos',
    icon: 'badge',
    iconTone: 'secondary',
    title: 'Cuentas por Cobrar & Créditos',
    description: (
      <>
        Cartera integrada de clientes con límites de crédito estrictos, indicadores automáticos de{' '}
        <strong className="text-error font-mono">DEUDOR</strong> o{' '}
        <strong className="text-secondary font-mono">AL DÍA</strong>, historial de compras fadas y recepción de abonos
        directos a la caja abierta.
      </>
    ),
    badge: '💳 Impresión de recibo de abono con saldo restante',
    badgeTone: 'secondary',
  },
]

export const shortcuts: Shortcut[] = [
  { key: 'F1', keyVariant: 'primary', title: 'Punto de Venta', subtitle: 'Regresar a la terminal' },
  { key: 'F2', keyVariant: 'surface', title: 'Inventario', subtitle: 'Catálogo y existencia' },
  { key: 'F3', keyVariant: 'surface', title: 'Kardex', subtitle: 'Historial y auditoría' },
  { key: 'F4', keyVariant: 'surface', title: 'Corte Z', subtitle: 'Arqueo de efectivo' },
  { key: 'F5', keyVariant: 'surface', title: 'Clientes', subtitle: 'Abonos y deudas' },
  {
    key: 'F12',
    keyVariant: 'primary',
    ring: 'primary',
    title: 'Cobro Mixto',
    subtitle: 'Modal de cobro',
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

export const comparisonRows: ComparisonRow[] = [
  {
    capacity: 'Operatividad sin Internet',
    novuspos: '✓ 100% Ininterrumpido (SQLite Local Nativo)',
    novusposTone: 'secondary',
    novusposWrap: true,
    web: '× Se congela, no cobra o pierde el carrito',
  },
  {
    capacity: 'Tiempo de respuesta por escaneo',
    novuspos: '~ 0.5 a 1.2 milisegundos',
    novusposTone: 'primary',
    novusposMono: true,
    web: '300ms a 2,500ms (depende de latencia de red)',
    webMono: true,
  },
  {
    capacity: 'Compatibilidad Báscula RS-232',
    novuspos: '✓ Conexión directa a puertos seriales COM nativos',
    novusposTone: 'on-surface',
    novusposWrap: true,
    web: '× Requiere servidores puente locales o no es compatible',
  },
  {
    capacity: 'Impresión Térmica de Tickets',
    novuspos: '✓ ESC/POS directo al puerto RAW sin diálogo de Windows',
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
      'NovusPOS Desktop es compatible con cualquier impresora térmica ESC/POS de 58mm u 80mm vía USB, Serial o Red (Epson, Bixolon, Xprinter, EC Line). En básculas comerciales, soporta comunicación continua y bajo demanda para Torrey (L-EQ, PCR), Rhino (BAR-8, BAR-9), Dibal, CAS y básculas genéricas con salida RS-232 o convertidor RS-232 a USB (CH340 / FTDI).',
  },
  {
    icon: 'computer',
    iconTone: 'neutral',
    question: '¿Cuáles son los requisitos mínimos de sistema en Windows?',
    answer:
      'Cualquier computadora con Windows 10 u 11 (64 bits), procesador Intel Core i3 o AMD equivalente (o posterior), 4 GB de memoria RAM y 250 MB de almacenamiento libre en disco. Funciona con pantallas táctiles, monitores convencionales y displays de cliente de 2 líneas VFD.',
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
