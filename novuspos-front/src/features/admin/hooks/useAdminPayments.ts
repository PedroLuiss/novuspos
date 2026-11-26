import { useCallback, useEffect, useRef, useState } from 'react'
import { adminService } from '../services/adminService'
import type { PaymentPage, PaymentPageSize, PaymentQuery, PaymentStatusFilter } from '../types'

export const PAYMENT_PAGE_SIZES: PaymentPageSize[] = [20, 50, 100]

const DEFAULT_QUERY: PaymentQuery = { page: 1, pageSize: 20, search: '', status: 'pending' }
const EMPTY_PAGE: PaymentPage = {
  items: [],
  total: 0,
  page: 1,
  pageSize: 20,
  summary: { pending: 0, approved: 0, rejected: 0, total: 0 },
}

/** Container de pagos: el gateway filtra, ordena y corta; la vista solo renderiza la página. */
export function useAdminPayments() {
  const [query, setQuery] = useState<PaymentQuery>(DEFAULT_QUERY)
  const [result, setResult] = useState<PaymentPage>(EMPTY_PAGE)
  const [isLoading, setIsLoading] = useState(true)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const requestRef = useRef(0)

  const beginLoad = useCallback(() => {
    setIsLoading(true)
    setError(null)
  }, [])

  const load = useCallback(async (next: PaymentQuery) => {
    const request = ++requestRef.current
    try {
      const data = await adminService.listPayments(next)
      if (request === requestRef.current) setResult(data)
    } catch {
      if (request === requestRef.current) setError('No pudimos cargar los pagos.')
    } finally {
      if (request === requestRef.current) setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void Promise.resolve().then(() => void load(query))
  }, [load, query])

  const patchFilters = useCallback((changes: Partial<PaymentQuery>) => {
    beginLoad()
    setQuery((current) => ({ ...current, ...changes, page: changes.page ?? 1 }))
  }, [beginLoad])

  const setSearch = useCallback((search: string) => patchFilters({ search }), [patchFilters])
  const setStatus = useCallback((status: PaymentStatusFilter) => patchFilters({ status }), [patchFilters])
  const setPageSize = useCallback((pageSize: PaymentPageSize) => patchFilters({ pageSize }), [patchFilters])

  const setPage = useCallback((page: number) => {
    beginLoad()
    setQuery((current) => ({ ...current, page: Math.max(1, page) }))
  }, [beginLoad])

  const resetFilters = useCallback(() => {
    patchFilters({ search: '', status: 'pending' })
  }, [patchFilters])

  const refresh = useCallback(() => {
    beginLoad()
    return load(query)
  }, [beginLoad, load, query])

  const review = useCallback(async (paymentId: string, approved: boolean, note?: string) => {
    setBusyId(paymentId)
    setError(null)
    try {
      await adminService.reviewPayment(paymentId, approved, note)
      beginLoad()
      await load(query)
      return true
    } catch {
      setError('No pudimos evaluar el pago. Inténtalo de nuevo.')
      return false
    } finally {
      setBusyId(null)
    }
  }, [beginLoad, load, query])

  return {
    payments: result.items,
    total: result.total,
    page: result.page,
    pageSize: result.pageSize,
    totalPages: Math.max(1, Math.ceil(result.total / result.pageSize)),
    /** Conteos globales para las tarjetas, aunque la tabla esté filtrada. */
    summary: result.summary,
    query,
    isLoading,
    busyId,
    error,
    setSearch,
    setStatus,
    setPageSize,
    setPage,
    resetFilters,
    refresh,
    review,
  }
}
