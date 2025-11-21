import { useEffect, useMemo, useState } from 'react'
import { MOCK_PRODUCTS } from './data'
import type { Product, SortDir, SortKey } from './types'

export function useProducts() {
  const [productsState, setProductsState] = useState<Product[]>(() => {
    const raw = localStorage.getItem('products')
    if (raw) {
      try { return JSON.parse(raw) as Product[] } catch { return MOCK_PRODUCTS }
    }
    return MOCK_PRODUCTS
  })
  const [query, setQuery] = useState('')
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('name')
  const [sortDir, setSortDir] = useState<SortDir>('asc')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'new' | 'deactive'>('all')

  const addProduct = (p: Omit<Product, 'id'>) => {
    const id = `p-${Math.random().toString(36).slice(2, 8)}`
    setProductsState((prev) => [{ id, ...p }, ...prev])
  }

  const removeProduct = (id: string) => {
    setProductsState((prev) => prev.filter((p) => p.id !== id))
  }

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProductsState((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)))
  }

  const getProductById = (id: string) => productsState.find((p) => p.id === id)

  const visibleProducts = useMemo(() => {
    const filteredBySearch = productsState.filter((p) =>
      !search ? true : p.name.toLowerCase().includes(search.toLowerCase())
    )
    const filtered = filteredBySearch.filter((p) =>
      statusFilter === 'all' ? true : p.status === statusFilter
    )
    const sorted = [...filtered].sort((a, b) => {
      const dir = sortDir === 'asc' ? 1 : -1
      switch (sortKey) {
        case 'name':
          return a.name.localeCompare(b.name) * dir
        case 'price':
          return (a.price - b.price) * dir
        case 'rating':
          return (a.rating - b.rating) * dir
        case 'sku':
          return a.sku.localeCompare(b.sku) * dir
        default:
          return 0
      }
    })
    return sorted
  }, [productsState, search, statusFilter, sortKey, sortDir])

  const suggestions = useMemo(() => {
    if (!query) return [] as Product[]
    return productsState.filter((p) =>
      p.name.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 6)
  }, [productsState, query])

  const applySearch = (value: string) => {
    setSearch(value)
    setQuery('')
  }

  useEffect(() => {
    try { localStorage.setItem('products', JSON.stringify(productsState)) } catch { /* empty */ }
  }, [productsState])

  return {
    products: visibleProducts,
    allProducts: productsState,
    addProduct,
    removeProduct,
    updateProduct,
    getProductById,
    statusFilter,
    setStatusFilter,
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