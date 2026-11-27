import type { EmailDraft, EmailPageSize } from './types'

export const EMAIL_PAGE_SIZES: readonly EmailPageSize[] = [20, 50, 100]

export const EMPTY_EMAIL_DRAFT: EmailDraft = { subject: '', html: '', audience: 'all' }

/** Plantilla opcional que el dueño puede insertar con un clic. */
export const EMAIL_TEMPLATE = [
  '<h2 style="font-size:20px;color:#0a1734;margin:0 0 12px;">Novedades para tu negocio</h2>',
  '<p style="font-size:14px;line-height:1.6;color:#41475b;margin:0 0 12px;">Hola,</p>',
  '<p style="font-size:14px;line-height:1.6;color:#41475b;margin:0 0 12px;">Escribe aquí el detalle de tu mensaje.</p>',
  '<p style="font-size:14px;line-height:1.6;color:#41475b;margin:0 0 12px;">Si quieres, resalta una novedad con negrita o agrega un enlace.</p>',
  '<p style="font-size:14px;line-height:1.6;color:#41475b;margin:24px 0 0;">Equipo NovusPOS</p>',
].join('')
