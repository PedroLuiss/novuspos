import type { UserPageSize, UserStatusFilter, UserSummary } from './types'

export const USER_PAGE_SIZES: readonly UserPageSize[] = [20, 50, 100]

export const USER_STATUS_OPTIONS: readonly { value: UserStatusFilter; label: string }[] = [
  { value: 'all', label: 'Todos los estados' },
  { value: 'active', label: 'Activas' },
  { value: 'pending', label: 'Pendientes' },
  { value: 'expired', label: 'Vencidas' },
  { value: 'cancelled', label: 'Canceladas' },
]

export interface UserSummaryCard {
  label: string
  key: keyof UserSummary
  icon: string
  tone: string
  bg: string
}

export const USER_SUMMARY_CARDS: readonly UserSummaryCard[] = [
  { label: 'Suscripciones activas', key: 'active', icon: 'verified_user', tone: 'text-secondary', bg: 'bg-secondary-container/50' },
  { label: 'Pago en revisión', key: 'pending', icon: 'pending_actions', tone: 'text-[#a86a00]', bg: 'bg-[#fff8e8]' },
  { label: 'Sin suscripción al día', key: 'inactive', icon: 'person_off', tone: 'text-error', bg: 'bg-error-container/60' },
]
