import { SelectField, TextAreaField, TextField } from '@/shared/ui/FormFields'
import { MS } from '@/shared/ui/MS'
import { supportTopics } from '../data/support-data'
import type { SupportDraft, SupportFieldErrors } from '../types'

interface Props {
  draft: SupportDraft
  fieldErrors: SupportFieldErrors
  formError: string | null
  isSubmitting: boolean
  onChange: <K extends keyof SupportDraft>(field: K, value: SupportDraft[K]) => void
  onSubmit: () => void
}

/** Formulario presentacional: no conoce la API ni los hooks. */
export function SupportForm({ draft, fieldErrors, formError, isSubmitting, onChange, onSubmit }: Props) {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        onSubmit()
      }}
      className="rounded-xl bg-surface-container-lowest p-space-lg shadow-sm flex flex-col gap-space-md"
    >
      <div className="flex items-center gap-space-xs">
        <MS name="support_agent" className="text-primary text-[24px]" />
        <div>
          <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">Cuéntanos qué pasó</h2>
          <span className="font-body-sm text-body-sm text-on-surface-variant">
            Tu reporte llega directamente a nuestro equipo de soporte.
          </span>
        </div>
      </div>

      {formError && (
        <div className="p-space-sm rounded-lg bg-error-container text-on-error-container font-body-sm text-body-sm" role="alert">
          {formError}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
        <TextField
          id="support-email"
          label="Correo de contacto"
          icon="mail"
          type="email"
          autoComplete="email"
          placeholder="tucorreo@ejemplo.com"
          value={draft.email}
          onChange={(value) => onChange('email', value)}
          error={fieldErrors.email}
        />
        <SelectField
          id="support-topic"
          label="¿Qué necesitas?"
          icon="category"
          options={[{ value: '', label: 'Selecciona un tema' }, ...supportTopics]}
          value={draft.topic}
          onChange={(value) => onChange('topic', value as SupportDraft['topic'])}
          error={fieldErrors.topic}
        />
      </div>

      <TextField
        id="support-subject"
        label="Asunto"
        icon="subject"
        placeholder="Ej. No puedo abrir el programa"
        value={draft.subject}
        onChange={(value) => onChange('subject', value)}
        error={fieldErrors.subject}
        helper="Unas pocas palabras que nos ayuden a ubicar el problema."
      />

      <TextAreaField
        id="support-description"
        label="Detalle del problema"
        icon="notes"
        rows={5}
        placeholder="Cuéntanos qué hiciste, qué esperabas y qué ocurrió…"
        value={draft.description}
        onChange={(value) => onChange('description', value)}
        error={fieldErrors.description}
        helper="Entre 20 y 1000 caracteres. Mientras más contexto, mejor podremos ayudarte."
      />

      <div className="flex items-center justify-between gap-space-sm pt-space-xs border-t border-outline-variant/60">
        <span className="font-body-sm text-body-sm text-on-surface-variant">
          Te responderemos al correo que nos dejaste.
        </span>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-space-lg py-2.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md font-semibold flex items-center justify-center gap-1.5 transition-colors disabled:opacity-60 shrink-0"
        >
          <MS name={isSubmitting ? 'progress_activity' : 'send'} className={`text-[18px] ${isSubmitting ? 'animate-spin' : ''}`} />
          {isSubmitting ? 'Enviando…' : 'Enviar reporte'}
        </button>
      </div>
    </form>
  )
}
