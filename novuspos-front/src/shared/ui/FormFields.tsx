import { useState, type ReactNode } from 'react'
import { MS } from './MS'

/**
 * Campos de formulario reutilizables. Mantienen el estilo MD3 del login
 * (icono a la izquierda, foco con anillo y error en rojo) para que todas
 * las pantallas se sientan iguales. No contienen lógica de red ni de dominio.
 */

const iconClass = 'absolute left-3 text-outline text-[20px] pointer-events-none'

const controlBase = (mono?: boolean) =>
  `w-full pl-10 rounded-lg bg-surface-container-low text-on-surface ${
    mono ? 'font-mono' : 'font-body-md'
  } text-body-md transition-all placeholder:text-outline-variant focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-70 disabled:cursor-not-allowed`

const controlClass = (tall: boolean | undefined, right: string, invalid: boolean, mono?: boolean, extra = '') =>
  `${controlBase(mono)} ${tall ? 'h-11' : 'h-10'} ${right} ${invalid ? 'ring-2 ring-error/50' : ''} ${extra}`
    .replace(/\s+/g, ' ')
    .trim()

export function FieldLabel({
  id,
  label,
  hint,
  action,
}: {
  id: string
  label: string
  hint?: string
  action?: ReactNode
}) {
  if (!hint && !action) {
    return (
      <label id={`${id}-label`} className="font-label-md text-label-md text-on-surface" htmlFor={id}>
        {label}
      </label>
    )
  }
  return (
    <div className="flex items-center justify-between gap-space-xs">
      <label id={`${id}-label`} className="font-label-md text-label-md text-on-surface" htmlFor={id}>
        {label}
      </label>
      {action ?? <span className="font-label-sm text-label-sm text-outline">{hint}</span>}
    </div>
  )
}

export function FieldError({ id, message }: { id?: string; message?: string }) {
  if (!message) return null
  return (
    <span id={id} className="font-body-sm text-body-sm text-error px-1" role="alert">
      {message}
    </span>
  )
}

interface FieldShellProps {
  id: string
  label: string
  hint?: string
  action?: ReactNode
  helper?: ReactNode
  error?: string
  children: ReactNode
}

/** Envoltura común: etiqueta, ayuda, control y mensaje de error. */
export function FieldShell({ id, label, hint, action, helper, error, children }: FieldShellProps) {
  return (
    <div className="flex flex-col gap-1">
      <FieldLabel id={id} label={label} hint={hint} action={action} />
      {children}
      {helper && !error && (
        <span id={`${id}-helper`} className="font-body-sm text-body-sm text-on-surface-variant px-1">
          {helper}
        </span>
      )}
      <FieldError id={`${id}-error`} message={error} />
    </div>
  )
}

function describedBy(id: string, error?: string, hasHelper?: boolean): string | undefined {
  const ids = [error && `${id}-error`, hasHelper && `${id}-helper`].filter(Boolean)
  return ids.length > 0 ? ids.join(' ') : undefined
}

interface TextFieldProps {
  id: string
  label: string
  icon: string
  type?: string
  placeholder?: string
  required?: boolean
  hint?: string
  action?: ReactNode
  helper?: ReactNode
  tall?: boolean
  mono?: boolean
  inputMode?: 'text' | 'numeric' | 'decimal' | 'tel' | 'email' | 'search' | 'url' | 'none'
  max?: string
  list?: string
  autoComplete?: string
  value?: string
  onChange?: (value: string) => void
  disabled?: boolean
  error?: string
}

/** Campo de texto con icono a la izquierda y estilo del login. */
export function TextField({
  id,
  label,
  icon,
  type = 'text',
  placeholder,
  required,
  hint,
  action,
  helper,
  tall,
  mono,
  inputMode,
  max,
  list,
  autoComplete,
  value,
  onChange,
  disabled,
  error,
}: TextFieldProps) {
  return (
    <FieldShell id={id} label={label} hint={hint} action={action} helper={helper} error={error}>
      <div className="relative flex items-center">
        <MS name={icon} className={iconClass} />
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          inputMode={inputMode}
          max={max}
          list={list}
          autoComplete={autoComplete}
          value={value}
          onChange={(event) => onChange?.(event.target.value)}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy(id, error, Boolean(helper))}
          className={controlClass(tall, 'pr-3', Boolean(error), mono)}
        />
      </div>
    </FieldShell>
  )
}

/** Campo de contraseña con botón para mostrar/ocultar. */
export function PasswordField({
  id,
  label,
  placeholder,
  required,
  hint,
  action,
  helper,
  tall,
  value,
  onChange,
  disabled,
  error,
}: Omit<TextFieldProps, 'icon' | 'type' | 'mono' | 'inputMode' | 'max' | 'list'>) {
  const [visible, setVisible] = useState(false)
  return (
    <FieldShell id={id} label={label} hint={hint} action={action} helper={helper} error={error}>
      <div className="relative flex items-center">
        <MS name="lock" className={iconClass} />
        <input
          id={id}
          type={visible ? 'text' : 'password'}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          value={value}
          onChange={(event) => onChange?.(event.target.value)}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy(id, error, Boolean(helper))}
          className={controlClass(tall, 'pr-10', Boolean(error))}
        />
        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          className="absolute right-3 text-outline hover:text-on-surface focus:outline-none"
          aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
        >
          <MS name={visible ? 'visibility_off' : 'visibility'} className="text-[20px]" />
        </button>
      </div>
    </FieldShell>
  )
}

interface SelectFieldProps {
  id: string
  label: string
  icon: string
  options: { value: string; label: string }[]
  hint?: string
  helper?: ReactNode
  tall?: boolean
  value?: string
  onChange?: (value: string) => void
  disabled?: boolean
  error?: string
}

/** Selector con icono a la izquierda y chevron a la derecha. */
export function SelectField({
  id,
  label,
  icon,
  options,
  hint,
  helper,
  tall,
  value,
  onChange,
  disabled,
  error,
}: SelectFieldProps) {
  return (
    <FieldShell id={id} label={label} hint={hint} helper={helper} error={error}>
      <div className="relative flex items-center">
        <MS name={icon} className={iconClass} />
        <select
          id={id}
          value={value}
          onChange={(event) => onChange?.(event.target.value)}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy(id, error, Boolean(helper))}
          className={controlClass(tall, 'pr-8 appearance-none cursor-pointer', Boolean(error))}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <MS name="expand_more" className="absolute right-3 text-outline text-[20px] pointer-events-none" />
      </div>
    </FieldShell>
  )
}
