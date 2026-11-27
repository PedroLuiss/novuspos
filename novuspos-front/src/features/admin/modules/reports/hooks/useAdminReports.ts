import { useCallback, useEffect, useRef, useState } from 'react'
import { adminService } from '@/features/admin/core/services/adminService'
import type { ReportPage, ReportPageSize, ReportQuery, ReportSourceFilter, ReportStatusFilter } from '../types'


const DEFAULT_QUERY: ReportQuery = { page: 1, pageSize: 20, search: '', source: 'all', status: 'all' }
const EMPTY_PAGE: ReportPage = {
  items: [],
  total: 0,
  page: 1,
  pageSize: 20,
  summary: { total: 0, open: 0, resolved: 0, web: 0, desktop: 0 },
}

/** Container del historial: el gateway filtra, ordena y corta; la vista solo renderiza la página. */
export function useAdminReports() {
  const [query, setQuery] = useState<ReportQuery>(DEFAULT_QUERY)
  const [result, setResult] = useState<ReportPage>(EMPTY_PAGE)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const requestRef = useRef(0)

  const beginLoad = useCallback(() => {
    setIsLoading(true)
    setError(null)
  }, [])

  const load = useCallback(async (next: ReportQuery) => {
    const request = ++requestRef.current
    try {
      const data = await adminService.listReports(next)
      if (request === requestRef.current) setResult(data)
    } catch {
      if (request === requestRef.current) setError('No pudimos cargar los reportes.')
    } finally {
      if (request === requestRef.current) setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void Promise.resolve().then(() => void load(query))
  }, [load, query])

  const patchFilters = useCallback((changes: Partial<ReportQuery>) => {
    beginLoad()
    setQuery((current) => ({ ...current, ...changes, page: changes.page ?? 1 }))
  }, [beginLoad])

  const setSearch = useCallback((search: string) => patchFilters({ search }), [patchFilters])
  const setSource = useCallback((source: ReportSourceFilter) => patchFilters({ source }), [patchFilters])
  const setStatus = useCallback((status: ReportStatusFilter) => patchFilters({ status }), [patchFilters])
  const setPageSize = useCallback((pageSize: ReportPageSize) => patchFilters({ pageSize }), [patchFilters])

  const setPage = useCallback((page: number) => {
    beginLoad()
    setQuery((current) => ({ ...current, page: Math.max(1, page) }))
  }, [beginLoad])

  const resetFilters = useCallback(() => {
    patchFilters({ search: '', source: 'all', status: 'all' })
  }, [patchFilters])

  const refresh = useCallback(() => {
    beginLoad()
    return load(query)
  }, [beginLoad, load, query])

  return {
    reports: result.items,
    total: result.total,
    page: result.page,
    pageSize: result.pageSize,
    totalPages: Math.max(1, Math.ceil(result.total / result.pageSize)),
    /** Conteos globales para las tarjetas, aunque el historial esté filtrado. */
    summary: result.summary,
    query,
    isLoading,
    error,
    setSearch,
    setSource,
    setStatus,
    setPageSize,
    setPage,
    resetFilters,
    refresh,
  }
}
