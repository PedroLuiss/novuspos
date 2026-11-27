import { MS } from '@/shared/ui/MS'
import { ADMIN_SECTION_GROUPS, type AdminSection } from '../config/adminSections'
import { getAdminLoginPath } from '@/features/admin/core/lib/adminSettings'

/** Navegación del dueño: agrupada y con acento activo. */
export function AdminSidebar({ section, onNavigate }: { section: AdminSection; onNavigate?: () => void }) {

  return (
    <div className="flex h-full w-[272px] flex-col justify-between bg-admin-ink text-white">
      <div className="flex flex-col gap-space-lg overflow-y-auto pt-space-md">
        <div className="flex items-center gap-space-sm px-space-md">
          <img src="/novuspos-icon.png" alt="" className="w-10 h-10 rounded-xl bg-white p-1 object-contain" />
          <div className="flex flex-col">
            <span className="font-headline-sm text-headline-sm font-bold leading-tight">NovusPOS</span>
            <span className="font-label-sm text-label-sm text-[#9fb4e8] font-mono">CENTRO DE CONTROL</span>
          </div>
        </div>

        <nav className="flex flex-col gap-space-md px-space-sm">
          {ADMIN_SECTION_GROUPS.map((group) => (
            <div key={group.label} className="flex flex-col gap-space-xs">
              <span className="px-space-sm font-label-sm text-label-sm uppercase tracking-[0.16em] text-[#7f96cf] font-mono">
                {group.label}
              </span>
              {group.items.map((item) => {
                const active = section === item.key
                return (
                  <a
                    key={item.key}
                    href={item.href}
                    onClick={onNavigate}
                    aria-current={active ? 'page' : undefined}
                    className={`relative flex items-center gap-space-sm rounded-xl px-space-sm py-2.5 font-label-md text-label-md transition ${
                      active ? 'bg-white/12 text-white shadow-sm' : 'text-[#aebce0] hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    {active && <span className="absolute left-0 top-2 bottom-2 w-1 rounded-full bg-[#6cf8bb]" />}
                    <MS name={item.icon} className="text-[20px]" />
                    {item.navLabel}
                  </a>
                )
              })}
            </div>
          ))}
        </nav>
      </div>

      <div className="flex flex-col gap-space-xs border-t border-white/10 px-space-md py-space-md">
        <div className="rounded-xl border border-white/10 bg-white/5 p-space-sm">
          <div className="flex items-center gap-space-xs text-[#c8d4f2]">
            <MS name="lock" className="text-[16px]" />
            <span className="font-label-sm text-label-sm font-semibold uppercase tracking-wider">Acceso privado</span>
          </div>
          <code className="mt-1 block truncate font-label-sm text-label-sm text-[#6cf8bb]">{getAdminLoginPath()}</code>
        </div>
        <a href="/panel" className="flex items-center gap-space-xs rounded-lg px-space-xs py-1.5 font-body-sm text-body-sm text-[#aebce0] hover:bg-white/5 hover:text-white">
          <MS name="arrow_back" className="text-[16px]" /> Portal de clientes
        </a>
      </div>
    </div>
  )
}
