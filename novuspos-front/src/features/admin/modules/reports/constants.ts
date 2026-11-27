import type { ReportPageSize, ReportSourceFilter, ReportStatusFilter, ReportSummary } from './types'

export const REPORT_PAGE_SIZES: readonly ReportPageSize[] = [20, 50, 100]

export const REPORT_SOURCE_OPTIONS: readonly { value: ReportSourceFilter; label: string }[] = [
  { value: 'all', label: 'Todos' },
  { value: 'web', label: 'Portal' },
  { value: 'desktop', label: 'Escritorio' },
]

export const REPORT_STATUS_OPTIONS: readonly { value: ReportStatusFilter; label: string }[] = [
  { value: 'all', label: 'Todos' },
  { value: 'open', label: 'Abiertos' },
  { value: 'resolved', label: 'Atendidos' },
]

export interface ReportSummaryCard {
  label: string
  key: keyof ReportSummary
  icon: string
  tone: string
  bg: string
}

export const REPORT_SUMMARY_CARDS: readonly ReportSummaryCard[] = [
  { label: 'Reportes recibidos', key: 'total', icon: 'report_problem', tone: 'text-primary', bg: 'bg-primary-fixed/50' },
  { label: 'Abiertos', key: 'open', icon: 'pending_actions', tone: 'text-[#a86a00]', bg: 'bg-[#fff8e8]' },
  { label: 'Desde el escritorio', key: 'desktop', icon: 'desktop_windows', tone: 'text-secondary', bg: 'bg-secondary-container/50' },
]
