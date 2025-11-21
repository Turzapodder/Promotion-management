import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useOrders } from '@/features/orders/useOrders'
import { useProducts } from '@/features/products/useProducts'
import { usePromotions } from '@/features/promotions/usePromotions'
import { OrderProductsCard } from '@/features/orders/components/OrderProductsCard'
import { OrderPaymentCard } from '@/features/orders/components/OrderPaymentCard'
import { OrderStatusTimeline } from '@/features/orders/components/OrderStatusTimeline'
import { OrderPromotionCard } from '@/features/orders/components/OrderPromotionCard'
import { OrderNotesCard } from '@/features/orders/components/OrderNotesCard'
import { OrderShippingAddressCard } from '@/features/orders/components/OrderShippingAddressCard'

export default function OrderCreatePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addOrder,  getOrderById } = useOrders()
  const { allProducts, query, setQuery, suggestions, setSearch } = useProducts()
  const { allPromotions } = usePromotions()

  const existing = id ? getOrderById(id) : undefined
  const isNew = !id

  const [items, setItems] = useState((existing?.lineItems || []).map((li) => ({ ...li, price: Number(li.price), qty: Number(li.qty) || 1 })))
  const [promotionId, setPromotionId] = useState<string>('')
  const [shippingCost, setShippingCost] = useState(existing?.shippingCost || 0)
  const [notes, setNotes] = useState(existing?.notes || '')
  const [orderStatus, setOrderStatus] = useState<'Created' | 'Shipped' | 'Delivered' | 'Complete'>('Created')
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
    if (!isNew && id) {
      import('@/lib/api').then(({ apiClient }) => {
        const numId = parseInt(id, 10)
        if (Number.isNaN(numId)) return
        apiClient.getOrderById(numId).then((data) => {
          if (!data) {
            navigate('/dashboard/orders')
            return
          }
          const order = (data as any).order
          const orderItems = (data as any).items || []
          setItems(orderItems.map((it: any) => ({ productId: String(it.product_id), name: it.name, price: Number(it.unit_price), qty: Number(it.quantity) || 1 })))
          setShippingCost(Number(order.shipping_cost) || 0)
          setNotes(order.notes || '')
          setPromotionId(order.promotion_id ? String(order.promotion_id) : '')
          setOrderStatus((order as any).status || 'Created')
          setShippingAddress({
            name: order.customer_name || '',
            address: order.customer_address || '',
            city: '',
            state: '',
            zip: '',
            country: '',
            phone: order.customer_phone || '',
          })
        }).catch(() => {})
      })
    }
  }, [isNew, id, navigate])

  const subtotal = useMemo(() => items.reduce((sum, it) => sum + Number(it.price) * it.qty, 0), [items])
  const itemsCount = useMemo(() => items.reduce((sum, it) => sum + it.qty, 0), [items])
  const promotion = useMemo(() => allPromotions.find((p) => p.id === promotionId), [allPromotions, promotionId])
  const [slabs, setSlabs] = useState<Array<{ min_weight: number; max_weight: number; unit_weight: number; unit_discount: number }>>([])
  useEffect(() => {
    setSlabs([])
    if (promotionId && promotion?.discountType === 'weighted') {
      const idNum = parseInt(promotionId, 10)
      if (!Number.isNaN(idNum)) {
        import('@/lib/api').then(({ apiClient }) => {
          apiClient.getPromotionSlabs(idNum).then((rows) => {
            setSlabs(rows.map((r: any) => ({ min_weight: r.min_weight, max_weight: r.max_weight, unit_weight: r.unit_weight, unit_discount: r.unit_discount })))
          }).catch(() => {})
        })
      }
    }
  }, [promotionId, promotion])
  const computedDiscounts = useMemo(() => {
    const perLine = items.map((it) => {
      const unitPrice = Number(it.price)
      const lineSubtotal = unitPrice * it.qty
      return { lineSubtotal, lineDiscount: 0 }
    })

    if (!promotion) return perLine

    if (promotion.discountType === 'percentage') {
      const rate = Number(promotion.percentageRate)
      return perLine.map((c) => {
        const d = !Number.isNaN(rate) && rate > 0 ? (c.lineSubtotal * rate) / 100 : 0
        const lineDiscount = Math.min(d, c.lineSubtotal)
        return { lineSubtotal: c.lineSubtotal, lineDiscount }
      })
    }

    if (promotion.discountType === 'fixed') {
      const amt = Number(promotion.fixedAmount)
      return perLine.map((c, idx) => {
        const qty = items[idx]?.qty ?? 0
        const d = !Number.isNaN(amt) && amt > 0 ? amt * qty : 0
        const lineDiscount = Math.min(d, c.lineSubtotal)
        return { lineSubtotal: c.lineSubtotal, lineDiscount }
      })
    }

    if (promotion.discountType === 'weighted' && slabs.length > 0) {
      const weights = items.map((it) => {
        const p = allProducts.find((x) => x.id === String(it.productId))
        const unitWeightVal = Number(p?.weight ?? 0)
        const unitWeightGrams = (p?.weight_unit === 'kg' ? unitWeightVal * 1000 : unitWeightVal)
        return unitWeightGrams * it.qty
      })
      const totalWeight = weights.reduce((s, w) => s + w, 0)
      const slab = slabs.find((s) => totalWeight >= s.min_weight && totalWeight <= s.max_weight)
      let orderDiscount = 0
      if (slab) {
        const discountUnits = Math.max(1, Math.floor(totalWeight / Number(slab.unit_weight)))
        orderDiscount = Number(slab.unit_discount) * discountUnits
      }
      const sumSubtotal = perLine.reduce((s, c) => s + c.lineSubtotal, 0)
      const cappedOrderDiscount = Math.min(orderDiscount, sumSubtotal)
      const allocations = weights.map((w) => (totalWeight > 0 ? (cappedOrderDiscount * (w / totalWeight)) : 0))
      return perLine.map((c, idx) => {
        const raw = allocations[idx]
        const lineDiscount = Math.min(raw, c.lineSubtotal)
        return { lineSubtotal: c.lineSubtotal, lineDiscount }
      })
    }

    return perLine
  }, [items, promotion, slabs, allProducts])
  const discountTotal = useMemo(() => computedDiscounts.reduce((sum, d) => sum + d.lineDiscount, 0), [computedDiscounts])
  const total = useMemo(() => Math.max(0, subtotal - discountTotal + Math.max(0, shippingCost || 0)), [subtotal, discountTotal, shippingCost])
  const promotionLabel = useMemo(() => {
    if (!promotion) return '-'
    return promotion.title ? promotion.title : (promotion.discountType || '-')
  }, [promotion])
  const totalWeightLb = useMemo(() => {
    let grams = 0
    for (const it of items) {
      const p = allProducts.find((x) => x.id === String(it.productId))
      if (!p) continue
      const unitWeightKg = (p?.weight ?? 0)
      const unitWeightGrams = (p?.weight_unit === 'kg' ? unitWeightKg * 1000 : unitWeightKg)
      grams += unitWeightGrams * it.qty
    }
    const lb = (grams / 1000)
    return Math.max(0, lb)
  }, [items, allProducts])

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
      return [{ productId: p.id, name: p.name, price: Number(p.price), qty: 1 }, ...prev]
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
      customer_name: shippingAddress.name || 'Walk-in',
      customer_address: shippingAddress.address || '',
      customer_phone: shippingAddress.phone || '',
      notes,
      promotion_id: promotionId ? parseInt(promotionId, 10) : undefined,
      shipping_cost: Math.max(0, shippingCost || 0),
      items: items.map((it) => {
        const p = allProducts.find((x) => x.id === String(it.productId))
        const unitWeightKg = (p?.weight ?? 0)
        const unitWeight = (p?.weight_unit === 'kg' ? unitWeightKg * 1000 : unitWeightKg)
        return {
          product_id: parseInt(String(it.productId), 10),
          name: it.name,
          unit_price: Number(it.price),
          quantity: it.qty,
          unit_weight: unitWeight,
        }
      }),
    }
    if (isNew) {
      addOrder(payload)
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
          <OrderProductsCard
            items={items}
            products={allProducts as any}
            discounts={computedDiscounts as any}
            query={query}
            onQuery={setQuery}
            suggestions={suggestions as any}
            onSelect={addItemByName}
            onQtyChange={updateQty}
            onRemove={removeItem}
          />

          <OrderPaymentCard
            itemsCount={itemsCount}
            subtotal={subtotal}
            promotionLabel={promotionLabel}
            discountTotal={discountTotal}
            shippingCost={shippingCost}
            onShippingCost={(v) => setShippingCost(v)}
            totalWeightKg={totalWeightLb}
            total={total}
          />

          <OrderStatusTimeline
            value={orderStatus}
            onChange={(v) => {
              setOrderStatus(v)
              if (!isNew && id) {
                import('@/lib/api').then(({ apiClient }) => {
                  const numId = parseInt(id, 10)
                  if (!Number.isNaN(numId)) {
                    apiClient.updateOrderStatus(numId, v as any).catch(() => {})
                  }
                })
              }
            }}
            canPatch={true}
          />
        </div>

        <div className="flex flex-col gap-6">
          <OrderPromotionCard promotionId={promotionId} onPromotionId={setPromotionId} promotions={allPromotions as any} promotion={promotion as any} />
          <OrderNotesCard notes={notes} onNotes={setNotes} />
          <OrderShippingAddressCard value={shippingAddress} onChange={(v) => setShippingAddress(v as any)} />
        </div>
      </div>

      <div className="flex items-center justify-end gap-2">
        <Button variant="outline" onClick={() => navigate('/dashboard/orders')}>Cancel</Button>
        <Button className="bg-primary text-primary-foreground" onClick={save}>{isNew ? 'Create order' : 'Save'}</Button>
      </div>
    </div>
  )
}