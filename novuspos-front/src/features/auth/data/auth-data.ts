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

export const businessSectors = [
  { value: 'abarrotes', label: 'Abarrotes y Minisúper' },
  { value: 'ferreteria', label: 'Ferretería y Materiales' },
  { value: 'supermercado', label: 'Supermercado / Almacén' },
  { value: 'farmacia', label: 'Farmacia y Droguería' },
  { value: 'ropa', label: 'Boutique y Moda' },
  { value: 'general', label: 'Comercio General' },
]

export const accessProfiles = [
  { value: 'cashier', label: 'Cajero (Predeterminado)' },
  { value: 'supervisor', label: 'Supervisor de turno' },
  { value: 'admin', label: 'Administrador / Gerencia' },
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
