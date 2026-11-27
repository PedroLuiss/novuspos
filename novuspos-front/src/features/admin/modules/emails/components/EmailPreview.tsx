import { useMemo } from 'react'
import { MS } from '@/shared/ui/MS'
import { htmlToText, sanitizeEmailHtml } from '../lib/emailHtml'
import { AdminBadge, AdminState } from '@/features/admin/core/ui/AdminUi'

/** Vista previa del correo real: solo inserta HTML después de sanearlo. */
export function EmailPreview({
  subject,
  html,
  audienceLabel,
}: {
  subject: string
  html: string
  audienceLabel: string
}) {
  const safeHtml = useMemo(() => sanitizeEmailHtml(html), [html])

  if (!htmlToText(safeHtml)) {
    return <AdminState label="La vista previa aparecerá mientras escribes." />
  }

  return (
    <div className="overflow-hidden rounded-xl border border-outline-variant/50 bg-surface-container-lowest">
      <div className="flex items-center gap-space-xs border-b border-outline-variant/50 bg-surface-container px-space-sm py-2">
        <span className="w-7 h-7 rounded-lg bg-primary text-on-primary flex items-center justify-center">
          <MS name="mail" className="text-[15px]" />
        </span>
        <span className="font-label-sm text-label-sm text-on-surface-variant">NovusPOS</span>
      </div>
      <div className="flex flex-col gap-1 border-b border-outline-variant/50 px-space-sm py-space-xs">
        <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline">Asunto</span>
        <span className="font-label-md text-label-md font-semibold text-on-surface">{subject || 'Sin asunto'}</span>
        <span className="mt-1 font-label-sm text-label-sm uppercase tracking-wider text-outline">Para</span>
        <AdminBadge tone="info">{audienceLabel}</AdminBadge>
      </div>
      <div
        className="px-space-sm py-space-sm font-body-md text-body-md text-on-surface-variant [&_a]:text-primary [&_a]:underline [&_h2]:mb-2 [&_h2]:font-headline-sm [&_h2]:font-bold [&_h2]:text-on-surface [&_h3]:mb-2 [&_h3]:font-label-lg [&_h3]:font-semibold [&_h3]:text-on-surface [&_img]:my-2 [&_img]:max-w-full [&_img]:rounded-xl [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-5"
        dangerouslySetInnerHTML={{ __html: safeHtml }}
      />
    </div>
  )
}
