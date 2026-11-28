import { useEffect, useRef, useState } from 'react'
import { NotificationBell } from '@/features/notifications/components/NotificationBell'
import { panelNavItems } from '@/features/panel/data/panel-data'
import { useAuth } from '@/shared/hooks/useAuth'
import { navigate } from '@/shared/router/navigation'
import { usePathname } from '@/shared/router/useRouter'
import { MS } from '@/shared/ui/MS'

/** Barra lateral y cabecera fija del panel. */
export function PanelSidebar() {
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!menuOpen) return

    const onPointerDown = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false)
      }
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }

    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [menuOpen])

  return (
    <>
      <aside className="fixed left-0 top-0 h-full w-64 bg-surface-container-low shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-50 flex flex-col justify-between py-space-md">
        <div className="flex flex-col gap-space-lg">
          <div className="px-space-md flex items-center gap-space-sm">
            <img alt="NovusPOS Logo" className="h-8 w-auto object-contain" src="/novuspos-icon.png" />
            <div className="flex flex-col">
              <span className="font-headline-sm text-headline-sm text-on-surface font-bold leading-none">Novus Portal</span>
              <span className="font-label-sm text-label-sm text-secondary font-mono font-semibold">Gestión local</span>
            </div>
          </div>
          <nav className="flex flex-col gap-space-xs px-space-sm">
            {panelNavItems.map((item) => {
              const isActive =
                item.href === '/panel'
                  ? Boolean(item.active) && pathname === '/panel'
                  : pathname.startsWith(item.href)
              return (
                <a
                  key={item.label}
                  href={item.href}
                  aria-current={isActive ? 'page' : undefined}
                  className={`flex items-center gap-space-sm px-space-md py-space-sm rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary-container text-on-primary font-semibold'
                      : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors font-label-md text-label-md'
                  }`}
                >
                  <MS name={item.icon} className="text-[20px]" />
                  <span>{item.label}</span>
                </a>
              )
            })}
          </nav>
        </div>
        <div className="px-space-md flex flex-col gap-space-xs">
          <div className="p-space-sm rounded-lg bg-surface-container flex items-center justify-between">
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm text-on-surface font-bold">Tu cuenta NovusPOS</span>
              <span className="font-label-sm text-label-sm text-secondary font-mono">Todo listo para vender</span>
            </div>
            <MS name="check_circle" className="text-secondary text-[18px]" />
          </div>
          <a
            className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors text-center pt-space-xs"
            href="/"
          >
            Ir al Sitio Principal
          </a>
        </div>
      </aside>

      <header className="fixed top-0 left-64 right-0 h-16 bg-surface-container-lowest/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-40 flex items-center justify-between px-space-lg">
        <div className="flex items-center gap-space-sm">
          <span className="font-label-md text-label-md text-on-surface-variant font-semibold">Panel de Cliente NovusPOS</span>
        </div>
        <div className="flex items-center gap-space-md">
          <NotificationBell />
          <button className="w-9 h-9 rounded-lg bg-surface-container-low hover:bg-surface-container flex items-center justify-center text-on-surface-variant transition-colors">
            <MS name="sync" className="text-[20px]" />
          </button>

          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              className="flex items-center gap-space-sm pl-space-xs rounded-lg hover:bg-surface-container-low transition-colors py-1 pr-2"
              aria-haspopup="menu"
              aria-expanded={menuOpen}
            >
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
                <MS name="person" className="text-on-primary text-[18px]" />
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <span className="font-label-md text-label-md text-on-surface font-semibold leading-tight">
                  {user?.organizationName ?? user?.name ?? 'Administrador'}
                </span>
                <span className="font-label-sm text-label-sm text-on-surface-variant font-mono">
                  {user?.email ?? 'Cuenta principal'}
                </span>
              </div>
              <MS name={menuOpen ? 'expand_less' : 'expand_more'} className="text-on-surface-variant text-[18px]" />
            </button>

            {menuOpen && (
              <div
                role="menu"
                className="absolute right-0 top-full mt-2 w-56 rounded-xl bg-surface-container-lowest border border-outline-variant/20 shadow-[0_8px_24px_rgba(0,0,0,0.08)] py-1 z-50"
              >
                <button
                  type="button"
                  role="menuitem"
                  className="w-full flex items-center gap-space-sm px-space-md py-space-sm text-left font-body-sm text-body-sm text-on-surface hover:bg-surface-container-low transition-colors"
                  onClick={() => {
                    setMenuOpen(false)
                    navigate('/panel/perfil')
                  }}
                >
                  <MS name="person" className="text-[18px] text-on-surface-variant" />
                  Mi perfil
                </button>
                <div className="my-1 border-t border-outline-variant/20" />
                <button
                  type="button"
                  role="menuitem"
                  className="w-full flex items-center gap-space-sm px-space-md py-space-sm text-left font-body-sm text-body-sm text-error hover:bg-error-container/30 transition-colors"
                  onClick={() => {
                    setMenuOpen(false)
                    logout()
                  }}
                >
                  <MS name="logout" className="text-[18px]" />
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  )
}
