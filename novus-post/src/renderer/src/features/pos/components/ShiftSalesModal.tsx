import React, { useEffect, useMemo, useState } from 'react'
import type {
  BusinessConfig,
  CashRegisterData,
  CashShift,
  CashTicket,
  CurrencyVesExchangeRate,
  Product
} from '@shared/contracts'
import type { CartItem } from '@renderer/shared/types/domain'
import { useBusinessConfig } from '@renderer/shared/hooks/useBusinessConfig'
import { cashApi, cashErrorMessage } from '@renderer/features/cash-shift/api/cash.api'
import { posProductsApi } from '../api/products.api'
import { formatCurrency, formatVesAmount } from '@renderer/shared/lib/currency'
import {
  printInvoicePdf,
  type InvoicePdfData
} from '../lib/generateInvoicePdf'
import TicketPreviewModal from './TicketPreviewModal'
import {
  AlertCircle,
  Banknote,
  Check,
  Clock,
  Copy,
  CreditCard,
  Eye,
  Filter,
  Layers,
  Printer,
  Receipt,
  RefreshCw,
  Search,
  ShoppingCart,
  User,
  X
} from '@renderer/shared/icons/Icons'

const PAGE_SIZE = 8

export interface ShiftSalesModalProps {
  isOpen: boolean
  onClose: () => void
  cashShiftOpen: boolean
  cashierName: string
  currentCartCount: number
  onCloneSale: (items: CartItem[], customerId?: string) => Promise<boolean> | boolean | void
  exchangeRate: CurrencyVesExchangeRate | null
  canOverrideNoStock: boolean
  onShowToast?: (message: string, type?: 'success' | 'error' | 'info') => void
}

function paymentBadge(method: CashTicket['payment']['method']): {
  label: string
  bg: string
  text: string
  border: string
  icon: React.ReactNode
} {
  switch (method) {
    case 'cash':
      return {
        label: 'Efectivo',
        bg: 'bg-emerald-50',
        text: 'text-emerald-700',
        border: 'border-emerald-200',
        icon: <Banknote size={12} className="text-emerald-600" />
      }
    case 'card':
      return {
        label: 'Tarjeta',
        bg: 'bg-blue-50',
        text: 'text-blue-700',
        border: 'border-blue-200',
        icon: <CreditCard size={12} className="text-blue-600" />
      }
    case 'mixed':
      return {
        label: 'Mixto',
        bg: 'bg-purple-50',
        text: 'text-purple-700',
        border: 'border-purple-200',
        icon: <Layers size={12} className="text-purple-600" />
      }
    case 'credit':
      return {
        label: 'Crédito',
        bg: 'bg-amber-50',
        text: 'text-amber-700',
        border: 'border-amber-200',
        icon: <Clock size={12} className="text-amber-600" />
      }
    default:
      return {
        label: 'Otro',
        bg: 'bg-slate-50',
        text: 'text-slate-700',
        border: 'border-slate-200',
        icon: <Receipt size={12} className="text-slate-600" />
      }
  }
}

function createFallbackProduct(
  productId: string,
  code: string,
  name: string,
  price: number,
  cost = 0
): Product {
  return {
    id: productId,
    code,
    name,
    category: 'General',
    unit: 'UND',
    salePrice: price,
    costPrice: cost,
    stock: 999,
    minStock: 0,
    active: true,
    allowDecimals: false
  } as unknown as Product
}

function cashTicketToInvoiceData(
  ticket: CashTicket,
  business: BusinessConfig,
  exchangeRate: CurrencyVesExchangeRate | null
): InvoicePdfData {
  const items: CartItem[] = ticket.items.map((it) => ({
    product: createFallbackProduct(it.productId, it.productCode, it.productName, it.unitPrice, it.unitCost),
    quantity: it.quantity,
    discountPercent: it.discountPercent ?? 0,
    customPrice: it.unitPrice,
    total: it.lineTotal
  }))

  const taxBreakdown =
    ticket.taxBreakdown && ticket.taxBreakdown.length > 0
      ? ticket.taxBreakdown
      : [
          {
            taxName: business.taxName || 'IVA',
            taxRate: business.taxRate ?? 16,
            amount: ticket.tax
          }
        ]

  return {
    business,
    items,
    subtotal: ticket.subtotal,
    tax: ticket.tax,
    discount: ticket.discount,
    total: ticket.total,
    taxBreakdown,
    payment: {
      ...ticket.payment,
      ticketNumber: ticket.ticketNumber,
      customerId: ticket.customerId
    },
    ticketNumber: ticket.ticketNumber,
    cashierName: ticket.cashierName,
    customerDisplayName: ticket.customerName || 'Consumidor Final',
    exchangeRate
  }
}

