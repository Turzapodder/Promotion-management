import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { OrdersTab, SortDir, SortKey, Order } from '@/features/orders/types'
import { OrderSearchDropdown } from './OrderSearchDropdown'
import { ArrowDown, ArrowUp } from 'lucide-react'

export function OrdersToolbar({
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
  suggestions: Order[]
  onSelectSuggestion: (name: string) => void
  sortKey: SortKey
  onSortKey: (k: SortKey) => void
  sortDir: SortDir
  onSortDir: (d: SortDir) => void
  tab: OrdersTab
  onTab: (v: OrdersTab) => void
  onCreate: () => void
}) {
  return (
    <div className="flex items-center gap-3 px-4 lg:px-6 py-4">
      <Select defaultValue="last30">
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Date range" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="last7">Jan 24 - Jan 30, 2024</SelectItem>
          <SelectItem value="last30">Jan 1 - Jan 30, 2024</SelectItem>
        </SelectContent>
      </Select>
      <div className="flex-1" />
      <Button variant="outline">Export</Button>
      <Button variant="outline">More actions</Button>
      <Button className="bg-primary text-primary-foreground" onClick={onCreate}>Create order</Button>
      <div className="w-full" />
      <Tabs value={tab} onValueChange={(v) => onTab(v as OrdersTab)}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="unfulfilled">Unfulfilled</TabsTrigger>
          <TabsTrigger value="unpaid">Unpaid</TabsTrigger>
          <TabsTrigger value="open">Open</TabsTrigger>
          <TabsTrigger value="closed">Closed</TabsTrigger>
        </TabsList>
      </Tabs>
      <div className="flex-1" />
      <OrderSearchDropdown query={query} onQuery={onQuery} suggestions={suggestions} onSelect={onSelectSuggestion} />
      <Select value={sortKey} onValueChange={(v) => onSortKey(v as SortKey)}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="date">Date</SelectItem>
          <SelectItem value="total">Total</SelectItem>
          <SelectItem value="customer">Customer</SelectItem>
          <SelectItem value="orderNo">Order No</SelectItem>
        </SelectContent>
      </Select>
      <Button variant="outline" onClick={() => onSortDir(sortDir === 'asc' ? 'desc' : 'asc')}>
        {sortDir === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
      </Button>
    </div>
  )
}