/** Tasa de cambio del día, tal como la expone la API de Laravel. */
export interface ExchangeRate {
  /** Bolívares por cada dólar estadounidense. */
  rate: number
  currency: 'USD'
  /** Fecha de la tasa (YYYY-MM-DD). */
  date: string
  /** Etiqueta de origen, por ejemplo BCV. */
  source?: string
}
