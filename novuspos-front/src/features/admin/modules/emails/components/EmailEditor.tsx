import { useEffect, useRef, useState, type MouseEvent } from 'react'
import { TextField } from '@/shared/ui/FormFields'
import { MS } from '@/shared/ui/MS'
import { adminPrimaryButton, adminSecondaryButton } from '@/features/admin/core/lib/adminStyles'
import { htmlToText, isValidEmailUrl } from '../lib/emailHtml'
import { EMAIL_TEMPLATE } from '../constants'
import { AdminModal } from '@/features/admin/core/ui/AdminUi'

interface Props {
  id: string
  value: string
  onChange: (html: string) => void
  error?: string
}

type Dialog = 'link' | 'image' | null

const toolButton =
  'w-9 h-9 rounded-lg text-on-surface-variant flex items-center justify-center transition hover:bg-surface-container-high hover:text-primary'

const keepEditorFocus = (event: MouseEvent<HTMLButtonElement>) => event.preventDefault()

const getEditor = (id: string) => document.getElementById(id) as HTMLDivElement | null

/** Editor enriquecido sin dependencias: el HTML se sanea al guardar y al mostrar. */
export function EmailEditor({ id, value, onChange, error }: Props) {
  const savedRangeRef = useRef<Range | null>(null)
  const [dialog, setDialog] = useState<Dialog>(null)
  const [url, setUrl] = useState('')
  const [dialogError, setDialogError] = useState<string | null>(null)

  useEffect(() => {
    const node = getEditor(id)
    if (node && node.innerHTML !== value) node.innerHTML = value
  }, [id, value])

  const emit = () => onChange(getEditor(id)?.innerHTML ?? '')

  const run = (command: string, commandValue?: string) => {
    getEditor(id)?.focus()
    document.execCommand(command, false, commandValue)
    emit()
  }

  const openDialog = (next: Exclude<Dialog, null>) => {
    const selection = window.getSelection()
    savedRangeRef.current = selection?.rangeCount ? selection.getRangeAt(0).cloneRange() : null
    setUrl('')
    setDialogError(null)
    setDialog(next)
  }

  const restoreSelection = () => {
    const selection = window.getSelection()
    getEditor(id)?.focus()
    if (!savedRangeRef.current || !selection) return
    selection.removeAllRanges()
    selection.addRange(savedRangeRef.current)
  }

  const insertDialog = () => {
    if (!dialog) return
    if (!isValidEmailUrl(url, dialog === 'image')) {
      setDialogError(dialog === 'image' ? 'Escribe una URL de imagen válida (https://…).' : 'Escribe un enlace válido (https://… o correo@ejemplo.com).')
      return
    }

    restoreSelection()
    if (dialog === 'link') {
      const label = savedRangeRef.current?.toString().trim() || url.trim()
      const anchor = document.createElement('a')
      anchor.href = url.trim()
      anchor.target = '_blank'
      anchor.rel = 'noopener noreferrer'
      anchor.textContent = label
      document.execCommand('insertHTML', false, anchor.outerHTML)
    } else {
      const image = document.createElement('img')
      image.src = url.trim()
      image.alt = 'Imagen del correo'
      image.style.setProperty('max-width', '100%')
      image.style.setProperty('height', 'auto')
      image.style.setProperty('border-radius', '12px')
      document.execCommand('insertHTML', false, image.outerHTML)
    }
    emit()
    setDialog(null)
  }

  return (
    <div className="flex flex-col gap-space-xs">
      <div className="flex flex-wrap items-center gap-1 rounded-t-xl border border-outline-variant/70 bg-surface-container px-space-xs py-1">
        <button type="button" title="Título" aria-label="Título" onClick={() => run('formatBlock', '<h2>')} onMouseDown={keepEditorFocus}
          className={toolButton}>
          <MS name="title" className="text-[19px]" />
        </button>
        <button type="button" title="Subtítulo" aria-label="Subtítulo" onClick={() => run('formatBlock', '<h3>')} onMouseDown={keepEditorFocus}
          className={toolButton}>
          <MS name="subtitles" className="text-[19px]" />
        </button>
        <button type="button" title="Negrita" aria-label="Negrita" onClick={() => run('bold')} onMouseDown={keepEditorFocus}
          className={toolButton}>
          <MS name="format_bold" className="text-[19px]" />
        </button>
        <button type="button" title="Cursiva" aria-label="Cursiva" onClick={() => run('italic')} onMouseDown={keepEditorFocus}
          className={toolButton}>
          <MS name="format_italic" className="text-[19px]" />
        </button>
        <button type="button" title="Subrayado" aria-label="Subrayado" onClick={() => run('underline')} onMouseDown={keepEditorFocus}
          className={toolButton}>
          <MS name="format_underlined" className="text-[19px]" />
        </button>
        <button type="button" title="Lista" aria-label="Lista" onClick={() => run('insertUnorderedList')} onMouseDown={keepEditorFocus}
          className={toolButton}>
          <MS name="format_list_bulleted" className="text-[19px]" />
        </button>
        <button type="button" title="Lista numerada" aria-label="Lista numerada" onClick={() => run('insertOrderedList')} onMouseDown={keepEditorFocus}
          className={toolButton}>
          <MS name="format_list_numbered" className="text-[19px]" />
        </button>
        <button type="button" title="Enlace" aria-label="Enlace" onClick={() => openDialog('link')} onMouseDown={keepEditorFocus}
          className={toolButton}>
          <MS name="link" className="text-[19px]" />
        </button>
        <button type="button" title="Imagen" aria-label="Imagen" onClick={() => openDialog('image')} onMouseDown={keepEditorFocus}
          className={toolButton}>
          <MS name="image" className="text-[19px]" />
        </button>
        <button type="button" title="Plantilla" aria-label="Plantilla" onClick={() => run('insertHTML', EMAIL_TEMPLATE)} onMouseDown={keepEditorFocus}
          className={toolButton}>
          <MS name="article" className="text-[19px]" />
        </button>
        <button type="button" title="Limpiar formato" aria-label="Limpiar formato" onClick={() => run('removeFormat')} onMouseDown={keepEditorFocus}
          className={toolButton}>
          <MS name="format_clear" className="text-[19px]" />
        </button>
      </div>

      <div className="relative">
        {!htmlToText(value) && (
          <span className="pointer-events-none absolute left-space-sm top-space-sm font-body-md text-body-md text-outline">
            Escribe aquí tu mensaje…
          </span>
        )}
        <div
          id={id}
          role="textbox"
          aria-label="Mensaje del correo"
          aria-multiline="true"
          contentEditable
          suppressContentEditableWarning
          onInput={emit}
          onBlur={emit}
          className="min-h-[260px] w-full rounded-b-xl border border-outline-variant/70 bg-surface-container-lowest px-space-sm py-space-sm font-body-md text-body-md leading-relaxed text-on-surface outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15 [&_a]:text-primary [&_a]:underline [&_h2]:font-headline-sm [&_h2]:font-bold [&_h2]:text-on-surface [&_h3]:font-label-lg [&_h3]:font-semibold [&_h3]:text-on-surface [&_img]:my-2 [&_img]:max-w-full [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-5"
        />
      </div>

      {error && <span className="px-1 font-body-sm text-body-sm text-error">{error}</span>}

      {dialog && (
        <AdminModal
          title={dialog === 'link' ? 'Insertar enlace' : 'Insertar imagen'}
          subtitle={dialog === 'link' ? 'El texto seleccionado se convertirá en el enlace.' : 'Pega la URL de una imagen pública.'}
          onClose={() => setDialog(null)}
          footer={
            <>
              <button type="button" onClick={() => setDialog(null)} className={adminSecondaryButton}>Cancelar</button>
              <button type="button" onClick={insertDialog} className={adminPrimaryButton}>
                {dialog === 'link' ? 'Insertar enlace' : 'Insertar imagen'}
              </button>
            </>
          }
        >
          <TextField
            id={dialog === 'link' ? 'admin-email-link-url' : 'admin-email-image-url'}
            label={dialog === 'link' ? 'Enlace' : 'URL de la imagen'}
            icon={dialog === 'link' ? 'link' : 'image'}
            placeholder="https://…"
            value={url}
            onChange={(next) => { setUrl(next); setDialogError(null) }}
            error={dialogError ?? undefined}
          />
        </AdminModal>
      )}
    </div>
  )
}
