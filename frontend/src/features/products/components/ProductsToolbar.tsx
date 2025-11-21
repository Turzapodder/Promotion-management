import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { ProductSearchDropdown } from './ProductSearchDropdown'
import type { SortDir, SortKey, Product } from '@/features/products/types'
import { AddProductModal } from './AddProductModal'
import { ArrowDown, ArrowUp } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

export function ProductsToolbar({
  query,
  onQuery,
  suggestions,
  onSelectSuggestion,
  sortKey,
  onSortKey,
  sortDir,
  onSortDir,
  statusFilter,
  onStatusFilter,
  onAdd,
}: {
  query: string
  onQuery: (v: string) => void
  suggestions: Product[]
  onSelectSuggestion: (name: string) => void
  sortKey: SortKey
  onSortKey: (k: SortKey) => void
  sortDir: SortDir
  onSortDir: (d: SortDir) => void
  statusFilter: 'all' | 'active' | 'new' | 'deactive'
  onStatusFilter: (v: 'all' | 'active' | 'new' | 'deactive') => void
  onAdd: (p: Omit<Product, 'id'>) => void
}) {
  return (
    <div className="flex items-center gap-3 px-4 lg:px-6 py-4">
      <Tabs value={statusFilter} onValueChange={(v) => onStatusFilter(v as any)}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="active">Actives</TabsTrigger>
          <TabsTrigger value="new">Draft</TabsTrigger>
          <TabsTrigger value="deactive">Archived</TabsTrigger>
        </TabsList>
      </Tabs>
      <div className="flex-1" />
      <ProductSearchDropdown query={query} onQuery={onQuery} suggestions={suggestions} onSelect={onSelectSuggestion} />
      <Select value={sortKey} onValueChange={(v) => onSortKey(v as SortKey)}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="name">Name</SelectItem>
          <SelectItem value="price">Price</SelectItem>
          <SelectItem value="rating">Rating</SelectItem>
          <SelectItem value="sku">SKU</SelectItem>
        </SelectContent>
      </Select>
      <Button variant="outline" onClick={() => onSortDir(sortDir === 'asc' ? 'desc' : 'asc')}>
        {sortDir === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
      </Button>
      <AddProductModal onAdd={onAdd} />
    </div>
  )
}