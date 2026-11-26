import { useState } from 'react'
import { SelectField, TextAreaField, TextField } from '@/shared/ui/FormFields'
import { MS } from '@/shared/ui/MS'
import { useAdminEmails } from '../hooks/useAdminEmails'
import { useAdminUsers } from '../hooks/useAdminUsers'
import { adminPrimaryButton } from '../lib/adminStyles'
import { EmailHistory } from './EmailHistory'
import { AdminAlert, AdminBadge, AdminCard, AdminPageHeader } from './ui/AdminUi'

/** Correos personalizados que el dueño envía a todos o a un usuario. */
export function EmailsPage() {
  const {
    emails,
    total,
    page,
    pageSize,
    totalPages,
    query,
    isLoading,
    isSubmitting,
    error,
    setSearch,
    setAudience: setHistoryAudience,
    setPageSize,
    setPage,
    resetFilters,
    send,
  } = useAdminEmails()
  const { users } = useAdminUsers()
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [audience, setAudience] = useState('all')
  const [notice, setNotice] = useState<string | null>(null)

  const audienceLabel = users.find((item) => item.id === audience)?.businessName ?? 'Todos los usuarios'

  return (
    <div className="flex flex-col gap-space-lg">
      <AdminPageHeader
        eyebrow="Comunicación"
        title="Correos"
        description="Escribe un mensaje y envíalo a todos los usuarios o solo a uno."
      />

      {error && <AdminAlert>{error}</AdminAlert>}
      {notice && <AdminAlert tone="success">{notice}</AdminAlert>}

      <div className="grid grid-cols-1 gap-space-md lg:grid-cols-12">
        <AdminCard
          className="lg:col-span-7"
          icon="mail"
          title="Nuevo correo"
          description="Redacta y elige los destinatarios"
        >
          <form
            className="flex flex-col gap-space-sm"
            onSubmit={async (event) => {
              event.preventDefault()
              const ok = await send({
                subject: subject.trim(),
                body: body.trim(),
                audience,
                audienceLabel,
              })
              if (ok) { setSubject(''); setBody(''); setAudience('all'); setNotice('Correo registrado y enviado.') }
            }}
          >
            <TextField id="admin-mail-subject" label="Asunto" icon="subject" value={subject} onChange={setSubject} placeholder="Novedades para tu negocio" required />
            <TextAreaField id="admin-mail-body" label="Mensaje" icon="notes" rows={6} value={body} onChange={setBody} placeholder="Escribe aquí tu mensaje…" required />
            <SelectField
              id="admin-mail-audience"
              label="Destinatario"
              icon="group"
              value={audience}
              onChange={setAudience}
              options={[{ value: 'all', label: 'Todos los usuarios' }, ...users.map((item) => ({ value: item.id, label: item.businessName }))]}
            />
            <button type="submit" disabled={isSubmitting} className={`${adminPrimaryButton} self-start`}>
              <MS name="send" className="text-[18px]" /> {isSubmitting ? 'Enviando…' : 'Enviar correo'}
            </button>
          </form>
        </AdminCard>

        <AdminCard className="lg:col-span-5" icon="preview" title="Vista previa" description="Así se verá en el correo de tus usuarios">
          <div className="overflow-hidden rounded-xl border border-outline-variant/50 bg-surface-container-low">
            <div className="flex items-center gap-space-xs border-b border-outline-variant/50 bg-surface-container px-space-sm py-2">
              <span className="w-7 h-7 rounded-lg bg-primary text-on-primary flex items-center justify-center">
                <MS name="mail" className="text-[15px]" />
              </span>
              <span className="font-label-sm text-label-sm text-on-surface-variant">NovusPOS</span>
            </div>
            <div className="flex flex-col gap-space-xs p-space-sm">
              <span className="font-label-md text-label-md font-bold text-on-surface">{subject || 'Asunto del correo'}</span>
              <span className="font-body-sm text-body-sm text-on-surface-variant whitespace-pre-wrap">
                {body || 'Aquí aparecerá el mensaje que escribas.'}
              </span>
              <AdminBadge tone="info">Para: {audienceLabel}</AdminBadge>
            </div>
          </div>
        </AdminCard>
      </div>

      <EmailHistory
        emails={emails}
        total={total}
        page={page}
        pageSize={pageSize}
        totalPages={totalPages}
        isLoading={isLoading}
        query={query}
        users={users}
        onSearch={setSearch}
        onAudience={setHistoryAudience}
        onPageSize={setPageSize}
        onPage={setPage}
        onReset={resetFilters}
      />
    </div>
  )
}
