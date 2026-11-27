import { Skeleton, SkeletonCard, SkeletonPage } from '@/shared/ui/Skeleton'

/** Soporte Técnico: el módulo no carga datos al entrar; este skeleton cubre el envío del reporte. */
export function SupportSkeleton({ label = 'Enviando tu reporte…' }: { label?: string }) {
  return (
    <SkeletonPage label={label}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-md items-start">
        <SkeletonCard className="lg:col-span-8 min-h-[420px]" rows={6}>
          <div className="flex flex-col gap-space-sm pt-space-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
              <Skeleton className="h-12 w-full rounded-lg" />
              <Skeleton className="h-12 w-full rounded-lg" />
            </div>
            <Skeleton className="h-12 w-full rounded-lg" />
            <Skeleton className="h-32 w-full rounded-lg" />
            <div className="flex justify-end pt-space-xs">
              <Skeleton className="h-10 w-32 rounded-lg" />
            </div>
          </div>
        </SkeletonCard>
        <SkeletonCard className="lg:col-span-4 min-h-[420px]" rows={5} />
      </div>
    </SkeletonPage>
  )
}
