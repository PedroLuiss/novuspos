import type { ReactNode } from 'react'

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

/**
 * Copy centrado en beneficios para quien usa el sistema: explica qué se puede
 * hacer, sin exponer detalles internos de almacenamiento ni de hardware.
 * Verificado contra `novus-post/docs/context/` (00, 02, 03, 04, 05, 06 y 08).
 */
export const features: Feature[] = [
  {
    id: 'terminal-ventas',
    icon: 'point_of_sale',
    iconTone: 'primary',
    title: 'Terminal de Ventas',
    description: (
      <>
        Encuentra productos por nombre, código o código de barras y cobra en efectivo, tarjeta, mixto o crédito. Deja
        ventas en espera para retomarlas después y cambia de módulo con un atajo sin perder el ritmo.
      </>
    ),
    badge: '⚡ Búsqueda rápida y cobro sin complicaciones',
    badgeTone: 'primary',
  },
  {
    id: 'inventario',
    icon: 'table_view',
    iconTone: 'secondary',
    title: 'Inventario claro y al día',
    description: (
      <>
        Consulta existencias y precios en una tabla fácil de leer. Registra entradas de mercancía, mermas y prepara
        etiquetas desde la misma pantalla, sin perder el historial de tus productos.
      </>
    ),
    badge: '📦 Importa y exporta tu catálogo desde Excel o CSV',
    badgeTone: 'secondary',
  },
  {
    id: 'kardex',
    icon: 'history_edu',
    iconTone: 'neutral',
    title: 'Historial de cada producto',
    description: (
      <>
        Cada entrada, salida, venta o devolución queda registrada con fecha, usuario y motivo. Consulta el historial
        completo de tus productos y expórtalo a Excel o PDF cuando lo necesites.
      </>
    ),
    badge: '🛡 Información clara para tu auditoría',
    badgeTone: 'neutral',
  },
  {
    id: 'corte-z',
    icon: 'account_balance_wallet',
    iconTone: 'neutral',
    title: 'Cierre de caja sin sorpresas',
    description: (
      <>
        Compara lo que debería haber en tu caja con lo que contaste y ve de inmediato si hay sobrante o faltante.
        Incluye ventas, abonos, ingresos y gastos del turno para que cierres con tranquilidad.
      </>
    ),
    badge: '💰 Cuadratura clara en cada turno',
    badgeTone: 'neutral',
  },
  {
    id: 'basculas',
    icon: 'balance',
    iconTone: 'primary',
    title: 'Básculas conectadas',
    description: (
      <>
        Toma el peso directamente en la venta, sin digitar los gramos. Compatible con básculas Torrey, Rhino y Dibal;
        la conexión se configura una sola vez y queda lista para cada venta por kilo.
      </>
    ),
    badge: '⚖ Peso automático para ventas por kilo',
    badgeTone: 'primary',
  },
  {
    id: 'creditos',
    icon: 'badge',
    iconTone: 'secondary',
    title: 'Clientes y créditos',
    description: (
      <>
        Conoce de un vistazo el saldo, el límite y los abonos de quienes compran a crédito. Los pagos se aplican a las
        deudas más antiguas y se reflejan de inmediato en la caja de tu turno.
      </>
    ),
    badge: '💳 Cobros visibles al instante en tu caja',
    badgeTone: 'secondary',
  },
]

/** Atajos reales del dashboard (00-MASTER §5): ALT+1…ALT+7 por módulo. */
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

/** Comparativa en beneficios para el negocio, sin detalles técnicos internos. */
export const comparisonRows: ComparisonRow[] = [
  {
    capacity: 'Trabajo sin internet',
    novuspos: '✓ Cobra y consulta tu catálogo aunque no haya conexión',
    novusposTone: 'secondary',
    novusposWrap: true,
    web: '× Depende de la conexión para cobrar',
  },
  {
    capacity: 'Velocidad al buscar productos',
    novuspos: '✓ Encuentra productos al instante en tu computadora',
    novusposTone: 'primary',
    web: '× Depende de la velocidad de la red',
  },
  {
    capacity: 'Básculas conectadas',
    novuspos: '✓ Toma el peso de tu báscula sin digitarlo',
    novusposTone: 'on-surface',
    novusposWrap: true,
    web: '× Requiere equipos adicionales o no es compatible',
  },
  {
    capacity: 'Tickets y documentos de venta',
    novuspos: '✓ Tickets en 80 mm, 58 mm o carta, listos para descargar',
    novusposTone: 'on-surface',
    novusposWrap: true,
    web: 'Abre una ventana de impresión del navegador',
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
    question: '¿Puedo seguir trabajando si no hay internet?',
    answer:
      'Sí. Ventas, cobros y ajustes quedan registrados al momento y siguen disponibles cuando vuelves a abrir el programa. Puedes cobrar, consultar tu inventario y hacer tu corte sin depender de la conexión. Solo el acceso inicial, la recuperación de clave y las tasas de cambio necesitan internet.',
  },
  {
    icon: 'settings_input_hdmi',
    iconTone: 'secondary',
    question: '¿Puedo conectar mi báscula y tener mis tickets listos?',
    answer:
      'Sí. Puedes tomar el peso de básculas Torrey, Rhino y Dibal directamente en la venta, y descargar tus tickets en 80 mm, 58 mm o tamaño carta. Todo se configura desde la propia aplicación.',
  },
  {
    icon: 'computer',
    iconTone: 'neutral',
    question: '¿Qué necesito para empezar?',
    answer:
      'NovusPOS funciona en Windows 10 y Windows 11 (en computadoras de 64 bits), así que no necesitas la versión más reciente para empezar. Solo necesitas internet para descargar el instalador e iniciar sesión la primera vez; después puedes trabajar sin conexión. El programa se abre maximizado y funciona cómodamente desde 960 × 600 px.',
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
    name: 'Aguacate Hass (báscula conectada)',
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
  /** `cover` para capturas más altas que el contenedor 5:4 (recorta abajo). */
  fit?: 'contain' | 'cover'
}

/**
 * Capturas del sistema NovusPOS (carpeta `public/imagen/`), en orden de módulo:
 * ventas → productos → Kardex → caja → clientes. El carrusel las alterna cada
 * 4s; agrega más entradas con el mismo formato para ampliar la rotación.
 */
export const screenshots: ScreenshotSlide[] = [
  {
    src: '/imagen/novusposventa.png',
    alt: 'Terminal de ventas NovusPOS Desktop: catálogo, carrito, báscula conectada y cobro rápido',
  },
  {
    src: '/imagen/novuspos_producto.png',
    alt: 'Módulo de productos NovusPOS Desktop: catálogo e inventario con stock y precios',
  },
  {
    src: '/imagen/novuspos_kardex.png',
    alt: 'Módulo de Kardex NovusPOS Desktop: auditoría y trazabilidad de movimientos de inventario',
  },
  {
    src: '/imagen/novus_caja.png',
    alt: 'Módulo de caja NovusPOS Desktop: turno, arqueo de efectivo y corte Z',
    fit: 'cover',
  },
  {
    src: '/imagen/novus_cliente.png',
    alt: 'Módulo de clientes NovusPOS Desktop: directorio, créditos y abonos',
  },
]
