import { navigate } from '@/shared/router/navigation'
import { useSearch } from '@/shared/router/useRouter'
import { MS } from '@/shared/ui/MS'

const messages: Record<string, { title: string; description: string; icon: string; tone: 'success' | 'error' | 'info' }> = {
  verified: {
    title: 'Correo verificado',
    description: 'Tu correo fue verificado correctamente. Ya puedes comprar suscripciones cuando lo necesites.',
    icon: 'verified',
    tone: 'success',
  },
  already_verified: {
    title: 'Correo ya verificado',
    description: 'Tu correo ya estaba verificado. Puedes continuar usando tu cuenta normalmente.',
    icon: 'verified',
    tone: 'info',
  },
  invalid: {
    title: 'Enlace no válido',
    description: 'El enlace de verificación es inválido o expiró. Solicita un nuevo correo desde tu perfil.',
    icon: 'error',
    tone: 'error',
  },
}

export function VerifyEmailPage() {
  const search = useSearch()
  const params = new URLSearchParams(search)
  const status = params.get('status') ?? 'invalid'
  const content = messages[status] ?? messages.invalid

  const toneClass =
    content.tone === 'success'
      ? 'bg-secondary-container text-on-secondary-container'
      : content.tone === 'error'
        ? 'bg-error-container text-on-error-container'
        : 'bg-primary-container text-on-primary-container'

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-space-md">
      <div className="w-full max-w-lg bg-surface-container-lowest rounded-2xl border border-outline-variant/20 p-space-xl text-center">
        <div className={`inline-flex items-center justify-center w-14 h-14 rounded-full mb-space-md ${toneClass}`}>
          <MS name={content.icon} className="text-[28px]" />
        </div>
        <h1 className="font-headline-md text-headline-md text-on-surface mb-space-sm">{content.title}</h1>
        <p className="font-body-md text-body-md text-on-surface-variant mb-space-lg">{content.description}</p>
        <div className="flex gap-space-sm justify-center">
          <button
            type="button"
            onClick={() => navigate('/panel/perfil', { replace: true })}
            className="h-11 px-space-lg rounded-xl bg-primary text-on-primary font-label-md text-label-md hover:bg-primary/90 transition-all"
          >
            Ir a mi perfil
          </button>
          <button
            type="button"
            onClick={() => navigate('/panel', { replace: true })}
            className="h-11 px-space-lg rounded-xl bg-surface-container-high text-on-surface font-label-md text-label-md hover:bg-surface-container-highest transition-all"
          >
            Ir al panel
          </button>
        </div>
      </div>
    </div>
  )
}
