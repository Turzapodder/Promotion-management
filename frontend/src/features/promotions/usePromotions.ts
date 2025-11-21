import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api'
import type { Promotion, PromotionsTab, SortDir, SortKey } from './types'

export function usePromotions() {
  const queryClient = useQueryClient()
  const { data: serverPromotions = [] } = useQuery({
    queryKey: ['promotions'],
    queryFn: () => apiClient.getPromotions(),
  })
  const state: Promotion[] = useMemo(() => {
    return serverPromotions.map((p) => ({
      id: String(p.id),
      title: p.title,
      description: (p as any).description,
      startDate: p.start_date,
      endDate: p.end_date,
      banner: (p as any).banner_url,
      enabled: !!p.enabled,
      discountType: (p as any).discount_type,
      percentageRate: (p as any).percentage_rate,
      fixedAmount: (p as any).fixed_amount,
    }))
  }, [serverPromotions])
  const [query, setQuery] = useState('')
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('startDate')
  const [sortDir, setSortDir] = useState<SortDir>('asc')
  const [tab, setTab] = useState<PromotionsTab>('all')

  const createMutation = useMutation({
    mutationFn: (p: Omit<Promotion, 'id'>) => apiClient.createPromotion({
      title: p.title,
      description: p.description,
      start_date: p.startDate,
      end_date: p.endDate,
      banner_url: p.banner,
      enabled: p.enabled,
      discount_type: (p as any).discountType,
      percentage_rate: (p as any).percentageRate,
      fixed_amount: (p as any).fixedAmount,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promotions'] })
    },
  })
  const addPromotion = (p: Omit<Promotion, 'id'>) => createMutation.mutate(p)

  const deleteMutation = useMutation({
    mutationFn: (idNum: number) => apiClient.deletePromotion(idNum),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promotions'] })
    },
  })
  const removePromotion = (id: string) => {
    const idNum = parseInt(id, 10)
    if (!Number.isNaN(idNum)) deleteMutation.mutate(idNum)
  }

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: number; updates: Partial<Promotion> }) => apiClient.updatePromotion(id, {
      title: updates.title,
      start_date: updates.startDate,
      end_date: updates.endDate,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promotions'] })
    },
  })
  const updatePromotion = (id: string, updates: Partial<Promotion>) => {
    const idNum = parseInt(id, 10)
    if (!Number.isNaN(idNum)) updateMutation.mutate({ id: idNum, updates })
  }

  const toggleMutation = useMutation({
    mutationFn: ({ id, enabled }: { id: number; enabled: boolean }) => apiClient.setPromotionEnabled(id, enabled),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promotions'] })
    },
  })
  const toggleEnabled = (id: string) => {
    const current = state.find((x) => x.id === id)
    const idNum = parseInt(id, 10)
    if (current && !Number.isNaN(idNum)) toggleMutation.mutate({ id: idNum, enabled: !current.enabled })
  }
  const getPromotionById = (id: string) => state.find((x) => x.id === id)

  const visible = useMemo(() => {
    const bySearch = state.filter((x) => !search ? true : x.title.toLowerCase().includes(search.toLowerCase()))
    const byTab = bySearch.filter((x) => tab === 'all' ? true : tab === 'active' ? x.enabled : !x.enabled)
    const sorted = [...byTab].sort((a, b) => {
      const dir = sortDir === 'asc' ? 1 : -1
      switch (sortKey) {
        case 'title':
          return a.title.localeCompare(b.title) * dir
        case 'startDate':
          return (new Date(a.startDate).getTime() - new Date(b.startDate).getTime()) * dir
        case 'endDate':
          return (new Date(a.endDate).getTime() - new Date(b.endDate).getTime()) * dir
        default:
          return 0
      }
    })
    return sorted
  }, [state, search, tab, sortKey, sortDir])

  const suggestions = useMemo(() => {
    if (!query) return [] as Promotion[]
    return state.filter((x) => x.title.toLowerCase().includes(query.toLowerCase())).slice(0, 6)
  }, [state, query])

  const applySearch = (value: string) => {
    setSearch(value)
    setQuery('')
  }

  

  return {
    promotions: visible,
    allPromotions: state,
    addPromotion,
    removePromotion,
    updatePromotion,
    toggleEnabled,
    getPromotionById,
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