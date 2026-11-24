import { MS } from '@/shared/ui/MS'
import { useSupportForm } from '../hooks/useSupportForm'
import { SupportForm } from './SupportForm'
import { SupportSuccess } from './SupportSuccess'
import { SupportTips } from './SupportTips'

/** Módulo de Soporte Técnico: formulario validado y confirmación. */
export function SupportOverview() {
  const { draft, ticket, fieldErrors, formError, isSubmitting, setField, submit, startAgain } = useSupportForm()

  return (
    <div className="flex flex-col gap-space-lg">
      <div className="flex items-center gap-space-xs">
        <MS name="headset_mic" className="text-primary text-[22px]" />
        <div>
          <h1 className="font-headline-md text-headline-md text-on-surface font-bold">Soporte Técnico</h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Reporta un problema y recibe ayuda en tu correo.
          </p>
        </div>
      </div>

      {ticket ? (
        <SupportSuccess ticket={ticket} email={draft.email} onAgain={startAgain} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-md items-start">
          <div className="lg:col-span-8">
            <SupportForm
              draft={draft}
              fieldErrors={fieldErrors}
              formError={formError}
              isSubmitting={isSubmitting}
              onChange={setField}
              onSubmit={() => void submit()}
            />
          </div>
          <div className="lg:col-span-4">
            <SupportTips />
          </div>
        </div>
      )}
    </div>
  )
}
