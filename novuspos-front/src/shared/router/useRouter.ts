import { useSyncExternalStore } from 'react'
import { subscribe } from './navigation'

const readPathname = () => window.location.pathname
const readSearch = () => window.location.search

/** Pathname reactivo: `App` vuelve a resolver la ruta sin recargar. */
export function usePathname(): string {
  return useSyncExternalStore(subscribe, readPathname, () => '/')
}

/** Query string reactiva, necesaria para enlaces de recuperación. */
export function useSearch(): string {
  return useSyncExternalStore(subscribe, readSearch, () => '')
}