export const ShiftSalesModal: React.FC<ShiftSalesModalProps> = ({
  isOpen,
  onClose,
  cashShiftOpen,
  cashierName,
  currentCartCount,
  onCloneSale,
  exchangeRate,
  canOverrideNoStock,
  onShowToast
}) => {
  const { config: businessConfig } = useBusinessConfig()
  const [registerData, setRegisterData] = useState<CashRegisterData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterMethod, setFilterMethod] = useState<'all' | 'cash' | 'card' | 'mixed' | 'credit'>('all')
  const [currentPage, setCurrentPage] = useState(1)

  // Sub-modal state: View Ticket
  const [ticketToPreview, setTicketToPreview] = useState<{
    ticket: CashTicket
    items: CartItem[]
  } | null>(null)

  // Cloning confirmation state
  const [pendingCloneTicket, setPendingCloneTicket] = useState<CashTicket | null>(null)
  const [isCloning, setIsCloning] = useState(false)

  // Quick reprinting feedback state
  const [reprintingId, setReprintingId] = useState<string | null>(null)

  const loadShiftData = async (): Promise<void> => {
    setIsLoading(true)
    setError(null)
    try {
      // Calling getRegister without argument fetches the currently active shift
      const data = await cashApi.getRegister()
      setRegisterData(data)
    } catch (err) {
      setError(cashErrorMessage(err))
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (isOpen) {
      void loadShiftData()
      setSearchQuery('')
      setFilterMethod('all')
      setCurrentPage(1)
    }
  }, [isOpen])

  // Extract shift and tickets
  const activeShift: CashShift | null = registerData?.shift ?? null
  const tickets: CashTicket[] = registerData?.tickets ?? []

  // Metrics for current active shift
  const shiftMetrics = useMemo(() => {
    const totalSales = tickets.reduce((acc, t) => (t.returnedAt ? acc : acc + t.total), 0)
    const totalCash = tickets.reduce((acc, t) => {
      if (t.returnedAt) return acc
      if (t.payment.method === 'cash') return acc + t.total
      if (t.payment.method === 'mixed') return acc + (t.payment.cashAmount ?? 0)
      return acc
    }, 0)
    const totalCard = tickets.reduce((acc, t) => {
      if (t.returnedAt) return acc
      if (t.payment.method === 'card') return acc + t.total
      if (t.payment.method === 'mixed') return acc + (t.payment.cardAmount ?? 0)
      return acc
    }, 0)
    const count = tickets.filter((t) => !t.returnedAt).length
    return { totalSales, totalCash, totalCard, count }
  }, [tickets])

  // Filtered tickets
  const filteredTickets = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    return tickets.filter((ticket) => {
      // Payment method filter
      if (filterMethod !== 'all' && ticket.payment.method !== filterMethod) {
        return false
      }
      // Text search query
      if (!q) return true
      const matchNumber = ticket.ticketNumber.toLowerCase().includes(q)
      const matchCustomer = (ticket.customerName || '').toLowerCase().includes(q)
      const matchItem = ticket.items.some((i) => i.productName.toLowerCase().includes(q))
      const matchTotal = ticket.total.toString().includes(q)
      return matchNumber || matchCustomer || matchItem || matchTotal
    })
  }, [tickets, searchQuery, filterMethod])

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredTickets.length / PAGE_SIZE))
  const page = Math.min(currentPage, totalPages)
  const paginatedTickets = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE
    return filteredTickets.slice(start, start + PAGE_SIZE)
  }, [filteredTickets, page])

  // Execute Ticket Cloning
  const handleExecuteClone = async (ticket: CashTicket): Promise<void> => {
    setIsCloning(true)
    try {
      let warningMessage: string | undefined
      const items: CartItem[] = await Promise.all(
        ticket.items.map(async (item) => {
          let product: Product
          try {
            const fetched = await posProductsApi.getById(item.productId)
            if (fetched) {
              product = fetched
              if (product.trackStock !== false && product.stock <= 0 && !canOverrideNoStock) {
                warningMessage = `Aviso: "${product.name}" tiene stock agotado.`
              }
            } else {
              product = createFallbackProduct(
                item.productId,
                item.productCode,
                item.productName,
                item.unitPrice,
                item.unitCost
              )
            }
          } catch {
            product = createFallbackProduct(
              item.productId,
              item.productCode,
              item.productName,
              item.unitPrice,
              item.unitCost
            )
          }

          return {
            product,
            quantity: item.quantity,
            discountPercent: item.discountPercent ?? 0,
            customPrice: item.unitPrice,
            total: item.lineTotal
          }
        })
      )

      await onCloneSale(items, ticket.customerId)

      if (onShowToast) {
        if (warningMessage) {
          onShowToast(`${warningMessage} Factura ${ticket.ticketNumber} clonada al carrito.`, 'info')
        } else {
          onShowToast(
            `Factura ${ticket.ticketNumber} clonada exitosamente (${items.length} productos cargados).`,
            'success'
          )
        }
      }

      setPendingCloneTicket(null)
      onClose()
    } catch (err) {
      if (onShowToast) {
        onShowToast(`Error al clonar factura: ${String(err)}`, 'error')
      }
    } finally {
      setIsCloning(false)
    }
  }

  const handleInitiateClone = (ticket: CashTicket): void => {
    if (currentCartCount > 0) {
      setPendingCloneTicket(ticket)
    } else {
      void handleExecuteClone(ticket)
    }
  }

  // Quick Reprint
  const handleReprint = (ticket: CashTicket): void => {
    setReprintingId(ticket.id)
    try {
      const invoiceData = cashTicketToInvoiceData(ticket, businessConfig, exchangeRate)
      const paperSize = businessConfig.invoicePaperSize || 'TICKET_80MM'
      printInvoicePdf(invoiceData, paperSize)
      if (onShowToast) {
        onShowToast(`Enviando factura ${ticket.ticketNumber} a imprimir...`, 'info')
      }
    } catch (err) {
      if (onShowToast) {
        onShowToast(`No se pudo imprimir: ${String(err)}`, 'error')
      }
    } finally {
      setTimeout(() => setReprintingId(null), 1000)
    }
  }

  // View Ticket Preview
  const handleViewTicket = async (ticket: CashTicket): Promise<void> => {
    const items: CartItem[] = ticket.items.map((it) => ({
      product: createFallbackProduct(it.productId, it.productCode, it.productName, it.unitPrice, it.unitCost),
      quantity: it.quantity,
      discountPercent: it.discountPercent ?? 0,
      customPrice: it.unitPrice,
      total: it.lineTotal
    }))
    setTicketToPreview({ ticket, items })
  }

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-900/60 backdrop-blur-xs animate-backdrop">
        <div className="flex flex-col w-[96vw] max-w-6xl 2xl:max-w-7xl h-[92vh] max-h-[860px] bg-white rounded-lg shadow-2xl border border-[#D1D1D1] overflow-hidden animate-modal">
          {/* Header */}
          <header className="flex items-center justify-between px-5 py-3.5 bg-white border-b border-[#E5E5E5] shrink-0">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-[4px] bg-[#0067C0]/10 text-[#0067C0] border border-[#0067C0]/20">
                <Receipt size={18} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-bold text-[#1B1B1B] tracking-tight">
                    Ventas del Turno Activo
                  </h2>
                  {activeShift?.isOpen ? (
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Caja Abierta
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                      Caja Cerrada
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#5C5C5C] flex flex-wrap items-center gap-2 mt-0.5">
                  <span>Estación: <strong className="text-[#1B1B1B] font-semibold">{activeShift?.stationName || 'CAJA-01'}</strong></span>
                  <span>•</span>
                  <span>Cajero: <strong className="text-[#1B1B1B] font-semibold">{activeShift?.cashierName || cashierName}</strong></span>
                  {activeShift?.openedAt && (
                    <>
                      <span>•</span>
                      <span>Apertura: {new Date(activeShift.openedAt).toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit' })}</span>
                    </>
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => void loadShiftData()}
                disabled={isLoading}
                title="Actualizar listado de facturas"
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#1B1B1B] hover:bg-[#F9F9F9] bg-white border border-[#D1D1D1] rounded-[4px] shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition-colors cursor-pointer disabled:opacity-50"
              >
                <RefreshCw size={13} className={isLoading ? 'animate-spin text-[#0067C0]' : 'text-[#5C5C5C]'} />
                <span>Actualizar</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                aria-label="Cerrar modal"
                className="p-1.5 text-[#5C5C5C] hover:text-[#1B1B1B] hover:bg-[#EBEBEB] rounded-[4px] transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>
          </header>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3 p-3 sm:p-4 bg-slate-50 border-b border-slate-200 shrink-0">
            {isLoading ? (
              <>
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-white border border-slate-200 rounded-lg p-2.5 animate-pulse space-y-1.5 shadow-2xs">
                    <div className="h-3 w-16 bg-slate-200 rounded" />
                    <div className="h-6 w-24 bg-slate-300 rounded" />
                  </div>
                ))}
              </>
            ) : (
              <>
                <div className="bg-white border border-slate-200 rounded-lg p-2.5 shadow-2xs flex items-center gap-3">
                  <div className="w-9 h-9 rounded-md bg-blue-50 text-[#0067C0] flex items-center justify-center shrink-0">
                    <Receipt size={18} />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
                      Total Facturado
                    </span>
                    <span className="text-sm sm:text-base font-bold font-mono text-slate-900 truncate block">
                      {formatCurrency(shiftMetrics.totalSales, businessConfig.currency)}
                    </span>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-lg p-2.5 shadow-2xs flex items-center gap-3">
                  <div className="w-9 h-9 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <Banknote size={18} />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
                      En Efectivo
                    </span>
                    <span className="text-sm sm:text-base font-bold font-mono text-emerald-700 truncate block">
                      {formatCurrency(shiftMetrics.totalCash, businessConfig.currency)}
                    </span>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-lg p-2.5 shadow-2xs flex items-center gap-3">
                  <div className="w-9 h-9 rounded-md bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                    <CreditCard size={18} />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
                      Tarjetas / Mixto
                    </span>
                    <span className="text-sm sm:text-base font-bold font-mono text-indigo-700 truncate block">
                      {formatCurrency(shiftMetrics.totalCard, businessConfig.currency)}
                    </span>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-lg p-2.5 shadow-2xs flex items-center gap-3">
                  <div className="w-9 h-9 rounded-md bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                    <Check size={18} />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
                      Facturas Emitidas
                    </span>
                    <span className="text-sm sm:text-base font-bold font-mono text-slate-900 block">
                      {shiftMetrics.count} <span className="text-xs font-normal text-slate-500">tickets</span>
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Search & Filter Toolbar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 px-4 sm:px-5 py-3 border-b border-slate-200 bg-white shrink-0">
            {/* Search Box */}
            <div className="relative flex-1 min-w-[200px] max-w-lg">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setCurrentPage(1)
                }}
                placeholder="Buscar por N° ticket, cliente, artículo..."
                className="w-full pl-9 pr-3 py-1.5 text-xs text-slate-800 bg-slate-50 hover:bg-slate-100 focus:bg-white border border-slate-300 rounded-md focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                >
                  <X size={13} />
                </button>
              )}
            </div>

            {/* Payment Method Filters */}
            <div className="flex items-center gap-1.5 overflow-x-auto">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mr-1 flex items-center gap-1 shrink-0">
                <Filter size={11} /> Pago:
              </span>
              {(['all', 'cash', 'card', 'mixed', 'credit'] as const).map((m) => {
                const labels: Record<string, string> = {
                  all: 'Todos',
                  cash: 'Efectivo',
                  card: 'Tarjeta',
                  mixed: 'Mixto',
                  credit: 'Crédito'
                }
                const active = filterMethod === m
                return (
                  <button
                    key={m}
                    type="button"
                    onClick={() => {
                      setFilterMethod(m)
                      setCurrentPage(1)
                    }}
                    className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors cursor-pointer shrink-0 ${
                      active
                        ? 'bg-[#0067C0] text-white shadow-2xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    {labels[m]}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Table Container */}
          <div className="flex-1 overflow-x-auto overflow-y-auto bg-white">
            <table className="w-full text-left text-xs border-collapse min-w-[780px] xl:min-w-full">
              <thead className="sticky top-0 z-10 bg-slate-100 border-b border-slate-200 text-slate-700 font-semibold text-[11px] uppercase tracking-wider select-none shadow-2xs">
                <tr>
                  <th className="py-2.5 px-3 sm:px-4 w-32 sm:w-36">N° Factura</th>
                  <th className="py-2.5 px-3 sm:px-4 w-28 sm:w-32">Hora</th>
                  <th className="py-2.5 px-3 sm:px-4">Cliente</th>
                  <th className="py-2.5 px-3 sm:px-4 text-center w-28">Método Pago</th>
                  <th className="py-2.5 px-3 sm:px-4 text-center w-20 sm:w-24">Ítems</th>
                  <th className="py-2.5 px-3 sm:px-4 text-right w-28 sm:w-36">Total</th>
                  <th className="py-2.5 px-3 sm:px-4 text-center w-24">Estado</th>
                  <th className="py-2.5 px-3 sm:px-4 text-right w-36 sm:w-44">Acciones</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {isLoading ? (
                  /* ========================================================= */
                  /* SKELETON LOADING STATE (EMPRESARIAL / HIGH QUALITY)       */
                  /* ========================================================= */
                  Array.from({ length: 6 }).map((_, index) => (
                    <tr key={`skeleton-${index}`} className="animate-pulse">
                      <td className="py-3 px-3 sm:px-4">
                        <div className="h-4 w-24 bg-slate-200 rounded mb-1" />
                        <div className="h-2.5 w-16 bg-slate-100 rounded" />
                      </td>
                      <td className="py-3 px-3 sm:px-4">
                        <div className="h-4 w-20 bg-slate-200 rounded" />
                      </td>
                      <td className="py-3 px-3 sm:px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-slate-200 shrink-0" />
                          <div className="h-4 w-28 bg-slate-200 rounded" />
                        </div>
                      </td>
                      <td className="py-3 px-3 sm:px-4 text-center">
                        <div className="h-5 w-20 bg-slate-200 rounded-full mx-auto" />
                      </td>
                      <td className="py-3 px-3 sm:px-4 text-center">
                        <div className="h-4 w-10 bg-slate-200 rounded mx-auto" />
                      </td>
                      <td className="py-3 px-3 sm:px-4 text-right">
                        <div className="h-4 w-20 bg-slate-200 rounded ml-auto mb-1" />
                        <div className="h-2.5 w-14 bg-slate-100 rounded ml-auto" />
                      </td>
                      <td className="py-3 px-3 sm:px-4 text-center">
                        <div className="h-5 w-16 bg-slate-200 rounded-full mx-auto" />
                      </td>
                      <td className="py-3 px-3 sm:px-4 text-right">
                        <div className="flex justify-end gap-1.5">
                          <div className="h-7 w-7 bg-slate-200 rounded" />
                          <div className="h-7 w-7 bg-slate-200 rounded" />
                          <div className="h-7 w-7 bg-slate-200 rounded" />
                        </div>
                      </td>
                    </tr>
                  ))
                ) : !activeShift || !activeShift.isOpen ? (
                  /* Empty state: No active cash shift */
                  <tr>
                    <td colSpan={8} className="py-20 text-center text-slate-500">
                      <div className="w-14 h-14 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center mx-auto mb-3 border border-amber-200">
                        <AlertCircle size={28} />
                      </div>
                      <h4 className="text-sm font-bold text-slate-800">Caja Cerrada</h4>
                      <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                        No hay una apertura de caja activa en esta estación. Abre un turno de caja para emitir ventas y ver el historial del turno.
                      </p>
                    </td>
                  </tr>
                ) : paginatedTickets.length === 0 ? (
                  /* Empty state: No tickets matching filter or shift is brand new */
                  <tr>
                    <td colSpan={8} className="py-20 text-center text-slate-500">
                      <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                        <Receipt size={28} />
                      </div>
                      <h4 className="text-sm font-bold text-slate-800">
                        {tickets.length === 0 ? 'Sin ventas en esta apertura de caja' : 'No se encontraron facturas'}
                      </h4>
                      <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                        {tickets.length === 0
                          ? 'Las facturas que emitas durante este turno de caja aparecerán aquí organizadas en tiempo real.'
                          : 'Prueba cambiando los términos de búsqueda o el filtro de método de pago.'}
                      </p>
                    </td>
                  </tr>
                ) : (
                  /* Real Data Rows */
                  paginatedTickets.map((ticket) => {
                    const badge = paymentBadge(ticket.payment.method)
                    const totalQty = ticket.items.reduce((acc, it) => acc + it.quantity, 0)
                    const isReprinting = reprintingId === ticket.id
                    const isReturned = Boolean(ticket.returnedAt)

                    return (
                      <tr
                        key={ticket.id}
                        className={`transition-colors hover:bg-blue-50/40 group ${
                          isReturned ? 'bg-amber-50/20' : ''
                        }`}
                      >
                        {/* Ticket Number */}
                        <td className="py-2.5 px-3 sm:px-4 font-mono font-bold text-xs text-[#0067C0] whitespace-nowrap">
                          <span>{ticket.ticketNumber}</span>
                          <span className="block text-[10px] font-normal text-slate-400 font-sans">
                            {ticket.stationName}
                          </span>
                        </td>

                        {/* Sold At Time */}
                        <td className="py-2.5 px-3 sm:px-4 text-xs text-slate-600 whitespace-nowrap">
                          <span className="font-medium text-slate-800 block">
                            {new Date(ticket.soldAt).toLocaleTimeString('es-VE', {
                              hour: '2-digit',
                              minute: '2-digit',
                              second: '2-digit'
                            })}
                          </span>
                          <span className="text-[10px] text-slate-400 block">
                            {new Date(ticket.soldAt).toLocaleDateString('es-VE')}
                          </span>
                        </td>

                        {/* Customer */}
                        <td className="py-2.5 px-3 sm:px-4 text-xs text-slate-800">
                          <div className="flex items-center gap-1.5">
                            <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                              <User size={11} />
                            </div>
                            <span className="font-medium truncate max-w-[150px] sm:max-w-[220px] 2xl:max-w-[340px] block" title={ticket.customerName || 'Consumidor Final'}>
                              {ticket.customerName || 'Consumidor Final'}
                            </span>
                          </div>
                        </td>

                        {/* Payment Method Badge */}
                        <td className="py-2.5 px-3 sm:px-4 text-center whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border ${badge.bg} ${badge.text} ${badge.border}`}
                          >
                            {badge.icon}
                            {badge.label}
                          </span>
                        </td>

                        {/* Items Count */}
                        <td className="py-2.5 px-3 sm:px-4 text-center text-xs text-slate-600 whitespace-nowrap">
                          <span className="font-semibold text-slate-800">{totalQty}</span>
                          <span className="text-[10px] text-slate-400 block">
                            ({ticket.items.length} {ticket.items.length === 1 ? 'ítem' : 'ítems'})
                          </span>
                        </td>

                        {/* Total Amount */}
                        <td className="py-2.5 px-3 sm:px-4 text-right whitespace-nowrap">
                          <span className="font-mono font-bold text-xs text-slate-900 block">
                            {formatCurrency(ticket.total, ticket.currency)}
                          </span>
                          {exchangeRate && ticket.currency === 'USD' && (
                            <span className="font-mono text-[10px] text-slate-400 block">
                              Bs. {formatVesAmount(ticket.total * exchangeRate.rate)}
                            </span>
                          )}
                        </td>

                        {/* Status */}
                        <td className="py-2.5 px-3 sm:px-4 text-center whitespace-nowrap">
                          {isReturned ? (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                              DEVUELTA
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                              COBRADA
                            </span>
                          )}
                        </td>

                        {/* Action Buttons */}
                        <td className="py-2.5 px-3 sm:px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Ver Ticket */}
                            <button
                              type="button"
                              onClick={() => void handleViewTicket(ticket)}
                              title="Ver comprobante y detalle del ticket"
                              className="p-1.5 text-slate-600 hover:text-[#0067C0] hover:bg-blue-50 border border-slate-200 hover:border-blue-200 rounded transition-colors cursor-pointer"
                            >
                              <Eye size={14} />
                            </button>

                            {/* Reimprimir Ticket */}
                            <button
                              type="button"
                              onClick={() => handleReprint(ticket)}
                              disabled={isReprinting}
                              title="Reimprimir ticket de venta"
                              className="p-1.5 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-200 rounded transition-colors cursor-pointer disabled:opacity-40"
                            >
                              <Printer size={14} className={isReprinting ? 'animate-bounce text-emerald-600' : ''} />
                            </button>

                            {/* Clonar Factura al Carrito */}
                            <button
                              type="button"
                              onClick={() => handleInitiateClone(ticket)}
                              title="Clonar factura (cargar estos productos para una nueva venta)"
                              className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:text-white bg-slate-100 hover:bg-[#0067C0] border border-slate-200 hover:border-[#0067C0] rounded transition-all cursor-pointer shadow-2xs"
                            >
                              <Copy size={12} />
                              <span>Clonar</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Footer with Pagination */}
          <footer className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 shrink-0">
            <div>
              Mostrando <strong className="text-slate-800">{filteredTickets.length > 0 ? (page - 1) * PAGE_SIZE + 1 : 0}</strong> a{' '}
              <strong className="text-slate-800">
                {Math.min(page * PAGE_SIZE, filteredTickets.length)}
              </strong>{' '}
              de <strong className="text-slate-800">{filteredTickets.length}</strong> facturas
              {tickets.length > filteredTickets.length && ` (filtradas de un total de ${tickets.length})`}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="px-2.5 py-1 text-xs font-semibold bg-white hover:bg-slate-100 disabled:opacity-40 border border-slate-200 rounded transition-colors cursor-pointer"
                >
                  Anterior
                </button>
                <span className="px-2 font-medium text-slate-700">
                  {page} de {totalPages}
                </span>
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="px-2.5 py-1 text-xs font-semibold bg-white hover:bg-slate-100 disabled:opacity-40 border border-slate-200 rounded transition-colors cursor-pointer"
                >
                  Siguiente
                </button>
              </div>
            )}
          </footer>
        </div>
      </div>

      {/* ========================================================= */}
      {/* MODAL: PREVIEW DE TICKET SELECCIONADO                    */}
      {/* ========================================================= */}
      {ticketToPreview && (
        <TicketPreviewModal
          isOpen={Boolean(ticketToPreview)}
          onClose={() => setTicketToPreview(null)}
          items={ticketToPreview.items}
          subtotal={ticketToPreview.ticket.subtotal}
          tax={ticketToPreview.ticket.tax}
          discount={ticketToPreview.ticket.discount}
          total={ticketToPreview.ticket.total}
          payment={{
            ...ticketToPreview.ticket.payment,
            ticketNumber: ticketToPreview.ticket.ticketNumber,
            customerId: ticketToPreview.ticket.customerId
          }}
          ticketNumber={ticketToPreview.ticket.ticketNumber}
          cashierName={ticketToPreview.ticket.cashierName}
          customerName={ticketToPreview.ticket.customerName}
          exchangeRate={exchangeRate}
        />
      )}

      {/* ========================================================= */}
      {/* MODAL: CONFIRMACIÓN DE CLONACIÓN CON CARRITO OCUPADO     */}
      {/* ========================================================= */}
      {pendingCloneTicket && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-backdrop">
          <div className="w-full max-w-md bg-white rounded-lg shadow-2xl border border-slate-200 overflow-hidden animate-modal">
            <header className="flex items-center gap-2 px-4 py-3 bg-amber-500 text-white font-bold text-sm">
              <AlertCircle size={18} />
              <h3>¿Reemplazar venta actual?</h3>
            </header>
            <div className="p-4 text-xs text-slate-600 space-y-2.5">
              <p>
                El ticket de venta actual ya tiene <strong>{currentCartCount} producto(s)</strong> en el carrito.
              </p>
              <p>
                Al clonar la factura <strong className="font-mono text-slate-900">{pendingCloneTicket.ticketNumber}</strong>, se vaciará el carrito actual y se cargarán los <strong>{pendingCloneTicket.items.length} productos</strong> de dicha factura para crear una nueva venta.
              </p>
              <p className="text-[11px] text-slate-500 italic">
                * Se generará un nuevo número de ticket automáticamente para no alterar la factura original.
              </p>
            </div>
            <footer className="flex items-center justify-end gap-2 px-4 py-3 bg-slate-50 border-t border-slate-200">
              <button
                type="button"
                disabled={isCloning}
                onClick={() => setPendingCloneTicket(null)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded cursor-pointer disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={isCloning}
                onClick={() => void handleExecuteClone(pendingCloneTicket)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-[#0067C0] hover:bg-[#005a9e] rounded shadow-xs cursor-pointer disabled:opacity-50"
              >
                <Copy size={13} />
                <span>{isCloning ? 'Clonando...' : 'Reemplazar y Clonar'}</span>
              </button>
            </footer>
          </div>
        </div>
      )}
    </>
  )
}

export default ShiftSalesModal
