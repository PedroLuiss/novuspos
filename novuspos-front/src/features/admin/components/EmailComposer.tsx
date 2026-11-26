import { useState, type FormEvent } from 'react'
import { SelectField, TextField } from '@/shared/ui/FormFields'
import { MS } from '@/shared/ui/MS'
import type { EmailInput } from '../hooks/useAdminEmails'
import { adminPrimaryButton } from '../lib/adminStyles'
import { htmlToText, sanitizeEmailHtml } from '../lib/emailHtml'
import type { AdminUser, EmailDraft } from '../types'
import { EmailEditor } from './EmailEditor'
import { AdminAlert, AdminBadge, AdminCard } from './ui/AdminUi'

interface Props {
  users: AdminUser[]
  isSubmitting: boolean
  onDraftChange: (draft: EmailDraft) => void
  onSubmit: (input: EmailInput) => Promise<boolean>
  onNotice: (message: string) => void
}

/** Compose de correos reales: destinatario, asunto y mensaje enriquecido. */
export function EmailComposer({ users, isSubmitting, onDraftChange, onSubmit, onNotice }: Props) {
  const [subject, setSubject] = useState('')
  const [bodyHtml, setBodyHtml] = useState('')
  const [audience, setAudienceState] = useState('all')
  const [error, setError] = useState<string | null>(null)

  const audienceLabel = users.find((item) => item.id === audience)?.businessName ?? 'Todos los usuarios'

  const report = (next: Partial<EmailDraft>) => {
    onDraftChange({
      subject: next.subject ?? subject,
      html: next.html ?? bodyHtml,
      audience: next.audience ?? audience,
    })
  }

  const changeSubject = (next: string) => { setSubject(next); report({ subject: next }) }
  const changeBody = (next: string) => { setBodyHtml(next); report({ html: next }) }
  const changeAudience = (next: string) => { setAudienceState(next); report({ audience: next }) }

  const reset = () => {
    setSubject('')
    setBodyHtml('')
    setAudienceState('all')
    onDraftChange({ subject: '', html: '', audience: 'all' })
  }

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!subject.trim()) {
      setError('Escribe el asunto del correo.')
      return
    }
    if (!htmlToText(bodyHtml)) {
      setError('Escribe el mensaje antes de enviar.')
      return
    }

    const body = sanitizeEmailHtml(bodyHtml)
    const ok = await onSubmit({
      subject: subject.trim(),
      body,
      bodyText: htmlToText(body),
      audience,
      audienceLabel,
    })
    if (ok) {
      setError(null)
      reset()
      onNotice('Correo registrado y enviado.')
    }
  }

  return (
    <AdminCard
      className="lg:col-span-8"
      icon="mail"
      title="Nuevo correo"
      description="Redacta y elige los destinatarios"
      action={<AdminBadge tone="info">Borrador</AdminBadge>}
    >
      <form className="flex flex-col gap-space-sm" onSubmit={submit}>
        {error && <AdminAlert>{error}</AdminAlert>}

        <div className="grid grid-cols-1 gap-space-sm md:grid-cols-2">
          <SelectField
            id="admin-mail-audience"
            label="Para"
            icon="group"
            value={audience}
            onChange={changeAudience}
            options={[{ value: 'all', label: 'Todos los usuarios' }, ...users.map((item) => ({ value: item.id, label: item.businessName }))]}
          />
          <TextField
            id="admin-mail-subject"
            label="Asunto"
            icon="subject"
            value={subject}
            onChange={changeSubject}
            placeholder="Novedades para tu negocio"
          />
        </div>

        <div className="flex flex-col gap-space-xs rounded-xl border border-outline-variant/50 bg-surface-container-lowest p-space-sm">
          <div className="flex flex-wrap items-center justify-between gap-space-xs">
            <span className="font-label-md text-label-md font-semibold text-on-surface">Mensaje</span>
            <span className="font-body-sm text-body-sm text-on-surface-variant">Títulos, imágenes y enlaces</span>
          </div>
          <EmailEditor id="admin-mail-body" value={bodyHtml} onChange={changeBody} />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-space-xs border-t border-outline-variant/50 pt-space-sm">
          <span className="font-body-sm text-body-sm text-on-surface-variant">
            Se enviará a <span className="font-semibold text-on-surface">{audienceLabel}</span>.
          </span>
          <button type="submit" disabled={isSubmitting} className={adminPrimaryButton}>
            <MS name="send" className="text-[18px]" /> {isSubmitting ? 'Enviando…' : 'Enviar correo'}
          </button>
        </div>
      </form>
    </AdminCard>
  )
}
