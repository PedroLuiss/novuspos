/** Tasa de cambio del día: BCV real o, si falla, una tasa de referencia. */
export interface ExchangeRate {
  /** Bolívares por cada dólar estadounidense. */
  rate: number
  currency: 'USD'
  /** Fecha de la tasa (YYYY-MM-DD). */
  date: string
  /** Etiqueta de origen, por ejemplo BCV. */
  source?: string
  /** Verdadero cuando no se pudo consultar la fuente en línea. */
  fallback?: boolean
}
