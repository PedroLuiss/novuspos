import { useState, type ReactNode } from 'react'
import { MS } from '@/shared/ui/MS'
import type { AdminSection } from '../../../app/AdminPage'
import { formatAdminDate } from '../lib/adminFormatters'
import { adminSessionStore } from '../lib/adminSession'
import { AdminSidebar } from './AdminSidebar'

interface Props {
  section: AdminSection
  children: ReactNode
}

const TODAY = formatAdminDate(new Date().toISOString())

const sectionLabels: Record<AdminSection, string> = {
  overview: 'Resumen',
  payments: 'Pagos',
  users: 'Usuarios',
  reports: 'Reportes',
  notifications: 'Notificaciones',
  emails: 'Correos',
  settings: 'Ajustes',
}

/** Estructura del panel maestro: navegación fija, cabecera contextual y contenido. */
export function AdminLayout({ section, children }: Props) {
  const [menuOpen, setMenuOpen] = useState(false)
  const session = adminSessionStore.read()
  const initials = (session?.email ?? 'DUEÑO').slice(0, 2).toUpperCase()

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
          <span className="truncate font-headline-sm text-headline-sm font-bold text-on-surface">{sectionLabels[section]}</span>
        </div>

        <div className="flex items-center gap-space-sm">
          <span className="hidden items-center gap-space-xs rounded-full bg-surface-container px-space-sm py-1.5 font-label-sm text-label-sm text-on-surface-variant md:flex">
            <MS name="calendar_month" className="text-[16px]" /> {TODAY}
          </span>
          <div className="hidden h-8 w-px bg-outline-variant/70 md:block" />
          <div className="flex items-center gap-space-xs">
            <div className="hidden flex-col text-right sm:flex">
              <span className="font-label-md text-label-md font-semibold leading-tight">{session?.email ?? 'Dueño de NovusPOS'}</span>
              <span className="font-label-sm text-label-sm text-on-surface-variant">Super administrador</span>
            </div>
            <span className="w-9 h-9 rounded-full bg-primary text-on-primary flex items-center justify-center font-label-md text-label-md font-bold">
              {initials}
            </span>
          </div>
        </div>
      </header>

      <main className="min-h-screen pt-[72px] lg:pl-[272px]">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-space-lg p-space-md lg:p-space-lg">{children}</div>
      </main>
    </div>
  )
}
