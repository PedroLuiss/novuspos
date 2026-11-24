import { ResetPasswordCard } from '@/features/auth/components/recovery/ResetPasswordCard'
import { readRecoveryLinkParams } from '@/features/auth/lib/recoveryLink'

/** Pantalla "Restablecer Nueva Contraseña": réplica de Stitch, accesible por el enlace del correo. */
export function ResetPasswordPage() {
  const { token, email } = readRecoveryLinkParams(window.location.search)

  return (
    <div className="w-full bg-surface font-body-md text-on-surface antialiased min-h-screen flex flex-col justify-center items-center">
      <main className="w-full flex items-center justify-center p-space-md">
        <div className="flex flex-col w-full items-center justify-center py-space-lg px-gutter-compact">
          <div className="relative w-full max-w-lg flex flex-col items-center">
            {/* Luces ambientales discretas */}
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-72 h-72 bg-primary/10 rounded-full blur-3xl pointer-events-none -z-10" />
            <div className="absolute -bottom-8 right-10 w-48 h-48 bg-secondary-container/30 rounded-full blur-2xl pointer-events-none -z-10" />

            <ResetPasswordCard token={token} email={email} />

            {/* Pie discreto */}
            <div className="flex items-center justify-center gap-4 mt-space-md text-on-surface-variant font-body-sm text-body-sm">
              <span>© 2026 NovusPOS</span>
              <span className="text-outline-variant">•</span>
              <a href="/" className="hover:text-primary transition-colors">
                Términos
              </a>
              <span className="text-outline-variant">•</span>
              <a href="/" className="hover:text-primary transition-colors">
                Privacidad
              </a>
              <span className="text-outline-variant">•</span>
              <a href="/" className="hover:text-primary transition-colors">
                Soporte
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
