import { useState } from 'react'
import { SelectField, TextAreaField, TextField } from '@/shared/ui/FormFields'
import { MS } from '@/shared/ui/MS'
import { useAdminNotifications } from '../hooks/useAdminNotifications'
import { useAdminUserOptions } from '@/features/admin/core/hooks/useAdminUserOptions'
import { noticeTone, statusLabels } from '@/features/admin/core/lib/adminFormatters'
import { adminPrimaryButton } from '@/features/admin/core/lib/adminStyles'
import { NotificationHistory } from './NotificationHistory'
import { NotificationsSkeleton } from './NotificationsSkeleton'
import { AdminAlert, AdminBadge, AdminCard, AdminPageHeader } from '@/features/admin/core/ui/AdminUi'
import { NOTIFICATION_ICON_OPTIONS, NOTIFICATION_TYPE_OPTIONS } from '../constants'

/** Notificaciones globales o dirigidas a un usuario, personalizadas por el dueño. */
export function NotificationsPage() {
  const {
    notifications,
    total,
    page,
    pageSize,
    totalPages,
    query,
    isLoading,
    isSubmitting,
    error,
    setSearch,
    setType: setHistoryType,
    setAudience: setHistoryAudience,
    setPageSize,
    setPage,
    resetFilters,
    create,
  } = useAdminNotifications()
  const { options: users } = useAdminUserOptions()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [link, setLink] = useState('')
  const [icon, setIcon] = useState('campaign')
  const [type, setType] = useState('info')
  const [audience, setAudience] = useState('all')
  const [notice, setNotice] = useState<string | null>(null)

  const reset = () => {
    setTitle(''); setDescription(''); setLink(''); setIcon('campaign'); setType('info'); setAudience('all')
  }
  const audienceLabel = users.find((item) => item.id === audience)?.businessName ?? 'Todos los usuarios'

  if (isLoading && notifications.length === 0) return <NotificationsSkeleton />

  return (
    <div className="flex flex-col gap-space-lg">
      <AdminPageHeader
        eyebrow="Comunicación"
        title="Notificaciones"
        description="Publica novedades o advertencias para todos o para un comercio en particular."
      />

      {error && <AdminAlert>{error}</AdminAlert>}
      {notice && <AdminAlert tone="success">{notice}</AdminAlert>}

      <div className="grid grid-cols-1 gap-space-md lg:grid-cols-12">
        <AdminCard
          className="lg:col-span-7"
          icon="notifications"
          title="Nueva notificación"
          description="Personaliza el mensaje y elige a quién llegará"
        >
          <form
            className="flex flex-col gap-space-sm"
            onSubmit={async (event) => {
              event.preventDefault()
              const ok = await create({
                title: title.trim(),
                description: description.trim(),
                link: link.trim(),
                icon,
                type: type as 'info' | 'success' | 'warning',
                audience,
                audienceLabel,
              })
              if (ok) { reset(); setNotice('Notificación publicada.') }
            }}
          >
            <TextField id="admin-notice-title" label="Título" icon="title" value={title} onChange={setTitle} placeholder="Novedades de NovusPOS" required />
            <TextAreaField id="admin-notice-body" label="Descripción" icon="notes" rows={3} value={description} onChange={setDescription} placeholder="Cuéntales de qué se trata…" required />
            <div className="grid grid-cols-1 gap-space-sm sm:grid-cols-2">
              <TextField id="admin-notice-link" label="Enlace (opcional)" icon="link" value={link} onChange={setLink} placeholder="/panel/suscripcion" />
              <SelectField id="admin-notice-icon" label="Icono" icon="emoji_symbols" options={NOTIFICATION_ICON_OPTIONS} value={icon} onChange={setIcon} />
              <SelectField id="admin-notice-type" label="Tipo" icon="flag" options={NOTIFICATION_TYPE_OPTIONS} value={type} onChange={setType} />
              <SelectField
                id="admin-notice-audience"
                label="Destinatario"
                icon="group"
                value={audience}
                onChange={setAudience}
                options={[{ value: 'all', label: 'Todos los usuarios' }, ...users.map((item) => ({ value: item.id, label: item.businessName }))]}
              />
            </div>
            <button type="submit" disabled={isSubmitting} className={`${adminPrimaryButton} self-start`}>
              <MS name="send" className="text-[18px]" /> {isSubmitting ? 'Publicando…' : 'Publicar notificación'}
            </button>
          </form>
        </AdminCard>

        <AdminCard className="lg:col-span-5" icon="visibility" title="Vista previa" description="Así verán el aviso tus usuarios">
          <div className="rounded-xl border border-outline-variant/50 bg-surface-container-low p-space-sm flex items-start gap-space-sm">
            <span className="w-10 h-10 shrink-0 rounded-xl bg-primary-fixed/60 text-primary flex items-center justify-center">
              <MS name={icon} className="text-[20px]" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-space-xs">
                <span className="font-label-md text-label-md font-semibold text-on-surface">{title || 'Título de la notificación'}</span>
                <AdminBadge tone={noticeTone(type)}>{statusLabels[type as 'info' | 'success' | 'warning']}</AdminBadge>
              </div>
              <p className="mt-1 font-body-sm text-body-sm text-on-surface-variant">
                {description || 'La descripción aparecerá aquí.'}
              </p>
              {link && <span className="mt-1 block truncate font-label-sm text-label-sm text-primary">{link}</span>}
              <span className="mt-space-xs block font-label-sm text-label-sm text-outline">Para: {audienceLabel}</span>
            </div>
          </div>
        </AdminCard>
      </div>

      <NotificationHistory
        notifications={notifications}
        total={total}
        page={page}
        pageSize={pageSize}
        totalPages={totalPages}
        isLoading={isLoading}
        query={query}
        users={users}
        onSearch={setSearch}
        onType={setHistoryType}
        onAudience={setHistoryAudience}
        onPageSize={setPageSize}
        onPage={setPage}
        onReset={resetFilters}
      />
    </div>
  )
}
