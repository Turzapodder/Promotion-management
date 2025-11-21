import { useState } from 'react'
import { usePromotions } from '@/features/promotions/usePromotions'
import { PromotionsStatsCards } from '@/features/promotions/components/PromotionsStatsCards'
import { PromotionsToolbar } from '@/features/promotions/components/PromotionsToolbar'
import { PromotionsTable } from '@/features/promotions/components/PromotionsTable'
import { PromotionModal } from '@/features/promotions/components/PromotionModal'

export default function PromotionsPage() {
  const {
    promotions,
    allPromotions,
    addPromotion,
    removePromotion,
    updatePromotion,
    toggleEnabled,
    getPromotionById,
    query,
    setQuery,
    setSearch,
    suggestions,
    sortKey,
    setSortKey,
    sortDir,
    setSortDir,
    tab,
    setTab,
  } = usePromotions()

  const [modalOpen, setModalOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)

  const openCreate = () => {
    setEditId(null)
    setModalOpen(true)
  }
  const openEdit = (id: string) => {
    setEditId(id)
    setModalOpen(true)
  }

  const handleSubmit = (payload: any) => {
    if (editId) {
      updatePromotion(editId, { startDate: payload.startDate, endDate: payload.endDate })
    } else {
      addPromotion({
        title: payload.title,
        description: payload.description,
        startDate: payload.startDate,
        endDate: payload.endDate,
        banner: payload.banner,
        enabled: payload.enabled,
        discountType: payload.discountType,
        percentageRate: payload.percentageRate,
        fixedAmount: payload.fixedAmount,
      })
    }
  }

  const initial = editId ? getPromotionById(editId) || undefined : undefined

  return (
    <div className="flex flex-col gap-6">
      <div className="px-4 lg:px-6">
        <h1 className="text-2xl font-semibold">Promotions</h1>
        <p className="text-muted-foreground">Create and manage campaigns</p>
      </div>
      <PromotionsStatsCards promotions={allPromotions} />
      <PromotionsToolbar
        query={query}
        onQuery={setQuery}
        suggestions={suggestions}
        onSelectSuggestion={setSearch}
        sortKey={sortKey}
        onSortKey={setSortKey}
        sortDir={sortDir}
        onSortDir={setSortDir}
        tab={tab}
        onTab={setTab}
        onCreate={openCreate}
      />
      <PromotionsTable promotions={promotions} onDelete={removePromotion} onEdit={openEdit} onToggle={toggleEnabled} />
      <PromotionModal open={modalOpen} onOpenChange={setModalOpen} initial={initial} onSubmit={handleSubmit} />
    </div>
  )
}