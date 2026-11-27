import { useCallback, useEffect, useRef, useState } from 'react'
import { adminService } from '@/features/admin/core/services/adminService'
import type { UserPage, UserPageSize, UserPatch, UserQuery, UserStatusFilter } from '../types'


const DEFAULT_QUERY: UserQuery = { page: 1, pageSize: 20, search: '', status: 'all' }
const EMPTY_PAGE: UserPage = {
  items: [],
  total: 0,
  page: 1,
  pageSize: 20,
  summary: { active: 0, pending: 0, inactive: 0, total: 0 },
}

/** Container del directorio: el gateway filtra, ordena y corta; la vista solo renderiza la página. */
export function useAdminUsers() {
  const [query, setQuery] = useState<UserQuery>(DEFAULT_QUERY)
  const [result, setResult] = useState<UserPage>(EMPTY_PAGE)
  const [isLoading, setIsLoading] = useState(true)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const requestRef = useRef(0)

  const beginLoad = useCallback(() => {
    setIsLoading(true)
    setError(null)
  }, [])

  const load = useCallback(async (next: UserQuery) => {
    const request = ++requestRef.current
    try {
      const data = await adminService.listUsers(next)
      if (request === requestRef.current) setResult(data)
    } catch {
      if (request === requestRef.current) setError('No pudimos cargar los usuarios.')
    } finally {
      if (request === requestRef.current) setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void Promise.resolve().then(() => void load(query))
  }, [load, query])

  const patchFilters = useCallback((changes: Partial<UserQuery>) => {
    beginLoad()
    setQuery((current) => ({ ...current, ...changes, page: changes.page ?? 1 }))
  }, [beginLoad])

  const setSearch = useCallback((search: string) => patchFilters({ search }), [patchFilters])
  const setStatus = useCallback((status: UserStatusFilter) => patchFilters({ status }), [patchFilters])
  const setPageSize = useCallback((pageSize: UserPageSize) => patchFilters({ pageSize }), [patchFilters])

  const setPage = useCallback((page: number) => {
    beginLoad()
    setQuery((current) => ({ ...current, page: Math.max(1, page) }))
  }, [beginLoad])

  const resetFilters = useCallback(() => {
    patchFilters({ search: '', status: 'all' })
  }, [patchFilters])

  const refresh = useCallback(() => {
    beginLoad()
    return load(query)
  }, [beginLoad, load, query])

  const update = useCallback(async (userId: string, patch: UserPatch) => {
    setBusyId(userId)
    setError(null)
    try {
      await adminService.updateUser(userId, patch)
      beginLoad()
      await load(query)
      return true
    } catch {
      setError('No pudimos guardar los cambios.')
      return false
    } finally {
      setBusyId(null)
    }
  }, [beginLoad, load, query])

  const setSubscription = useCallback(async (userId: string, planId: string, active: boolean) => {
    setBusyId(userId)
    setError(null)
    try {
      await adminService.setSubscription(userId, planId, active)
      beginLoad()
      await load(query)
      return true
    } catch {
      setError('No pudimos actualizar la suscripción.')
      return false
    } finally {
      setBusyId(null)
    }
  }, [beginLoad, load, query])

  return {
    users: result.items,
    total: result.total,
    page: result.page,
    pageSize: result.pageSize,
    totalPages: Math.max(1, Math.ceil(result.total / result.pageSize)),
    /** Conteos globales para las tarjetas, aunque el directorio esté filtrado. */
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
    update,
    setSubscription,
  }
}
