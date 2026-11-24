import { AuthBrandPanel } from '@/features/auth/components/AuthBrandPanel'
import { AuthFormPanel } from '@/features/auth/components/AuthFormPanel'
import type { AuthMode } from '@/features/auth/types'
import { authTrustBar } from '@/features/auth/data/auth-data'
import { MS } from '@/shared/ui/MS'

/** Vista de Iniciar Sesión / Registro — réplica del split de Stitch. */
export function AuthPage({ initialMode = 'register' }: { initialMode?: AuthMode }) {
  return (
    <div className="w-full bg-surface font-body-md text-on-surface antialiased min-h-screen flex flex-col justify-center items-center">
      <main className="w-full flex items-center justify-center p-space-md">
        <div className="flex flex-col w-full">
          <div className="w-full max-w-7xl mx-auto my-auto py-space-md lg:py-space-xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 rounded-xl shadow-xl overflow-hidden bg-surface-container-lowest">
              <AuthBrandPanel />
              <AuthFormPanel initialMode={initialMode} />
            </div>

            {/* Barra inferior de confianza */}
            <div className="mt-space-md grid grid-cols-2 md:grid-cols-4 gap-space-sm text-center">
              {authTrustBar.map((item) => (
                <div
                  key={item.label}
                  className="p-space-sm rounded-lg bg-surface-container flex items-center justify-center gap-space-xs text-on-surface-variant font-label-sm text-label-sm"
                >
                  <MS name={item.icon} className={`text-[18px] ${item.tone === 'secondary' ? 'text-secondary' : 'text-primary'}`} />
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
