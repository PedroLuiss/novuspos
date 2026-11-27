import type { ReactNode } from 'react'
import { adminInput } from '@/features/admin/core/lib/adminStyles'

interface FieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  hint?: string
  multiline?: boolean
  rows?: number
}

/** Campo de texto del constructor; los textareas conservan saltos de línea. */
export function LandingField({ label, value, onChange, hint, multiline, rows = 3 }: FieldProps) {
  return (
    <label className="flex flex-col gap-1">
      <span className="font-label-sm text-label-sm font-semibold text-on-surface-variant">{label}</span>
      {multiline ? (
        <textarea
          value={value}
          rows={rows}
          onChange={(event) => onChange(event.target.value)}
          className={`${adminInput} h-auto resize-y py-space-sm leading-relaxed`}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={adminInput}
        />
      )}
      {hint && <span className="font-body-sm text-body-sm text-outline">{hint}</span>}
    </label>
  )
}

/** Agrupa campos relacionados dentro de una pestaña del editor. */
export function FieldGroup({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-space-sm rounded-xl border border-outline-variant/50 bg-surface-container-low/40 p-space-sm">
      <div className="flex flex-col gap-0.5">
        <h3 className="font-label-md text-label-md font-bold text-on-surface">{title}</h3>
        {description && <p className="font-body-sm text-body-sm text-on-surface-variant">{description}</p>}
      </div>
      {children}
    </section>
  )
}
