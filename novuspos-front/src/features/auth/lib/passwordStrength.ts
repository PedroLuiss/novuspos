/** Reglas de contraseña y evaluación de fuerza: lógica pura, sin DOM. */

export interface PasswordChecks {
  length: boolean
  case: boolean
  number: boolean
  symbol: boolean
}

export interface PasswordStrength {
  checks: PasswordChecks
  score: number
  label: string
  labelClass: string
  bars: string[]
}

const BAR_EMPTY = 'h-1.5 flex-1 rounded-full bg-surface-container-highest transition-colors duration-300'
const BAR_WEAK = 'h-1.5 flex-1 rounded-full bg-error transition-colors duration-300'
const BAR_GOOD = 'h-1.5 flex-1 rounded-full bg-primary-container transition-colors duration-300'
const BAR_STRONG = 'h-1.5 flex-1 rounded-full bg-secondary transition-colors duration-300'

const LABEL_IDLE = 'font-label-sm text-label-sm text-on-surface-variant font-medium'
const LABEL_WEAK = 'font-label-sm text-label-sm text-error font-semibold'
const LABEL_GOOD = 'font-label-sm text-label-sm text-primary font-semibold'
const LABEL_STRONG = 'font-label-sm text-label-sm text-secondary font-bold'

export function getPasswordChecks(value: string): PasswordChecks {
  return {
    length: value.length >= 8,
    case: /[a-z]/.test(value) && /[A-Z]/.test(value),
    number: /[0-9]/.test(value),
    symbol: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(value),
  }
}

export function isStrongPassword(value: string): boolean {
  return Object.values(getPasswordChecks(value)).every(Boolean)
}

/** Réplica de la lógica visual del medidor de Stitch. */
export function analyzePassword(value: string): PasswordStrength {
  const checks = getPasswordChecks(value)
  const score = Object.values(checks).filter(Boolean).length

  if (value.length === 0) {
    return { checks, score, label: 'Requerida', labelClass: LABEL_IDLE, bars: [BAR_EMPTY, BAR_EMPTY, BAR_EMPTY, BAR_EMPTY] }
  }
  if (score <= 1) {
    return { checks, score, label: 'Débil', labelClass: LABEL_WEAK, bars: [BAR_WEAK, BAR_EMPTY, BAR_EMPTY, BAR_EMPTY] }
  }
  if (score === 2) {
    return { checks, score, label: 'Media', labelClass: LABEL_WEAK, bars: [BAR_WEAK, BAR_WEAK, BAR_EMPTY, BAR_EMPTY] }
  }
  if (score === 3) {
    return { checks, score, label: 'Buena', labelClass: LABEL_GOOD, bars: [BAR_GOOD, BAR_GOOD, BAR_GOOD, BAR_EMPTY] }
  }
  return { checks, score, label: 'Segura', labelClass: LABEL_STRONG, bars: [BAR_STRONG, BAR_STRONG, BAR_STRONG, BAR_STRONG] }
}
