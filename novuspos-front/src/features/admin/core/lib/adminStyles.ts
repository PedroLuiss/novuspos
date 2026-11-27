/** Clases visuales reutilizables del panel maestro (MD3, sin CSS nuevo). */

export const adminCard =
  'rounded-2xl border border-outline-variant/50 bg-surface-container-lowest shadow-[0_1px_2px_rgba(16,24,40,0.04),0_14px_36px_-24px_rgba(16,24,40,0.45)]'

export const adminCardPadded = `${adminCard} p-space-lg`

export const adminInput =
  'h-11 w-full rounded-xl border border-outline-variant/70 bg-surface-container-lowest px-space-sm font-body-md text-body-md text-on-surface outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15 placeholder:text-outline'

export const adminPrimaryButton =
  'inline-flex items-center justify-center gap-space-xs rounded-xl bg-primary px-space-lg py-2.5 font-label-md text-label-md font-semibold text-on-primary shadow-sm transition hover:bg-on-primary-fixed-variant disabled:cursor-not-allowed disabled:opacity-60'

export const adminSecondaryButton =
  'inline-flex items-center justify-center gap-space-xs rounded-xl border border-outline-variant/70 bg-surface-container-lowest px-space-md py-2.5 font-label-md text-label-md font-semibold text-on-surface-variant transition hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-50'

export const adminCompactButton =
  'inline-flex items-center justify-center gap-1 rounded-lg border border-outline-variant/70 bg-surface-container-lowest px-space-sm py-1.5 font-label-sm text-label-sm font-semibold text-on-surface-variant transition hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-50'

export const adminEyebrow =
  'font-label-sm text-label-sm uppercase tracking-[0.18em] text-primary font-semibold font-mono'

export const adminTh =
  'p-space-sm text-left font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant'

export const adminTd = 'p-space-sm align-middle'

export const adminAvatar = (name: string) => {
  const parts = name.trim().split(/\s+/)
  return (parts[0]?.[0] ?? '?') + (parts[1]?.[0] ?? '')
}
