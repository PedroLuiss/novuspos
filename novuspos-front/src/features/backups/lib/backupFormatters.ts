import { kindLabels } from '../data/backup-data'
import type { BackupRecord } from '../types'

/** Tamaño legible para el usuario, sin unidades internas. */
export function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return '—'
  const units = ['B', 'KB', 'MB', 'GB']
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1)
  const value = bytes / 1024 ** index
  return `${value.toLocaleString('es', { maximumFractionDigits: value < 10 ? 1 : 0 })} ${units[index]}`
}

export function formatBackupDate(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return '—'
  return new Intl.DateTimeFormat('es', { dateStyle: 'medium', timeStyle: 'short' }).format(date)
}

/** `datetime-local` usa la hora local del equipo, no UTC. */
export function toDateTimeLocalValue(date = new Date()): string {
  const offset = date.getTimezoneOffset() * 60_000
  return new Date(date.getTime() - offset).toISOString().slice(0, 16)
}

export function backupTitle(record: Pick<BackupRecord, 'kind' | 'createdAt'>): string {
  const date = new Date(record.createdAt)
  const day = Number.isNaN(date.getTime())
    ? ''
    : new Intl.DateTimeFormat('es', { day: 'numeric', month: 'short' }).format(date)
  return day ? `${kindLabels[record.kind]} · ${day}` : kindLabels[record.kind]
}

export function relativeDay(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return '—'
  const today = new Date()
  const start = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()
  const now = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime()
  const days = Math.round((now - start) / 86_400_000)
  if (days === 0) return 'Hoy'
  if (days === 1) return 'Ayer'
  return `Hace ${days} días`
}
