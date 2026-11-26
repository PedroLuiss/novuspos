/** Router mínimo de la web: cambia de vista sin recargar el documento. */

type Listener = () => void
export interface NavigateOptions {
  replace?: boolean
}

const listeners = new Set<Listener>()

function notify(): void {
  listeners.forEach((listener) => listener())
}

function scrollToHash(hash: string): void {
  const id = decodeURIComponent(hash.slice(1))
  window.requestAnimationFrame(() => {
    let target = document.getElementById(id)
    if (!target) {
      try {
        target = document.querySelector(hash)
      } catch {
        target = null
      }
    }
    target?.scrollIntoView({ behavior: 'smooth' })
  })
}

/** Suscripción usada por `useSyncExternalStore` para pathname y query. */
export function subscribe(listener: Listener): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

if (typeof window !== 'undefined') {
  window.addEventListener('popstate', notify)
}

/** Navegación interna: `pushState`/`replaceState` + notificación a la UI. */
export function navigate(to: string, options: NavigateOptions = {}): void {
  if (typeof window === 'undefined') return
  const target = new URL(to, window.location.href)
  if (target.origin !== window.location.origin) {
    window.location.assign(target.href)
    return
  }

  const next = `${target.pathname}${target.search}${target.hash}`
  const current = `${window.location.pathname}${window.location.search}${window.location.hash}`
  const changed = next !== current
  if (changed) {
    if (options.replace) window.history.replaceState({}, '', next)
    else window.history.pushState({}, '', next)
  }
  notify()

  if (target.hash) scrollToHash(target.hash)
  else if (changed) window.scrollTo(0, 0)
}

/**
 * Intercepta los `<a>` internos del documento. Los enlaces con modificadores,
 * `target="_blank"`, `download` o destino externo conservan su conducta nativa.
 */
export function startNavigationInterceptor(): () => void {
  const onClick = (event: MouseEvent) => {
    if (event.defaultPrevented || event.button !== 0) return
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return

    const anchor = (event.target as HTMLElement | null)?.closest?.('a') as HTMLAnchorElement | null
    if (!anchor || !anchor.getAttribute('href')) return
    if (anchor.target && anchor.target !== '_self') return
    if (anchor.hasAttribute('download')) return

    const target = new URL(anchor.href, window.location.href)
    if (target.origin !== window.location.origin) return
    if (target.protocol !== 'http:' && target.protocol !== 'https:') return

    // Un ancla de la misma página no recarga el documento: la deja el navegador.
    const samePlace =
      target.pathname === window.location.pathname &&
      target.search === window.location.search &&
      Boolean(target.hash)
    if (samePlace) return

    event.preventDefault()
    navigate(`${target.pathname}${target.search}${target.hash}`)
  }

  document.addEventListener('click', onClick)
  return () => document.removeEventListener('click', onClick)
}
