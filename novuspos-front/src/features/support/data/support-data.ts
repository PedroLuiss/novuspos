import type { SupportDraft, SupportTopic } from '../types'

/** Temas disponibles en el formulario. */
export const supportTopics: { value: SupportTopic; label: string }[] = [
  { value: 'acceso', label: 'No puedo entrar a mi cuenta' },
  { value: 'instalacion', label: 'Instalación o actualización' },
  { value: 'ventas', label: 'Ventas o cobros' },
  { value: 'inventario', label: 'Productos e inventario' },
  { value: 'tickets', label: 'Tickets o báscula' },
  { value: 'otro', label: 'Otro problema' },
]

export const supportTips = [
  'Cuéntanos qué estabas haciendo cuando apareció el problema.',
  'Si puedes, indica desde qué parte del programa sucede.',
  'Escribe qué esperabas que pasara y qué pasó en cambio.',
]

/** Borrador inicial: el correo llega de la sesión del usuario. */
export function createEmptyDraft(email: string): SupportDraft {
  return { email, topic: '', subject: '', description: '' }
}
