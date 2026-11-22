import type { ReactNode } from 'react'

/** Atajo de teclado resaltado en el cuerpo de un texto (idéntico a Stitch). */
export function Kbd({ children }: { children: ReactNode }) {
  return <strong className="text-on-surface font-mono">{children}</strong>
}
