import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useOrders } from '@/features/orders/useOrders'
import { useProducts } from '@/features/products/useProducts'
import { ProductSearchDropdown } from '@/features/products/components/ProductSearchDropdown'

export default function OrderCreatePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addOrder, updateOrder, getOrderById } = useOrders()
  const { allProducts, query, setQuery, suggestions, setSearch } = useProducts()

  const existing = id ? getOrderById(id) : undefined
  const isNew = !existing

  const [items, setItems] = useState(existing?.lineItems || [])
  const [discount, setDiscount] = useState(existing?.discount || 0)
  const [shippingCost, setShippingCost] = useState(existing?.shippingCost || 0)
  const [notes, setNotes] = useState(existing?.notes || '')
  const [shippingAddress, setShippingAddress] = useState({
    name: existing?.shippingAddress?.name || '',
    address: existing?.shippingAddress?.address || '',
    city: existing?.shippingAddress?.city || '',
    state: existing?.shippingAddress?.state || '',
    zip: existing?.shippingAddress?.zip || '',
    country: existing?.shippingAddress?.country || '',
    phone: existing?.shippingAddress?.phone || '',
  })

  useEffect(() => {
    if (!isNew && !existing) navigate('/dashboard/orders')
  }, [isNew, existing, navigate])

  const subtotal = useMemo(() => items.reduce((sum, it) => sum + it.price * it.qty, 0), [items])
  const total = useMemo(() => Math.max(0, subtotal - (discount || 0) + (shippingCost || 0)), [subtotal, discount, shippingCost])

  const addItemByName = (name: string) => {
    setSearch(name)
    const p = allProducts.find((x) => x.name === name)
    if (!p) return
    setItems((prev) => {
      const existingIndex = prev.findIndex((li) => li.productId === p.id)
      if (existingIndex >= 0) {
        const next = [...prev]
        next[existingIndex] = { ...next[existingIndex], qty: next[existingIndex].qty + 1 }
        return next
      }
      return [{ productId: p.id, name: p.name, price: p.price, qty: 1 }, ...prev]
    })
  }

  const updateQty = (productId: string, qty: number) => {
    setItems((prev) => prev.map((li) => (li.productId === productId ? { ...li, qty } : li)))
  }

  const removeItem = (productId: string) => {
    setItems((prev) => prev.filter((li) => li.productId !== productId))
  }

  const save = () => {
    const payload = {
      orderNo: isNew ? `#${Math.floor(Math.random() * 9000) + 1000}` : existing!.orderNo,
      date: isNew ? new Date().toISOString().slice(0, 10) : existing!.date,
      customer: existing?.customer || 'Walk-in',
      payment: existing?.payment || 'pending',
      total,
      delivery: existing?.delivery || 'N/A',
      items: items.length,
      fulfillment: existing?.fulfillment || 'unfulfilled',
      status: existing?.status || 'open',
      lineItems: items,
      notes,
      shippingAddress,
      discount,
      shippingCost,
    }
    if (isNew) {
      addOrder(payload)
    } else {
      updateOrder(existing!.id, payload)
    }
    navigate('/dashboard/orders')
  }

  return (
    <div className="flex flex-col gap-4 px-4 lg:px-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{isNew ? 'Create order' : 'View order'}</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">More actions</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 @xl/main:grid-cols-[1fr_360px]">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Products</CardTitle>
              <CardDescription>Search products to add</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ProductSearchDropdown query={query} onQuery={setQuery} suggestions={suggestions} onSelect={addItemByName} />
              <Separator />
              <div className="space-y-3">
                {items.map((it) => (
                  <div key={it.productId} className="flex items-center justify-between gap-3 rounded-md border p-3">
                    <div className="flex flex-col">
                      <span className="font-medium">{it.name}</span>
                      <span className="text-muted-foreground text-xs">${it.price.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input type="number" value={it.qty} onChange={(e) => updateQty(it.productId, Math.max(1, Number(e.target.value) || 1))} className="w-20" />
                      <Button variant="outline" onClick={() => removeItem(it.productId)}>Remove</Button>
                    </div>
                  </div>
                ))}
                {items.length === 0 && <div className="text-muted-foreground text-sm">No items added</div>}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment</CardTitle>
              <CardDescription>Summary</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm">Discount</label>
                  <Input type="number" value={discount} onChange={(e) => setDiscount(Number(e.target.value) || 0)} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm">Shipping</label>
                  <Input type="number" value={shippingCost} onChange={(e) => setShippingCost(Number(e.target.value) || 0)} />
                </div>
              </div>
              <Separator />
              <div className="flex flex-col gap-1 text-sm">
                <div className="flex justify-between"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between"><span>Discount</span><span>-${(discount || 0).toFixed(2)}</span></div>
                <div className="flex justify-between"><span>Shipping</span><span>${(shippingCost || 0).toFixed(2)}</span></div>
                <div className="flex justify-between font-semibold"><span>Total</span><span>${total.toFixed(2)}</span></div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="bg-background border-input w-full rounded-md border p-3 text-sm" rows={6} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Shipping address</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Input placeholder="Name" value={shippingAddress.name} onChange={(e) => setShippingAddress({ ...shippingAddress, name: e.target.value })} />
              <Input placeholder="Address" value={shippingAddress.address} onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })} />
              <div className="grid grid-cols-2 gap-2">
                <Input placeholder="City" value={shippingAddress.city} onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })} />
                <Input placeholder="State" value={shippingAddress.state} onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Input placeholder="Zip" value={shippingAddress.zip} onChange={(e) => setShippingAddress({ ...shippingAddress, zip: e.target.value })} />
                <Input placeholder="Country" value={shippingAddress.country} onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })} />
              </div>
              <Input placeholder="Phone" value={shippingAddress.phone} onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })} />
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2">
        <Button variant="outline" onClick={() => navigate('/dashboard/orders')}>Cancel</Button>
        <Button className="bg-primary text-primary-foreground" onClick={save}>{isNew ? 'Create order' : 'Save'}</Button>
      </div>
    </div>
  )
}