import { useEffect, useRef, useState, type ReactNode } from 'react'
import { navigate } from '@/shared/router/navigation'
import { MS } from '@/shared/ui/MS'
import { getAdminSectionLabel, type AdminSection } from '../config/adminSections'
import { formatAdminDate } from '@/features/admin/core/lib/adminFormatters'
import { adminSessionStore } from '@/features/admin/core/lib/adminSession'
import { AdminSidebar } from './AdminSidebar'

interface Props {
  section: AdminSection
  children: ReactNode
}

const TODAY = formatAdminDate(new Date().toISOString())

/** Estructura del panel maestro: navegación fija, cabecera contextual y contenido. */
export function AdminLayout({ section, children }: Props) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement | null>(null)
  const session = adminSessionStore.read()
  const initials = (session?.name ?? session?.email ?? 'AD').slice(0, 2).toUpperCase()

  useEffect(() => {
    if (!userMenuOpen) return
    const onPointerDown = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) setUserMenuOpen(false)
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setUserMenuOpen(false)
    }
    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [userMenuOpen])

  const logout = () => {
    adminSessionStore.clear()
    navigate('/auth/login', { replace: true })
  }

  return (
    <div className="min-h-screen w-full bg-surface font-body-md text-on-surface antialiased">
      <aside className="fixed left-0 top-0 z-40 hidden h-full lg:block">
        <AdminSidebar section={section} />
      </aside>

      {menuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button type="button" aria-label="Cerrar menú" className="absolute inset-0 bg-on-surface/50 backdrop-blur-sm" onClick={() => setMenuOpen(false)} />
          <aside className="relative h-full w-[272px] shadow-2xl">
            <AdminSidebar section={section} onNavigate={() => setMenuOpen(false)} />
          </aside>
        </div>
      )}

      <header className="fixed left-0 right-0 top-0 z-30 flex h-[72px] items-center justify-between gap-space-sm border-b border-outline-variant/40 bg-surface-container-lowest/95 px-space-md backdrop-blur lg:left-[272px] lg:px-space-lg">
        <div className="flex min-w-0 items-center gap-space-sm">
          <button
            type="button"
            aria-label="Abrir menú"
            onClick={() => setMenuOpen(true)}
            className="w-9 h-9 rounded-xl bg-surface-container text-on-surface-variant flex items-center justify-center lg:hidden"
          >
            <MS name="menu" className="text-[20px]" />
          </button>
          <div className="hidden items-center gap-space-xs sm:flex">
            <span className="font-label-md text-label-md text-outline">Panel maestro</span>
            <MS name="chevron_right" className="text-[16px] text-outline" />
          </div>
          <span className="truncate font-headline-sm text-headline-sm font-bold text-on-surface">{getAdminSectionLabel(section)}</span>
        </div>

        <div className="flex items-center gap-space-sm">
          <span className="hidden items-center gap-space-xs rounded-full bg-surface-container px-space-sm py-1.5 font-label-sm text-label-sm text-on-surface-variant md:flex">
            <MS name="calendar_month" className="text-[16px]" /> {TODAY}
          </span>
          <div className="hidden h-8 w-px bg-outline-variant/70 md:block" />

          <div className="relative" ref={userMenuRef}>
            <button
              type="button"
              onClick={() => setUserMenuOpen((open) => !open)}
              className="flex items-center gap-space-xs rounded-xl px-1 py-1 hover:bg-surface-container-low transition-colors"
              aria-haspopup="menu"
              aria-expanded={userMenuOpen}
            >
              <div className="hidden flex-col text-right sm:flex">
                <span className="font-label-md text-label-md font-semibold leading-tight">{session?.name ?? 'Super administrador'}</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">{session?.email ?? 'admin@novuspos.com'}</span>
              </div>
              <span className="w-9 h-9 rounded-full bg-primary text-on-primary flex items-center justify-center font-label-md text-label-md font-bold">
                {initials}
              </span>
              <MS name={userMenuOpen ? 'expand_less' : 'expand_more'} className="text-on-surface-variant text-[18px]" />
            </button>

            {userMenuOpen && (
              <div role="menu" className="absolute right-0 top-full mt-2 w-56 rounded-xl bg-surface-container-lowest border border-outline-variant/20 shadow-[0_8px_24px_rgba(0,0,0,0.08)] py-1 z-50">
                <button
                  type="button"
                  role="menuitem"
                  className="w-full flex items-center gap-space-sm px-space-md py-space-sm text-left font-body-sm text-body-sm text-on-surface hover:bg-surface-container-low transition-colors"
                  onClick={() => {
                    setUserMenuOpen(false)
                    navigate('/administracion/perfil')
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
                    setUserMenuOpen(false)
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

      <main className="min-h-screen pt-[72px] lg:pl-[272px]">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-space-lg p-space-md lg:p-space-lg">{children}</div>
      </main>
    </div>
  )
}
