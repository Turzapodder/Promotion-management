import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { ProductSearchDropdown } from '@/features/products/components/ProductSearchDropdown'
import { Trash2 } from 'lucide-react'

type Item = { productId: string; name: string; price: number; qty: number }
type Discount = { lineSubtotal: number; lineDiscount: number }

export function OrderProductsCard({ items, products, discounts, query, onQuery, suggestions, onSelect, onQtyChange, onRemove }: {
  items: Item[]
  products: any[]
  discounts: Discount[]
  query: string
  onQuery: (q: string) => void
  suggestions: any[]
  onSelect: (name: string) => void
  onQtyChange: (productId: string, qty: number) => void
  onRemove: (productId: string) => void
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Products</CardTitle>
        <CardDescription>Search products to add</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <ProductSearchDropdown query={query} onQuery={onQuery} suggestions={suggestions} onSelect={onSelect} />
        <Separator />
        <div className="space-y-3">
          {items.map((it) => {
            const idx = items.findIndex((x) => x.productId === it.productId)
            const discount = discounts[idx]?.lineDiscount ?? 0
            const unitPrice = Number(it.price)
            const lineSubtotal = unitPrice * it.qty
            const lineTotal = Math.max(0, lineSubtotal - discount)
            const product = products.find((p: any) => p.id === String(it.productId))
            return (
              <div key={it.productId} className="flex items-center justify-between gap-3 rounded-md border p-3">
                <div className="flex items-center gap-3">
                  <img src={product?.image || 'https://via.placeholder.com/40'} alt={it.name} className="h-10 w-10 rounded-md object-cover" />
                  <div className="flex flex-col">
                    <span className="font-medium">{it.name}</span>
                    <span className="text-muted-foreground text-xs">Discount: -${Number(discount).toFixed(2)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-sm whitespace-nowrap">{it.qty} x ${Number(it.price).toFixed(2)}</div>
                  <div className="text-sm font-medium">${Number(lineTotal).toFixed(2)}</div>
                  <Input type="number" value={it.qty} onChange={(e) => onQtyChange(it.productId, Math.max(1, Number(e.target.value) || 1))} className="w-16" />
                  <button aria-label="Remove" onClick={() => onRemove(it.productId)} className="inline-flex items-center justify-center rounded-md p-2 text-red-600 hover:bg-red-50">
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
            )
          })}
          {items.length === 0 && <div className="text-muted-foreground text-sm">No items added</div>}
        </div>
      </CardContent>
    </Card>
  )
}