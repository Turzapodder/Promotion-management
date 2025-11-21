import { useEffect, useMemo, useState } from 'react'
import { MOCK_PROMOTIONS } from './data'
import type { Promotion, PromotionsTab, SortDir, SortKey } from './types'

export function usePromotions() {
  const [state, setState] = useState<Promotion[]>(() => {
    const raw = localStorage.getItem('promotions')
    if (raw) {
      try { return JSON.parse(raw) as Promotion[] } catch { return MOCK_PROMOTIONS }
    }
    return MOCK_PROMOTIONS
  })
  const [query, setQuery] = useState('')
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('startDate')
  const [sortDir, setSortDir] = useState<SortDir>('asc')
  const [tab, setTab] = useState<PromotionsTab>('all')

  const addPromotion = (p: Omit<Promotion, 'id'>) => {
    const id = `pr-${Math.random().toString(36).slice(2, 8)}`
    setState((prev) => [{ id, ...p }, ...prev])
  }
  const removePromotion = (id: string) => {
    setState((prev) => prev.filter((x) => x.id !== id))
  }
  const updatePromotion = (id: string, updates: Partial<Promotion>) => {
    setState((prev) => prev.map((x) => (x.id === id ? { ...x, ...updates } : x)))
  }
  const toggleEnabled = (id: string) => {
    setState((prev) => prev.map((x) => (x.id === id ? { ...x, enabled: !x.enabled } : x)))
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

  useEffect(() => {
    try { localStorage.setItem('promotions', JSON.stringify(state)) } catch {}
  }, [state])

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