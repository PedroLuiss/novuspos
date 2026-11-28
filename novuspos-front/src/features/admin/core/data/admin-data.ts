import type {
  AdminEmail,
  AdminNotification,
  AdminPayment,
  AdminReport,
  AdminSettings,
  AdminUser,
} from '../types'
import { DEFAULT_ADMIN_SETTINGS } from '@/features/admin/core/lib/adminSettings'

function daysAgo(days: number): string {
  const date = new Date()
  date.setDate(date.getDate() - days)
  date.setHours(10, 30, 0, 0)
  return date.toISOString()
}

const receipt = `<svg xmlns="http://www.w3.org/2000/svg" width="420" height="260" viewBox="0 0 420 260">
<rect width="420" height="260" fill="#f7f9fb"/><rect x="24" y="20" width="372" height="220" rx="12" fill="#ffffff" stroke="#c3c5d9"/>
<text x="48" y="62" font-family="sans-serif" font-size="18" font-weight="bold" fill="#191c1e">Comprobante de pago</text>
<line x1="48" y1="80" x2="372" y2="80" stroke="#eceef0"/>
<text x="48" y="116" font-family="sans-serif" font-size="14" fill="#434656">Referencia</text>
<text x="48" y="150" font-family="monospace" font-size="22" font-weight="bold" fill="#003ec7">48291573</text>
<text x="48" y="188" font-family="sans-serif" font-size="14" fill="#434656">Banco de Venezuela · Transferencia</text>
<text x="48" y="216" font-family="sans-serif" font-size="13" fill="#434656">Monto: USD 4,99</text></svg>`

