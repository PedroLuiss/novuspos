import { RequestResetCard } from '@/features/auth/components/recovery/RequestResetCard'
import { MS } from '@/shared/ui/MS'

/** Pantalla "Recuperar Contraseña — Solicitar Enlace": réplica de Stitch. */
export function ForgotPasswordPage() {
  return (
    <div className="w-full bg-surface font-body-md text-on-surface antialiased min-h-screen flex flex-col justify-center items-center">
      <main className="w-full flex items-center justify-center p-space-md">
        <div className="flex flex-col w-full items-center justify-center relative overflow-hidden py-space-xl px-margin-mobile md:px-margin">
          {/* Luces ambientales discretas */}
          <div className="absolute -top-32 -left-20 w-96 h-96 rounded-full bg-primary-fixed opacity-40 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-32 -right-20 w-[420px] h-[420px] rounded-full bg-secondary-fixed opacity-30 blur-3xl pointer-events-none" />

          <div className="relative w-full max-w-[480px] flex flex-col items-center">
            {/* Cabecera de marca */}
            <div className="mb-space-lg flex flex-col items-center text-center">
              <div className="flex items-center gap-space-sm mb-space-xs">
                <a href="/" className="flex items-center">
                  <img alt="NovusPOS Logo" className="h-10 w-auto object-contain" src="/novuspos-logo.png" />
                </a>
              </div>
              <div className="flex items-center gap-space-xs bg-surface-container-high px-3 py-1 rounded-full text-on-surface-variant font-label-sm text-label-sm shadow-sm">
                <span className="inline-block w-2 h-2 rounded-full bg-secondary" />
                <span>ACCESO SEGURO A TU CUENTA</span>
              </div>
            </div>

            <RequestResetCard />

            {/* Pie de seguridad */}
            <div className="mt-space-lg flex flex-col items-center text-center gap-space-xs">
              <div className="flex items-center gap-space-xs text-outline font-label-sm text-label-sm">
                <MS name="shield" className="text-sm" />
                <span>Tus datos están protegidos</span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant">© 2026 NovusPOS</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
