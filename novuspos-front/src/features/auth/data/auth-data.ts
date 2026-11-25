/** Contenido de la vista de auth (réplica del split de Stitch, copy auditado). */

export interface AuthBenefit {
  icon: string
  title: string
  description: string
}

export const authBenefits: AuthBenefit[] = [
  {
    icon: 'verified',
    title: 'Primer mes totalmente gratis ($0.00)',
    description: 'Sin tarjeta para empezar y sin comisiones sobre tus ventas.',
  },
  {
    icon: 'download_for_offline',
    title: 'Instalador Windows listo para descargar',
    description: 'Lectores de código de barras y básculas conectadas; tickets listos para imprimir o descargar.',
  },
  {
    icon: 'support_agent',
    title: 'Soporte y migración directa',
    description: 'Soporte desde la propia aplicación para ayudarte a poner tu catálogo en marcha.',
  },
]

/**
 * Tipos de comercio de pequeñas y medianas tiendas venezolanas.
 * Cada opción corresponde a una forma real en que novus-post maneja productos:
 * kg/litro con báscula, lotes con caducidad, variantes de talla/color,
 * combos, servicios y cuentas corrientes.
 */
export const businessSectors = [
  { value: 'abarrotes', label: 'Abarrotes y Minisúper' },
  { value: 'bodega', label: 'Bodega / Tienda de Barrio' },
  { value: 'supermercado', label: 'Supermercado / Almacén' },
  { value: 'ferreteria', label: 'Ferretería y Materiales' },
  { value: 'farmacia', label: 'Farmacia' },
  { value: 'panaderia', label: 'Panadería y Pastelería' },
  { value: 'fruteria', label: 'Frutería y Verdulería' },
  { value: 'carniceria', label: 'Carnicería y Pescadería' },
  { value: 'ropa', label: 'Boutique y Moda' },
  { value: 'calzado', label: 'Calzado y Accesorios' },
  { value: 'cosmeticos', label: 'Perfumería y Cosméticos' },
  { value: 'papeleria', label: 'Librería y Papelería' },
  { value: 'cafeteria', label: 'Cafetería y Repostería' },
  { value: 'general', label: 'Comercio General' },
]

export interface AuthTrustItem {
  icon: string
  tone: 'primary' | 'secondary'
  label: string
}

export const authTrustBar: AuthTrustItem[] = [
  { icon: 'desktop_windows', tone: 'primary', label: 'Windows 10 / 11 Nativo' },
  { icon: 'print', tone: 'primary', label: 'Tickets listos para imprimir' },
  { icon: 'wifi_off', tone: 'secondary', label: 'Modo Autónomo sin Internet' },
  { icon: 'backup', tone: 'primary', label: 'Respaldos de tu información' },
]
