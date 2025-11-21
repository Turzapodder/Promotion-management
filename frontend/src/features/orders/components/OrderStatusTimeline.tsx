import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Check, Package, Truck, Home } from 'lucide-react'

export function OrderStatusTimeline({ value, onChange, canPatch }: { value: 'Created' | 'Shipped' | 'Delivered' | 'Complete'; onChange: (next: 'Created' | 'Shipped' | 'Delivered' | 'Complete') => void; canPatch?: boolean }) {
  const activeIndex = ['Created','Shipped','Delivered','Complete'].indexOf(value)
  return (
    <Card>
      <CardHeader>
        <CardTitle>Status</CardTitle>
        <CardDescription>Track fulfillment progress</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center gap-0">
            {(['Created','Shipped','Delivered','Complete'] as const).map((s, idx) => {
              const completed = idx <= activeIndex
              return (
                <div key={s} className="flex items-center gap-0 w-full">
                  {idx > 0 && (
                    <div className={`h-[4px] flex-1 ${idx <= activeIndex ? 'bg-green-500' : 'bg-muted'}`}></div>
                  )}
                  <div className={`size-7 rounded-full border flex items-center justify-center ${completed ? 'bg-green-500 text-white border-green-500' : 'bg-muted text-muted-foreground'}`}>
                    <Check className="size-4" />
                  </div>
                  {idx < 3 && (
                    <div className={`h-[4px] flex-1 ${idx < activeIndex ? 'bg-green-500' : 'bg-muted'}`}></div>
                  )}
                </div>
              )
            })}
          </div>
          <div className="grid grid-cols-4 text-xs">
            {[
              { label: 'Order Confirmed', Icon: Check },
              { label: 'Order Shipped', Icon: Package },
              { label: 'Out for Delivery', Icon: Truck },
              { label: 'Order Delivered', Icon: Home },
            ].map((item, idx) => {
              const Cmp = item.Icon
              const isActive = idx <= activeIndex
              return (
                <div key={item.label} className="flex items-center justify-center gap-2">
                  <Cmp className={`size-4 ${isActive ? 'text-green-600' : 'text-muted-foreground'}`} />
                  <span className={`${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>{item.label}</span>
                </div>
              )
            })}
          </div>
        </div>
        <div>
          <Select value={value} onValueChange={(v) => onChange(v as any)} disabled={!canPatch}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Update status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Created">Created</SelectItem>
              <SelectItem value="Shipped">Shipped</SelectItem>
              <SelectItem value="Delivered">Delivered</SelectItem>
              <SelectItem value="Complete">Complete</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  )
}