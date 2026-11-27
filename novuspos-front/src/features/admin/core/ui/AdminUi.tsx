import type { ReactNode } from 'react'
import { MS } from '@/shared/ui/MS'
import { adminAvatar, adminCardPadded, adminEyebrow } from '@/features/admin/core/lib/adminStyles'

type Tone = 'neutral' | 'info' | 'success' | 'warning' | 'error'

const badgeTones: Record<Tone, string> = {
  neutral: 'bg-surface-container text-on-surface-variant',
  info: 'bg-primary-fixed/70 text-on-primary-fixed',
  success: 'bg-secondary-container text-on-secondary-container',
  warning: 'bg-[#fff3cd] text-[#7a5200]',
  error: 'bg-error-container text-on-error-container',
}

/** Cabecera homogénea para cada módulo del panel maestro. */
export function AdminPageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow: string
  title: string
  description: string
  actions?: ReactNode
}) {
  return (
    <div className="flex flex-col gap-space-sm md:flex-row md:items-end md:justify-between">
      <div className="flex flex-col gap-1">
        <span className={adminEyebrow}>{eyebrow}</span>
        <h1 className="font-headline-md text-headline-md text-on-surface font-bold tracking-tight">{title}</h1>
        <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">{description}</p>
      </div>
      {actions && <div className="flex flex-wrap items-center gap-space-xs">{actions}</div>}
    </div>
  )
}

/** Tarjeta base con cabecera opcional. */
export function AdminCard({
  title,
  description,
  icon,
  action,
  children,
  className = '',
}: {
  title?: string
  description?: string
  icon?: string
  action?: ReactNode
  children: ReactNode
  className?: string
}) {
  return (
    <section className={`${adminCardPadded} flex flex-col gap-space-md ${className}`}>
      {(title || action) && (
        <div className="flex items-start justify-between gap-space-sm">
          <div className="flex items-start gap-space-sm">
            {icon && (
              <span className="w-10 h-10 shrink-0 rounded-xl bg-primary-fixed/60 text-primary flex items-center justify-center">
                <MS name={icon} className="text-[20px]" />
              </span>
            )}
            <div className="flex flex-col">
              {title && <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface">{title}</h2>}
              {description && <p className="font-body-sm text-body-sm text-on-surface-variant">{description}</p>}
            </div>
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  )
}

/** Etiqueta de estado con color semántico. */
export function AdminBadge({ children, tone = 'neutral' }: { children: ReactNode; tone?: Tone }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-label-sm text-label-sm font-semibold ${badgeTones[tone]}`}>
      {children}
    </span>
  )
}

/** Iniciales del usuario, sin depender de imágenes externas. */
export function AdminAvatar({ name, tone = 'primary' }: { name: string; tone?: 'primary' | 'secondary' | 'neutral' }) {
  const tones = {
    primary: 'bg-primary-fixed text-on-primary-fixed',
    secondary: 'bg-secondary-container text-on-secondary-container',
    neutral: 'bg-surface-container-high text-on-surface-variant',
  }
  return (
    <span className={`w-9 h-9 shrink-0 rounded-full flex items-center justify-center font-label-md text-label-md font-bold ${tones[tone]}`}>
      {adminAvatar(name)}
    </span>
  )
}

export function AdminFilterChip({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full px-space-sm py-1.5 font-label-md text-label-md font-semibold transition ${
        active ? 'bg-primary text-on-primary shadow-sm' : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
      }`}
    >
      {label}
    </button>
  )
}

export function AdminAlert({ children, tone = 'error' }: { children: ReactNode; tone?: Tone }) {
  const icons: Record<Tone, string> = {
    neutral: 'info',
    info: 'info',
    success: 'check_circle',
    warning: 'warning',
    error: 'error',
  }
  return (
    <div role={tone === 'error' ? 'alert' : 'status'} className={`flex items-center gap-space-xs rounded-xl px-space-sm py-space-xs font-body-sm text-body-sm ${badgeTones[tone]}`}>
      <MS name={icons[tone]} className="text-[18px]" /> {children}
    </div>
  )
}

export function AdminState({ label, loading = false }: { label: string; loading?: boolean }) {
  return (
    <div className="flex items-center justify-center gap-space-xs py-space-xl font-body-md text-body-md text-on-surface-variant">
      <MS name={loading ? 'progress_activity' : 'inbox'} className={loading ? 'animate-spin text-primary text-xl' : 'text-[22px]'} />
      {label}
    </div>
  )
}

/** Contenedor de diálogo con encabezado y pie consistentes. */
export function AdminModal({
  title,
  subtitle,
  onClose,
  children,
  footer,
  wide = false,
}: {
  title: string
  subtitle?: string
  onClose: () => void
  children: ReactNode
  footer?: ReactNode
  wide?: boolean
}) {
  return (
    <div
      className="fixed inset-0 z-[80] bg-on-surface/50 backdrop-blur-sm flex items-center justify-center p-space-md"
      onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`max-h-[92vh] w-full overflow-y-auto rounded-2xl border border-outline-variant/40 bg-surface-container-lowest shadow-2xl flex flex-col ${wide ? 'max-w-4xl' : 'max-w-xl'}`}
      >
        <div className="flex items-start justify-between gap-space-sm border-b border-outline-variant/50 px-space-lg py-space-md">
          <div>
            <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface">{title}</h2>
            {subtitle && <p className="font-body-sm text-body-sm text-on-surface-variant">{subtitle}</p>}
          </div>
          <button type="button" onClick={onClose} aria-label="Cerrar" className="w-8 h-8 shrink-0 rounded-full bg-surface-container text-on-surface-variant flex items-center justify-center hover:text-error">
            <MS name="close" className="text-[18px]" />
          </button>
        </div>
        <div className="flex flex-col gap-space-md p-space-lg">{children}</div>
        {footer && <div className="flex flex-wrap items-center justify-end gap-space-xs border-t border-outline-variant/50 px-space-lg py-space-md">{footer}</div>}
      </div>
    </div>
  )
}

