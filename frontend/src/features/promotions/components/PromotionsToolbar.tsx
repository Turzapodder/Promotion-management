import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { PromotionsTab, SortDir, SortKey, Promotion } from '@/features/promotions/types'
import { PromotionSearchDropdown } from './PromotionSearchDropdown'
import { ArrowDown, ArrowUp } from 'lucide-react'

export function PromotionsToolbar({
  query,
  onQuery,
  suggestions,
  onSelectSuggestion,
  sortKey,
  onSortKey,
  sortDir,
  onSortDir,
  tab,
  onTab,
  onCreate,
}: {
  query: string
  onQuery: (v: string) => void
  suggestions: Promotion[]
  onSelectSuggestion: (name: string) => void
  sortKey: SortKey
  onSortKey: (k: SortKey) => void
  sortDir: SortDir
  onSortDir: (d: SortDir) => void
  tab: PromotionsTab
  onTab: (v: PromotionsTab) => void
  onCreate: () => void
}) {
  return (
    <div className="flex items-center gap-3 px-4 lg:px-6 py-4">
      <div className="flex-1" />
      <Button variant="outline">Export</Button>
      <Button className="bg-primary text-primary-foreground" onClick={onCreate}>Create promotion</Button>
      <div className="w-full" />
      <Tabs value={tab} onValueChange={(v) => onTab(v as PromotionsTab)}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="disabled">Disabled</TabsTrigger>
        </TabsList>
      </Tabs>
      <div className="flex-1" />
      <PromotionSearchDropdown query={query} onQuery={onQuery} suggestions={suggestions} onSelect={onSelectSuggestion} />
      <Select value={sortKey} onValueChange={(v) => onSortKey(v as SortKey)}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="title">Title</SelectItem>
          <SelectItem value="startDate">Start Date</SelectItem>
          <SelectItem value="endDate">End Date</SelectItem>
        </SelectContent>
      </Select>
      <Button variant="outline" onClick={() => onSortDir(sortDir === 'asc' ? 'desc' : 'asc')}>
        {sortDir === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
      </Button>
    </div>
  )
}