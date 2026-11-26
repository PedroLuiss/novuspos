import { useCallback, useEffect, useRef, useState } from 'react'
import { adminService } from '../services/adminService'
import type { AdminEmail, EmailPage, EmailPageSize, EmailQuery } from '../types'

export type EmailInput = Omit<AdminEmail, 'id' | 'createdAt'>

const DEFAULT_QUERY: EmailQuery = { page: 1, pageSize: 20, search: '', audience: '' }
const EMPTY_PAGE: EmailPage = { items: [], total: 0, page: 1, pageSize: 20 }

/** Container del historial: deja el filtrado y el corte al gateway (demo o Laravel). */
export function useAdminEmails() {
  const [query, setQuery] = useState<EmailQuery>(DEFAULT_QUERY)
  const [result, setResult] = useState<EmailPage>(EMPTY_PAGE)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const requestRef = useRef(0)

  // Los cambios de filtro encienden el loader desde el evento, no desde el effect.
  const beginLoad = useCallback(() => {
    setIsLoading(true)
    setError(null)
  }, [])

  const load = useCallback(async (next: EmailQuery) => {
    const request = ++requestRef.current
    try {
      const data = await adminService.listEmails(next)
      if (request === requestRef.current) setResult(data)
    } catch {
      if (request === requestRef.current) setError('No pudimos cargar los correos.')
    } finally {
      if (request === requestRef.current) setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void Promise.resolve().then(() => void load(query))
  }, [load, query])

  const patchFilters = useCallback((changes: Partial<EmailQuery>) => {
    beginLoad()
    setQuery((current) => ({ ...current, ...changes, page: changes.page ?? 1 }))
  }, [beginLoad])

  const setSearch = useCallback((search: string) => patchFilters({ search }), [patchFilters])
  const setAudience = useCallback((audience: string) => patchFilters({ audience }), [patchFilters])
  const setPageSize = useCallback((pageSize: EmailPageSize) => patchFilters({ pageSize }), [patchFilters])

  const setPage = useCallback((page: number) => {
    beginLoad()
    setQuery((current) => ({ ...current, page: Math.max(1, page) }))
  }, [beginLoad])

  const resetFilters = useCallback(() => {
    patchFilters({ search: '', audience: '' })
  }, [patchFilters])

  const refresh = useCallback(() => {
    beginLoad()
    return load(query)
  }, [beginLoad, load, query])

  const send = useCallback(async (input: EmailInput) => {
    setIsSubmitting(true)
    setError(null)
    try {
      await adminService.createEmail(input)
      beginLoad()
      await load(query)
      return true
    } catch {
      setError('No pudimos registrar el correo.')
      return false
    } finally {
      setIsSubmitting(false)
    }
  }, [beginLoad, load, query])

  return {
    emails: result.items,
    total: result.total,
    page: result.page,
    pageSize: result.pageSize,
    totalPages: Math.max(1, Math.ceil(result.total / result.pageSize)),
    query,
    isLoading,
    isSubmitting,
    error,
    setSearch,
    setAudience,
    setPageSize,
    setPage,
    resetFilters,
    refresh,
    send,
  }
}
