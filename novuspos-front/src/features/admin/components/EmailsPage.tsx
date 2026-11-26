import { useState } from 'react'
import { useAdminEmails } from '../hooks/useAdminEmails'
import { useAdminUserOptions } from '../hooks/useAdminUserOptions'
import type { EmailDraft } from '../types'
import { EmailComposer } from './EmailComposer'
import { EmailHistory } from './EmailHistory'
import { EmailPreview } from './EmailPreview'
import { AdminAlert, AdminCard, AdminPageHeader } from './ui/AdminUi'

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
  const { options: users } = useAdminUserOptions()
  const [draft, setDraft] = useState<EmailDraft>({ subject: '', html: '', audience: 'all' })
  const [notice, setNotice] = useState<string | null>(null)

  const audienceLabel = users.find((item) => item.id === draft.audience)?.businessName ?? 'Todos los usuarios'

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
        <EmailComposer
          users={users}
          isSubmitting={isSubmitting}
          onDraftChange={setDraft}
          onSubmit={send}
          onNotice={setNotice}
        />

        <AdminCard
          className="lg:col-span-4"
          icon="visibility"
          title="Vista previa"
          description="Así se verá en el correo de tus usuarios"
        >
          <EmailPreview subject={draft.subject} html={draft.html} audienceLabel={audienceLabel} />
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
