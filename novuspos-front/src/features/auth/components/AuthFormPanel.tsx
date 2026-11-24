import { useState } from 'react'
import { useLogin } from '@/features/auth/hooks/useLogin'
import type { AuthMode } from '@/features/auth/types'
import { MS } from '@/shared/ui/MS'
import { LoginForm } from './LoginForm'
import { RegisterForm } from './RegisterForm'

const tabActive =
  'px-space-md py-2 rounded-lg font-label-md text-label-md transition-all bg-surface-container-lowest text-primary shadow-sm'
const tabIdle =
  'px-space-md py-2 rounded-lg font-label-md text-label-md text-on-surface-variant transition-all hover:text-on-surface'

interface RegisterAlert {
  title: string
  description: string
}

/** Columna derecha del split (presentacional): tabs, formularios y accesos alternos. */
export function AuthFormPanel({ initialMode }: { initialMode: AuthMode }) {
  const [mode, setMode] = useState<AuthMode>(initialMode)
  const [alert, setAlert] = useState<RegisterAlert | null>(null)
  const login = useLogin()

  const switchMode = (next: AuthMode) => {
    setMode(next)
    setAlert(null)
  }

  return (
    <div className="lg:col-span-7 p-space-md lg:p-space-xl flex flex-col justify-center bg-surface-container-lowest">
      {/* Tabs registro / inicio de sesión */}
      <div className="flex items-center justify-between mb-space-md">
        <div className="inline-flex p-1 rounded-lg bg-surface-container">
          <button type="button" className={mode === 'register' ? tabActive : tabIdle} onClick={() => switchMode('register')}>
            Crear Cuenta (30 Días Gratis)
          </button>
          <button type="button" className={mode === 'login' ? tabActive : tabIdle} onClick={() => switchMode('login')}>
            Iniciar Sesión
          </button>
        </div>
        <div className="hidden sm:flex items-center gap-space-xs text-on-surface-variant font-label-sm text-label-sm">
          <MS name="check_circle" className="text-[18px] text-secondary" />
          <span>Sin tarjeta requerida</span>
        </div>
      </div>

      {/* Banner de prueba de 30 días (solo registro) */}
      {mode === 'register' && (
        <div className="mb-space-md p-space-sm rounded-lg bg-secondary-container/30 flex items-center justify-between">
          <div className="flex items-center gap-space-xs">
            <MS name="card_giftcard" className="text-secondary text-[22px]" />
            <div>
              <p className="font-label-md text-label-md text-on-secondary-container">Licencia de Prueba Gratuita Activa</p>
              <p className="font-body-sm text-body-sm text-secondary">
                30 días de acceso total sin costo. Luego sólo <strong className="font-semibold">$4.99 USD/mes</strong>.
              </p>
            </div>
          </div>
          <span className="font-label-sm text-label-sm bg-secondary-container text-on-secondary-container px-2.5 py-1 rounded-full font-bold">
            100% GRATIS
          </span>
        </div>
      )}

      {mode === 'register' ? (
        <RegisterForm
          onSubmit={() =>
            setAlert({
              title: '¡Cuenta creada exitosamente!',
              description: 'Tu licencia de prueba de 30 días está activa. Descargando NovusPOS para Windows…',
            })
          }
        />
      ) : (
        <LoginForm
          onSubmit={login.submit}
          fieldErrors={login.fieldErrors}
          formError={login.formError}
          isSubmitting={login.isSubmitting}
        />
      )}

      {/* Divisor con texto */}
      <div className="relative my-space-md flex items-center justify-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full h-px bg-surface-container-highest" />
        </div>
        <span className="relative px-space-sm bg-surface-container-lowest font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
          O si lo prefieres
        </span>
      </div>

      {/* Acciones alternas */}
      <div className="grid grid-cols-2 gap-space-sm">
        <a
          href="/#descargar"
          className="h-10 px-space-sm rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md text-label-md flex items-center justify-center gap-space-xs transition-colors shadow-sm"
        >
          <MS name="download" className="text-[18px]" />
          <span>Descargar para Windows</span>
        </a>
        <a
          href="/#interfaz-en-vivo"
          className="h-10 px-space-sm rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md text-label-md flex items-center justify-center gap-space-xs transition-colors shadow-sm"
        >
          <MS name="play_circle" className="text-[18px]" />
          <span>Ver capturas del sistema</span>
        </a>
      </div>

      {/* Confirmación del registro */}
      {alert && (
        <div className="mt-space-md p-space-sm rounded-lg bg-secondary-container text-on-secondary-container flex items-center gap-space-sm animate-pulse">
          <MS name="task_alt" className="text-[24px]" />
          <div className="flex flex-col">
            <span className="font-label-md text-label-md">{alert.title}</span>
            <span className="font-body-sm text-body-sm">{alert.description}</span>
          </div>
        </div>
      )}

      {/* Ayuda inmediata */}
      <div className="mt-space-md pt-space-sm flex flex-col sm:flex-row items-center justify-between text-on-surface-variant font-body-sm text-body-sm gap-2">
        <span>
          ¿Dudas con la instalación?{' '}
          <a className="text-primary font-semibold hover:underline" href="/">
            Hablar con un asesor técnico
          </a>
        </span>
        <div className="flex items-center gap-1 text-outline">
          <MS name="lock" className="text-[16px]" />
          <span>Tus datos protegidos</span>
        </div>
      </div>
    </div>
  )
}
