/** Errores HTTP tipados y normalización de formatos de validación. */

export type ValidationIssues = Record<string, string[]>

export class ApiError extends Error {
  readonly status: number
  readonly issues?: ValidationIssues

  constructor(status: number, message: string, issues?: ValidationIssues) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.issues = issues
  }
}

export class UnauthorizedError extends ApiError {
  constructor() {
    super(401, 'Tu sesión ha caducado. Vuelve a iniciar sesión.')
    this.name = 'UnauthorizedError'
  }
}

export class ValidationError extends ApiError {
  constructor(issues: ValidationIssues) {
    super(422, 'Revisa los campos marcados.', issues)
    this.name = 'ValidationError'
  }
}

/** Normaliza `detail[].loc/msg` de FastAPI y `errors` de Laravel/Express. */
export function toValidationIssues(payload: unknown): ValidationIssues {
  const issues: ValidationIssues = {}
  if (typeof payload !== 'object' || payload === null) return issues
  const record = payload as Record<string, unknown>

  if (Array.isArray(record.detail)) {
    for (const item of record.detail) {
      if (typeof item !== 'object' || item === null) continue
      const entry = item as { loc?: unknown[]; msg?: string }
      const field = Array.isArray(entry.loc) ? String(entry.loc[entry.loc.length - 1] ?? 'general') : 'general'
      const message = entry.msg ?? 'Valor no válido'
      issues[field] = [...(issues[field] ?? []), message]
    }
    return issues
  }

  if (typeof record.errors === 'object' && record.errors !== null) {
    for (const [field, value] of Object.entries(record.errors)) {
      issues[field] = Array.isArray(value) ? value.map(String) : [String(value)]
    }
  }
  return issues
}

export function toErrorMessage(payload: unknown, fallback: string): string {
  if (typeof payload === 'object' && payload !== null) {
    const record = payload as Record<string, unknown>
    for (const key of ['message', 'detail', 'error'] as const) {
      if (typeof record[key] === 'string') return record[key] as string
    }
  }
  return fallback
}
