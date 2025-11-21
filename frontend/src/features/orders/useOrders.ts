import { useEffect, useMemo, useState } from 'react'
import { MOCK_ORDERS } from './data'
import type { Order, OrdersTab, SortDir, SortKey } from './types'

export function useOrders() {
  const [ordersState, setOrdersState] = useState<Order[]>(() => {
    const raw = localStorage.getItem('orders')
    if (raw) {
      try { return JSON.parse(raw) as Order[] } catch { return MOCK_ORDERS }
    }
    return MOCK_ORDERS
  })
  const [query, setQuery] = useState('')
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('date')
  const [sortDir, setSortDir] = useState<SortDir>('asc')
  const [tab, setTab] = useState<OrdersTab>('all')

  const addOrder = (o: Omit<Order, 'id'>) => {
    const id = `o-${Math.random().toString(36).slice(2, 8)}`
    setOrdersState((prev) => [{ id, ...o }, ...prev])
  }
  const removeOrder = (id: string) => {
    setOrdersState((prev) => prev.filter((o) => o.id !== id))
  }
  const updateOrder = (id: string, updates: Partial<Order>) => {
    setOrdersState((prev) => prev.map((o) => (o.id === id ? { ...o, ...updates } : o)))
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
          return o.status === 'open'
        case 'closed':
          return o.status === 'closed'
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

  useEffect(() => {
    try { localStorage.setItem('orders', JSON.stringify(ordersState)) } catch {}
  }, [ordersState])

  return {
    orders: visibleOrders,
    allOrders: ordersState,
    addOrder,
    removeOrder,
    updateOrder,
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