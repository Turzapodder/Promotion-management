import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api'
import type { Order, OrdersTab, SortDir, SortKey } from './types'

export function useOrders() {
  const queryClient = useQueryClient()
  const { data: serverOrders = [] } = useQuery({
    queryKey: ['orders'],
    queryFn: () => apiClient.getOrders(),
  })
  const ordersState: Order[] = useMemo(() => serverOrders.map((o: any) => ({
    id: String(o.id),
    orderNo: `#${o.id}`,
    customer: o.customer_name,
    date: new Date(o.created_at).toISOString(),
    total: o.grand_total,
    status: (o as any).status || 'Created',
    payment: 'success',
    fulfillment: 'unfulfilled',
    delivery: 'N/A',
    items: 0,
  })), [serverOrders])
  const [query, setQuery] = useState('')
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('date')
  const [sortDir, setSortDir] = useState<SortDir>('asc')
  const [tab, setTab] = useState<OrdersTab>('all')

  const createMutation = useMutation({
    mutationFn: (payload: any) => apiClient.createOrder(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    },
  })
  const addOrder = (payload: any) => createMutation.mutate(payload)
  const removeOrder = (id: string) => {
    queryClient.setQueryData(['orders'], (prev: any) => Array.isArray(prev) ? prev.filter((o: any) => String(o.id) !== id) : prev)
  }
  const updateOrder = (id: string, updates: Partial<Order>) => {
    queryClient.setQueryData(['orders'], (prev: any) => Array.isArray(prev) ? prev.map((o: any) => String(o.id) === id ? { ...o, ...updates } : o) : prev)
  }
  const setOrderStatus = (id: string, status: Order['status']) => {
    const idNum = parseInt(id, 10)
    if (Number.isNaN(idNum)) return
    apiClient.updateOrderStatus(idNum, status).then(() => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    }).catch(() => {})
  }
  const getOrderById = (id: string) => ordersState.find((o) => o.id === id)

  const visibleOrders = useMemo(() => {
    const bySearch = ordersState.filter((o) =>
      !search ? true : `${o.orderNo} ${o.customer}`.toLowerCase().includes(search.toLowerCase())
    )
    const byTab = bySearch.filter((o) => {
      switch (tab) {
        case 'unfulfilled':
          return o.fulfillment === 'unfulfilled'
        case 'unpaid':
          return o.payment === 'pending'
        case 'open':
          return o.status !== 'Complete'
        case 'closed':
          return o.status === 'Complete'
        default:
          return true
      }
    })
    const sorted = [...byTab].sort((a, b) => {
      const dir = sortDir === 'asc' ? 1 : -1
      switch (sortKey) {
        case 'date':
          return (new Date(a.date).getTime() - new Date(b.date).getTime()) * dir
        case 'total':
          return (a.total - b.total) * dir
        case 'customer':
          return a.customer.localeCompare(b.customer) * dir
        case 'orderNo':
          return a.orderNo.localeCompare(b.orderNo) * dir
        default:
          return 0
      }
    })
    return sorted
  }, [ordersState, search, tab, sortKey, sortDir])

  const suggestions = useMemo(() => {
    if (!query) return [] as Order[]
    return ordersState.filter((o) =>
      `${o.orderNo} ${o.customer}`.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 6)
  }, [ordersState, query])

  const applySearch = (value: string) => {
    setSearch(value)
    setQuery('')
  }

  

  return {
    orders: visibleOrders,
    allOrders: ordersState,
    addOrder,
    removeOrder,
    updateOrder,
    setOrderStatus,
    getOrderById,
    tab,
    setTab,
    search,
    setSearch: applySearch,
    query,
    setQuery,
    suggestions,
    sortKey,
    setSortKey,
    sortDir,
    setSortDir,
  }
}