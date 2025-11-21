import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'

export function OrderPaymentCard({ itemsCount, subtotal, promotionLabel, discountTotal, shippingCost, onShippingCost, totalWeightKg, total }: {
  itemsCount: number
  subtotal: number
  promotionLabel: string
  discountTotal: number
  shippingCost: number
  onShippingCost: (val: number) => void
  totalWeightKg: number
  total: number
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment</CardTitle>
        <CardDescription>Use this personalized guide to get your store up and running.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-3 gap-2 text-sm">
          <div className="text-muted-foreground">Subtotal</div>
          <div className="text-right">{itemsCount} item{itemsCount === 1 ? '' : 's'}</div>
          <div className="text-right">${subtotal.toFixed(2)}</div>
          <div className="text-muted-foreground">Discount</div>
          <div className="text-right">{promotionLabel}</div>
          <div className="text-right">-{discountTotal.toFixed(2).startsWith('-') ? discountTotal.toFixed(2).slice(1) : discountTotal.toFixed(2)}</div>
          <div className="text-muted-foreground">Shipping</div>
          <div className="text-right">{shippingCost ? `Standard shipping (${totalWeightKg.toFixed(1)} KG)` : `Free shipping (${totalWeightKg.toFixed(1)} KG)`}</div>
          <div className="text-right">${(shippingCost || 0).toFixed(2)}</div>
          <div className="col-span-2 font-semibold">Total</div>
          <div className="text-right font-semibold">${Number(total).toFixed(2)}</div>
        </div>
        <Separator />
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="text-muted-foreground">Paid by customer</div>
          <div className="text-right">$0.00</div>
          <div className="text-muted-foreground">Payment due when invoice is sent</div>
          <div className="text-right"><button className="text-primary underline">Edit</button></div>
        </div>
        <Separator />
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm">Shipping</label>
            <Input type="number" value={shippingCost} onChange={(e) => onShippingCost(Number(e.target.value) || 0)} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}