import { analyzePassword } from '@/features/auth/lib/passwordStrength'
import { MS } from '@/shared/ui/MS'

/** Medidor de fuerza y lista de requisitos — réplica del bloque dinámico de Stitch. */
export function PasswordRequirements({ password }: { password: string }) {
  const { checks, bars } = analyzePassword(password)

  const requirements = [
    { key: 'length', valid: checks.length, label: 'Al menos 8 caracteres' },
    { key: 'case', valid: checks.case, label: 'Al menos una letra mayúscula y minúscula' },
    { key: 'number', valid: checks.number, label: 'Al menos un número' },
    { key: 'symbol', valid: checks.symbol, label: 'Al menos un carácter especial (@, #, $, %, etc.)' },
  ] as const

  return (
    <>
      <div className="w-full flex gap-1.5 mt-1.5">
        {bars.map((barClass, index) => (
          <div key={index} className={barClass} />
        ))}
      </div>

      <div className="bg-surface-container-low rounded-lg p-space-sm flex flex-col gap-1.5 shadow-sm">
        <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-0.5">
          Requisitos de seguridad
        </span>
        {requirements.map((requirement) => (
          <div
            key={requirement.key}
            className={`flex items-center gap-2 transition-colors ${
              requirement.valid ? 'text-secondary' : 'text-on-surface-variant'
            }`}
          >
            <MS
              name={requirement.valid ? 'check_circle' : 'radio_button_unchecked'}
              filled={requirement.valid}
              className={`text-[16px] ${requirement.valid ? 'text-secondary' : 'text-outline'}`}
            />
            <span className="font-body-sm text-body-sm">{requirement.label}</span>
          </div>
        ))}
      </div>
    </>
  )
}
