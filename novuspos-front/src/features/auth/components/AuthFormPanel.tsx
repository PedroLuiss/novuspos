import { useState } from 'react'
import { useLogin } from '@/features/auth/hooks/useLogin'
import { useRegister } from '@/features/auth/hooks/useRegister'
import type { AuthMode } from '@/features/auth/types'
import { MS } from '@/shared/ui/MS'
import { LoginForm } from './LoginForm'
import { RegisterForm } from './RegisterForm'

const tabActive =
  'px-space-md py-2 rounded-lg font-label-md text-label-md transition-all bg-surface-container-lowest text-primary shadow-sm'
const tabIdle =
  'px-space-md py-2 rounded-lg font-label-md text-label-md text-on-surface-variant transition-all hover:text-on-surface'

/** Columna derecha del split: tabs, formularios y accesos alternos. */
export function AuthFormPanel({ initialMode }: { initialMode: AuthMode }) {
  const [mode, setMode] = useState<AuthMode>(initialMode)
  const login = useLogin()
  const register = useRegister()

  return (
    <div className="lg:col-span-7 p-space-md lg:p-space-xl flex flex-col justify-center bg-surface-container-lowest">
      {/* Tabs registro / inicio de sesión */}
      <div className="flex items-center justify-between mb-space-lg">
        <div className="inline-flex p-1 bg-surface-container-low rounded-xl">
          <button
            type="button"
            onClick={() => setMode('register')}
            className={mode === 'register' ? tabActive : tabIdle}
          >
            Crear cuenta
          </button>
          <button
            type="button"
            onClick={() => setMode('login')}
            className={mode === 'login' ? tabActive : tabIdle}
          >
            Iniciar sesión
          </button>
        </div>
      </div>

      {/* Encabezado */}
      <div className="mb-space-md">
        <h1 className="font-headline-lg text-headline-lg text-on-surface mb-space-xs">
          {mode === 'register' ? 'Comienza a vender con NovusPOS' : 'Inicia sesión en tu cuenta'}
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant">
          {mode === 'register'
            ? 'Registra tu comercio y accede al panel para gestionar tu suscripción y respaldo.'
            : 'Ingresa tus credenciales para acceder al panel de tu comercio.'}
        </p>
      </div>

      {/* Formulario activo */}
      {mode === 'login' ? (
        <LoginForm
          onSubmit={login.submit}
          fieldErrors={login.fieldErrors}
          formError={login.formError}
          isSubmitting={login.isSubmitting}
        />
      ) : (
        <RegisterForm
          onSubmit={register.submit}
          fieldErrors={register.fieldErrors}
          formError={register.formError}
          isSubmitting={register.isSubmitting}
        />
      )}

      {/* Separador */}
      <div className="relative flex items-center py-space-md">
        <div className="flex-grow border-t border-outline-variant/20" />
        <span className="mx-space-sm font-label-sm text-label-sm uppercase tracking-widest text-outline">
          O continúa con
        </span>
        <div className="flex-grow border-t border-outline-variant/20" />
      </div>

      {/* Botones sociales */}
      <div className="grid grid-cols-2 gap-space-sm mb-space-lg">
        <button
          type="button"
          className="flex items-center justify-center gap-space-xs h-11 rounded-xl border border-outline-variant/20 bg-surface-container-low font-label-md text-label-md text-on-surface transition-all hover:bg-surface-container-high"
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt=""
            className="w-5 h-5"
          />
          Google
        </button>
        <button
          type="button"
          className="flex items-center justify-center gap-space-xs h-11 rounded-xl border border-outline-variant/20 bg-surface-container-low font-label-md text-label-md text-on-surface transition-all hover:bg-surface-container-high"
        >
          <MS name="terminal" className="text-[20px] text-on-surface-variant" />
          Microsoft
        </button>
      </div>

      {/* Nota legal */}
      <p className="text-center font-body-sm text-body-sm text-outline max-w-sm mx-auto">
        Al continuar, aceptas los{' '}
        <a href="#" className="text-primary hover:underline">
          Términos de Servicio
        </a>{' '}
        y la{' '}
        <a href="#" className="text-primary hover:underline">
          Política de Privacidad
        </a>
        .
      </p>
    </div>
  )
}