/** Comprobante de ejemplo dibujado en SVG; no apunta a archivos del usuario. */
export const demoProof = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(receipt)}`

export const demoUsers: AdminUser[] = [
  { id: 'u-1', name: 'Roberto Morales', email: 'roberto@abarrotesanjuan.com', businessName: 'Abarrotes San Juan', businessType: 'Abarrotes y Minisúper', planId: 'novus-mensual', planName: 'NovusPOS Mensual', subscriptionStatus: 'active', joinedAt: daysAgo(210), lastPaymentAt: daysAgo(4), openReports: 0 },
  { id: 'u-2', name: 'María González', email: 'maria@ferreteriaelcentro.com', businessName: 'Ferretería El Centro', businessType: 'Ferretería y Materiales', planId: 'novus-anual', planName: 'NovusPOS Anual', subscriptionStatus: 'active', joinedAt: daysAgo(150), lastPaymentAt: daysAgo(60), openReports: 1 },
  { id: 'u-3', name: 'Carlos Pérez', email: 'carlos@bodegaluz.com', businessName: 'Bodega La Luz', businessType: 'Bodega / Tienda de Barrio', planId: 'novus-mensual', planName: 'NovusPOS Mensual', subscriptionStatus: 'pending', joinedAt: daysAgo(45), lastPaymentAt: daysAgo(2), openReports: 0 },
  { id: 'u-4', name: 'Ana Rodríguez', email: 'ana@farmaciaviav.com', businessName: 'Farmavia', businessType: 'Farmacia', planId: 'novus-mensual', planName: 'NovusPOS Mensual', subscriptionStatus: 'expired', joinedAt: daysAgo(320), lastPaymentAt: daysAgo(48), openReports: 1 },
  { id: 'u-5', name: 'Luis Ramírez', email: 'luis@panaderiaelmolino.com', businessName: 'Panadería El Molino', businessType: 'Panadería y Pastelería', planId: 'novus-mensual', planName: 'NovusPOS Mensual', subscriptionStatus: 'active', joinedAt: daysAgo(90), lastPaymentAt: daysAgo(8), openReports: 0 },
  { id: 'u-6', name: 'Yusmary Díaz', email: 'yusmary@boutiquechic.com', businessName: 'Boutique Chic', businessType: 'Boutique y Moda', planId: 'novus-anual', planName: 'NovusPOS Anual', subscriptionStatus: 'active', joinedAt: daysAgo(200), lastPaymentAt: daysAgo(120), openReports: 0 },
  { id: 'u-7', name: 'José Herrera', email: 'jose@fruteriaverde.com', businessName: 'Frutería Verde', businessType: 'Frutería y Verdulería', planId: 'novus-mensual', planName: 'NovusPOS Mensual', subscriptionStatus: 'expired', joinedAt: daysAgo(130), lastPaymentAt: daysAgo(40), openReports: 1 },
  { id: 'u-8', name: 'Paula Méndez', email: 'paula@cafeteriaaroma.com', businessName: 'Cafetería Aroma', businessType: 'Cafetería y Repostería', planId: 'novus-mensual', planName: 'NovusPOS Mensual', subscriptionStatus: 'cancelled', joinedAt: daysAgo(400), lastPaymentAt: daysAgo(95), openReports: 0 },
]

export const demoPayments: AdminPayment[] = [
  { id: 'p-1', userId: 'u-3', userName: 'Carlos Pérez', planId: 'novus-mensual', planName: 'NovusPOS Mensual', method: 'transfer', reference: '48291573', bank: 'Banco de Venezuela', paidAt: daysAgo(1), amount: 4.99, currency: 'USD', status: 'pending', proofUrl: demoProof, createdAt: daysAgo(1) },
  { id: 'p-2', userId: 'u-4', userName: 'Ana Rodríguez', planId: 'novus-mensual', planName: 'NovusPOS Mensual', method: 'mobile', reference: '77120498', bank: 'Banesco', paidAt: daysAgo(2), amount: 4.99, currency: 'USD', status: 'pending', proofUrl: demoProof, createdAt: daysAgo(2) },
  { id: 'p-3', userId: 'u-1', userName: 'Roberto Morales', planId: 'novus-mensual', planName: 'NovusPOS Mensual', method: 'transfer', reference: '33918540', bank: 'Mercantil', paidAt: daysAgo(4), amount: 4.99, currency: 'USD', status: 'approved', proofUrl: demoProof, createdAt: daysAgo(4) },
  { id: 'p-4', userId: 'u-2', userName: 'María González', planId: 'novus-anual', planName: 'NovusPOS Anual', method: 'transfer', reference: '55667788', bank: 'BBVA Provincial', paidAt: daysAgo(60), amount: 59.99, currency: 'USD', status: 'approved', proofUrl: demoProof, createdAt: daysAgo(60) },
  { id: 'p-5', userId: 'u-5', userName: 'Luis Ramírez', planId: 'novus-mensual', planName: 'NovusPOS Mensual', method: 'mobile', reference: '90123456', bank: 'Banco del Tesoro', paidAt: daysAgo(8), amount: 4.99, currency: 'USD', status: 'approved', proofUrl: demoProof, createdAt: daysAgo(8) },
  { id: 'p-6', userId: 'u-7', userName: 'José Herrera', planId: 'novus-mensual', planName: 'NovusPOS Mensual', method: 'mobile', reference: '22334455', bank: 'Banesco', paidAt: daysAgo(40), amount: 4.99, currency: 'USD', status: 'rejected', proofUrl: demoProof, reviewNote: 'La referencia no aparece en el banco.', createdAt: daysAgo(40) },
]

export const demoReports: AdminReport[] = [
  { id: 'r-1', userId: 'u-2', userName: 'María González', subject: 'No aparece el cobro mixto', description: 'Al cobrar con efectivo y tarjeta, el ticket no muestra el desglose.', source: 'desktop', status: 'open', createdAt: daysAgo(1) },
  { id: 'r-2', userId: 'u-4', userName: 'Ana Rodríguez', subject: 'No puedo entrar a mi cuenta', description: 'El correo de recuperación no llega a mi bandeja.', source: 'web', status: 'open', createdAt: daysAgo(2) },
  { id: 'r-3', userId: 'u-7', userName: 'José Herrera', subject: 'La báscula no toma el peso', description: 'Al pesar frutas el campo queda en cero.', source: 'desktop', status: 'open', createdAt: daysAgo(3) },
  { id: 'r-4', userId: 'u-5', userName: 'Luis Ramírez', subject: 'Duda con los lotes', description: 'Quisiera saber cómo registrar el vencimiento de una harina.', source: 'web', status: 'resolved', createdAt: daysAgo(12) },
]

export const demoNotifications: AdminNotification[] = [
  { id: 'n-1', title: 'Novedades de NovusPOS', description: 'Ya puedes imprimir tickets en 58 mm desde la configuración.', link: '/panel', linkLabel: 'Ir al panel', icon: 'campaign', type: 'info', audience: 'all', audienceLabel: 'Todos los usuarios', createdAt: daysAgo(1) },
  { id: 'n-2', title: 'Tu suscripción está por vencer', description: 'Renueva para seguir usando todas las funciones.', link: '/panel/suscripcion', linkLabel: 'Ver suscripción', icon: 'schedule', type: 'warning', audience: 'u-4', audienceLabel: 'Ana Rodríguez', createdAt: daysAgo(3) },
]

export const demoEmails: AdminEmail[] = [
  {
    id: 'e-1',
    subject: 'Tu pago fue aprobado',
    body: '<h2 style="font-size:20px;color:#0a1734;margin:0 0 12px;">Pago aprobado</h2><p style="font-size:14px;line-height:1.6;color:#41475b;margin:0 0 12px;">Hola,</p><p style="font-size:14px;line-height:1.6;color:#41475b;margin:0 0 12px;">Revisamos tu comprobante y tu suscripción quedó activa.</p><p style="font-size:14px;line-height:1.6;color:#41475b;margin:24px 0 0;">Equipo NovusPOS</p>',
    bodyText: 'Pago aprobado. Hola, revisamos tu comprobante y tu suscripción quedó activa. Equipo NovusPOS',
    audience: 'u-1',
    audienceLabel: 'Roberto Morales',
    createdAt: daysAgo(4),
  },
  {
    id: 'e-2',
    subject: 'Mantenimiento programado',
    body: '<h2 style="font-size:20px;color:#0a1734;margin:0 0 12px;">Mantenimiento programado</h2><p style="font-size:14px;line-height:1.6;color:#41475b;margin:0 0 12px;">El portal estará en mantenimiento el domingo de 2 a 4 a. m.</p><p style="font-size:14px;line-height:1.6;color:#41475b;margin:24px 0 0;">Gracias por tu comprensión.</p>',
    bodyText: 'Mantenimiento programado. El portal estará en mantenimiento el domingo de 2 a 4 a. m. Gracias por tu comprensión.',
    audience: 'all',
    audienceLabel: 'Todos los usuarios',
    createdAt: daysAgo(7),
  },
]

export const demoSettings: AdminSettings = { ...DEFAULT_ADMIN_SETTINGS }
