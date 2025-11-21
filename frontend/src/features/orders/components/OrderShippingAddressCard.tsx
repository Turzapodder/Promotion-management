import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

type Address = { name?: string; address?: string; city?: string; state?: string; zip?: string; country?: string; phone?: string }

export function OrderShippingAddressCard({ value, onChange }: { value: Address; onChange: (v: Address) => void }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Shipping address</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Input placeholder="Name" value={value.name || ''} onChange={(e) => onChange({ ...value, name: e.target.value })} />
        <Input placeholder="Address" value={value.address || ''} onChange={(e) => onChange({ ...value, address: e.target.value })} />
        <div className="grid grid-cols-2 gap-2">
          <Input placeholder="City" value={value.city || ''} onChange={(e) => onChange({ ...value, city: e.target.value })} />
          <Input placeholder="State" value={value.state || ''} onChange={(e) => onChange({ ...value, state: e.target.value })} />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Input placeholder="Zip" value={value.zip || ''} onChange={(e) => onChange({ ...value, zip: e.target.value })} />
          <Input placeholder="Country" value={value.country || ''} onChange={(e) => onChange({ ...value, country: e.target.value })} />
        </div>
        <Input placeholder="Phone" value={value.phone || ''} onChange={(e) => onChange({ ...value, phone: e.target.value })} />
      </CardContent>
    </Card>
  )
}