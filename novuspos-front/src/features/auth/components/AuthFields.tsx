import { useState } from 'react'
import type { ReactNode } from 'react'
import { MS } from '@/shared/ui/MS'

const inputBase =
  'w-full pl-10 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all placeholder:text-outline-variant'

const leftIcon = 'absolute left-3 text-outline text-[20px] pointer-events-none'

function FieldLabel({ id, label, hint, action }: { id: string; label: string; hint?: string; action?: ReactNode }) {
  if (!hint && !action) {
    return (
      <label className="font-label-md text-label-md text-on-surface" htmlFor={id}>
        {label}
      </label>
    )
  }
  return (
    <div className="flex items-center justify-between">
      <label className="font-label-md text-label-md text-on-surface" htmlFor={id}>
        {label}
      </label>
      {action ?? <span className="font-label-sm text-label-sm text-outline">{hint}</span>}
    </div>
  )
}

interface TextFieldProps {
  id: string
  label: string
  icon: string
  type?: string
  placeholder: string
  required?: boolean
  hint?: string
  tall?: boolean
}

/** Campo de texto con icono a la izquierda (idéntico a Stitch). */
export function TextField({ id, label, icon, type = 'text', placeholder, required, hint, tall }: TextFieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <FieldLabel id={id} label={label} hint={hint} />
      <div className="relative flex items-center">
        <MS name={icon} className={leftIcon} />
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          required={required}
          className={`${inputBase} ${tall ? 'h-11' : 'h-10'} pr-3`}
        />
      </div>
    </div>
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
  tall,
}: Omit<TextFieldProps, 'icon' | 'type'> & { action?: ReactNode }) {
  const [visible, setVisible] = useState(false)
  return (
    <div className="flex flex-col gap-1">
      <FieldLabel id={id} label={label} hint={hint} action={action} />
      <div className="relative flex items-center">
        <MS name="lock" className={leftIcon} />
        <input
          id={id}
          type={visible ? 'text' : 'password'}
          placeholder={placeholder}
          required={required}
          className={`${inputBase} ${tall ? 'h-11' : 'h-10'} pr-10`}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute right-3 text-outline hover:text-on-surface focus:outline-none"
          aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
        >
          <MS name={visible ? 'visibility_off' : 'visibility'} className="text-[20px]" />
        </button>
      </div>
    </div>
  )
}

interface SelectFieldProps {
  id: string
  label: string
  icon: string
  options: { value: string; label: string }[]
  tall?: boolean
}

/** Selector con icono a la izquierda y chevron a la derecha. */
export function SelectField({ id, label, icon, options, tall }: SelectFieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <FieldLabel id={id} label={label} />
      <div className="relative flex items-center">
        <MS name={icon} className={leftIcon} />
        <select
          id={id}
          className={`${inputBase} ${tall ? 'h-11' : 'h-10'} pr-8 appearance-none cursor-pointer`}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <MS name="expand_more" className="absolute right-3 text-outline text-[20px] pointer-events-none" />
      </div>
    </div>
  )
}
