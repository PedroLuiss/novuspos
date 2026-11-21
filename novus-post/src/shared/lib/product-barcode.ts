import type { BarcodeFormat } from '@shared/contracts'

export const PRODUCT_BARCODE_FORMATS: readonly BarcodeFormat[] = [
  'EAN-13',
  'EAN-8',
  'UPC-A',
  'Code128',
  'Code39',
  'ITF-14',
  'OTRO'
]

const BARCODE_RE = /^[0-9A-Za-z-]+$/

function hasValidGs1CheckDigit(value: string): boolean {
  const digits = value.slice(0, -1).split('').map(Number)
  const firstWeight = digits.length % 2 === 0 ? 1 : 3
  const sum = digits.reduce(
    (total, digit, index) => total + digit * (index % 2 ? 4 - firstWeight : firstWeight),
    0
  )
  return (10 - (sum % 10)) % 10 === Number(value.at(-1))
}

function isValidFormatValue(value: string, format: BarcodeFormat): boolean {
  if (format === 'EAN-13') return /^\d{13}$/.test(value) && hasValidGs1CheckDigit(value)
  if (format === 'EAN-8') return /^\d{8}$/.test(value) && hasValidGs1CheckDigit(value)
  if (format === 'UPC-A') return /^\d{12}$/.test(value) && hasValidGs1CheckDigit(value)
  if (format === 'ITF-14') return /^\d{14}$/.test(value) && hasValidGs1CheckDigit(value)
  if (format === 'Code39') return /^[0-9A-Z.$/+% -]+$/.test(value)
  if (format === 'Code128') return /^[\x20-\x7E]+$/.test(value)
  return BARCODE_RE.test(value)
}

export function getProductBarcodeValidationError(
  value: string,
  format: BarcodeFormat
): string | null {
  if (!PRODUCT_BARCODE_FORMATS.includes(format)) {
    return 'Formato de código de barras no válido'
  }
  const normalizedValue = value.trim()
  if (!normalizedValue) return 'El código de barras es obligatorio'
  if (!isValidFormatValue(normalizedValue, format)) {
    const detail = isGs1Format(format) ? ' (revise la longitud y el dígito verificador)' : ''
    return `El código no es válido para el formato ${format}${detail}`
  }
  return null
}

function isGs1Format(format: BarcodeFormat): boolean {
  return format === 'EAN-13' || format === 'EAN-8' || format === 'UPC-A' || format === 'ITF-14'
}

/**
 * Infiere el formato más probable de un código leído por un escáner.
 *
 * Los formatos GS1 se distinguen por su longitud (y se validan después con el
 * dígito verificador). Para códigos internos se prefiere Code39 cuando el valor
 * usa su alfabeto restringido y Code128 cuando contiene caracteres de texto.
 * Devuelve `null` si no hay contenido.
 */
export function detectBarcodeFormat(value: string): BarcodeFormat | null {
  const code = value.trim()
  if (!code) return null

  if (/^\d{13}$/.test(code)) return 'EAN-13'
  if (/^\d{8}$/.test(code)) return 'EAN-8'
  if (/^\d{12}$/.test(code)) return 'UPC-A'
  if (/^\d{14}$/.test(code)) return 'ITF-14'

  if (/^[0-9A-Z.$/+% -]+$/.test(code) && /[A-Z.$/+%-]/.test(code)) return 'Code39'
  if (/^[\x20-\x7E]+$/.test(code)) return 'Code128'
  return 'OTRO'
}

/** Escapa los comodines de `LIKE` para buscar códigos de barras literalmente. */
export function escapeLikePattern(value: string): string {
  return value.replace(/[\\%_]/g, '\\$&')
}
