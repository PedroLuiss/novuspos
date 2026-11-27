import { Skeleton, SkeletonCard, SkeletonLines, SkeletonPage } from '@/shared/ui/Skeleton'

/** Copias de Seguridad: cabecera, copia vigente y aviso mientras cargan. */
export function BackupSkeleton() {
  return (
    <SkeletonPage label="Cargando tu copia…">
      <div className="flex items-center gap-space-xs">
        <Skeleton className="h-8 w-8 rounded-lg" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-6 w-64 max-w-full" />
          <Skeleton className="h-3 w-80 max-w-full" />
        </div>
        <Skeleton className="ml-auto hidden h-9 w-28 rounded-lg sm:block" />
      </div>
      <SkeletonCard rows={2}>
        <div className="flex items-center gap-space-md pt-space-xs">
          <Skeleton className="h-16 w-16 shrink-0 rounded-xl" />
          <div className="flex flex-1 flex-col gap-2">
            <SkeletonLines widths={['60%', '40%']} />
          </div>
          <Skeleton className="hidden h-8 w-32 rounded-full sm:block" />
        </div>
      </SkeletonCard>
      <SkeletonCard rows={2} />
    </SkeletonPage>
  )
}
