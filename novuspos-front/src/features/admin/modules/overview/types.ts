import type { AdminOverview } from '@/features/admin/core/types'

export type { AdminOverview, AdminPayment } from '@/features/admin/core/types'

/** Alias para evitar colisionar con el componente `AdminOverview` en los barrels. */
export type AdminOverviewData = AdminOverview

/** Cada entrada del gráfico de distribución de planes. */
export type PlanSale = AdminOverview['planSales'][number]
