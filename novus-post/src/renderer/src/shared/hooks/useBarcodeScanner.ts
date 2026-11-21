import { useCallback, useRef, useState } from 'react'
import type { ClipboardEvent, KeyboardEvent } from 'react'

export interface UseBarcodeScannerOptions {
  /** Se llama con el código completo cuando el lector termina la lectura. */
  onScan: (code: string) => void
  enabled?: boolean
  /** Longitud mínima para considerar una lectura válida. */
  minLength?: number
  /** Intervalo máximo entre teclas para considerar que viene de un lector. */
  interKeyDelayMs?: number
}

export interface BarcodeScannerBinding {
  /** True mientras llegan teclas en rápida sucesión (lectura en curso). */
  isReading: boolean
  onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void
  onPaste: (event: ClipboardEvent<HTMLInputElement>) => void
  onBlur: () => void
}

/**
 * Adaptador para lectores de código de barras que se comportan como teclado
 * (HID / "keyboard wedge"), que es la forma más común en puntos de venta.
 *
 * El lector escribe el código muy rápido y termina con Enter (algunos usan Tab).
 * Distinguimos esa lectura de la escritura manual por el intervalo entre teclas,
 * para no secuestrar el Enter del usuario. La escritura lenta sigue funcionando
 * con normalidad y se guarda con el botón correspondiente.
 */
export function useBarcodeScanner({
  onScan,
  enabled = true,
  minLength = 4,
  interKeyDelayMs = 60
}: UseBarcodeScannerOptions): BarcodeScannerBinding {
  const lastKeyAt = useRef(0)
  const isFast = useRef(false)
  const [isReading, setIsReading] = useState(false)

  const finish = useCallback(
    (code: string) => {
      lastKeyAt.current = 0
      isFast.current = false
      setIsReading(false)
      onScan(code.trim())
    },
    [onScan]
  )

  const onKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>): void => {
      if (!enabled || event.ctrlKey || event.altKey || event.metaKey) return

      if (event.key.length === 1) {
        const now = performance.now()
        if (lastKeyAt.current > 0 && now - lastKeyAt.current <= interKeyDelayMs) {
          if (!isFast.current) {
            isFast.current = true
            setIsReading(true)
          }
        }
        lastKeyAt.current = now
        return
      }

      if (event.key !== 'Enter' && event.key !== 'Tab') return

      const code = event.currentTarget.value.trim()
      if (!code || code.length < minLength) return

      const now = performance.now()
      const endedRapidly = lastKeyAt.current > 0 && now - lastKeyAt.current <= 500
      if (!isFast.current && !endedRapidly) return

      event.preventDefault()
      finish(code)
    },
    [enabled, finish, interKeyDelayMs, minLength]
  )

  const onPaste = useCallback(
    (event: ClipboardEvent<HTMLInputElement>): void => {
      if (!enabled) return
      const code = event.clipboardData.getData('text').trim()
      if (code.length < minLength || /[\r\n]/.test(code)) return
      event.preventDefault()
      finish(code)
    },
    [enabled, finish, minLength]
  )

  const onBlur = useCallback((): void => {
    lastKeyAt.current = 0
    isFast.current = false
    setIsReading(false)
  }, [])

  return { isReading, onKeyDown, onPaste, onBlur }
}
