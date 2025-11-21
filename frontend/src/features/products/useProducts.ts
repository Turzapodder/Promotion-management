import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api'
import type { Product, SortDir, SortKey } from './types'

export function useProducts() {
  const queryClient = useQueryClient()
  const [imageById, setImageById] = useState<Record<number, string>>({})
  const { data: serverProducts = [] } = useQuery({
    queryKey: ['products'],
    queryFn: () => apiClient.getProducts(),
  })
  const productsState: Product[] = useMemo(() => {
    return serverProducts.map((row) => ({
      id: String(row.id ?? ''),
      name: row.name,
      description: row.description,
      category: 'General',
      price: row.price,
      weight: (row as any).weight ?? 0,
      weight_unit: (row as any).weight_unit ?? 'kg',
      sku: '',
      rating: 0,
      quantity: row.stock ?? 0,
      image: (row as any).image_url ?? imageById[row.id ?? -1] ?? 'https://via.placeholder.com/40',
      status: (row as any).status ?? (row.is_enabled === false ? 'deactive' : 'active'),
    }))
  }, [serverProducts, imageById])
  const [query, setQuery] = useState('')
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('name')
  const [sortDir, setSortDir] = useState<SortDir>('asc')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'new' | 'deactive'>('all')

  const createMutation = useMutation({
    mutationFn: (input: Omit<Product, 'id'>) => {
      return apiClient.createProduct({
        name: input.name,
        description: input.description,
        price: input.price,
        stock: input.quantity ?? 0,
        is_enabled: input.status !== 'deactive',
        image_url: (input as any).image_url ?? input.image,
        status: input.status,
        weight: input.weight,
        weight_unit: (input as any).weight_unit ?? 'kg',
      })
    },
    onSuccess: (created, variables) => {
      if (created?.id && typeof created.id === 'number') {
        setImageById((prev) => ({ ...prev, [created.id!]: variables.image }))
      }
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
  const addProduct = (p: Omit<Product, 'id'>) => {
    createMutation.mutate(p)
  }

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiClient.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
  const removeProduct = (id: string) => {
    const numericId = parseInt(id, 10)
    if (!Number.isNaN(numericId)) {
      deleteMutation.mutate(numericId)
    }
  }

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: number; updates: Partial<Product> }) => {
      return apiClient.updateProduct(id, {
        name: updates.name,
        description: updates.description,
        price: updates.price,
        stock: updates.quantity,
        is_enabled: updates.status ? updates.status !== 'deactive' : undefined,
        image_url: (updates as any).image_url ?? updates.image,
        status: updates.status,
        weight: updates.weight,
        weight_unit: (updates as any).weight_unit,
      })
    },
    onSuccess: (_, variables) => {
      if (variables?.updates?.image && variables.id) {
        setImageById((prev) => ({ ...prev, [variables.id]: variables.updates!.image! }))
      }
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
  const updateProduct = (id: string, updates: Partial<Product>) => {
    const numericId = parseInt(id, 10)
    if (!Number.isNaN(numericId)) {
      updateMutation.mutate({ id: numericId, updates })
    }
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
    return productsState
      .filter((p) => p.status === 'active')
      .filter((p) => p.name.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 6)
  }, [productsState, query])

  const applySearch = (value: string) => {
    setSearch(value)
    setQuery('')
  }

  

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