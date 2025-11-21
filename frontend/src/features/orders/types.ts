export type Order = {
  id: string
  orderNo: string
  date: string
  customer: string
  payment: 'pending' | 'success'
  total: number
  delivery: string
  items: number
  fulfillment: 'fulfilled' | 'unfulfilled'
  status: 'open' | 'closed'
  lineItems?: { productId: string; name: string; price: number; qty: number }[]
  notes?: string
  shippingAddress?: { name?: string; address?: string; city?: string; state?: string; zip?: string; country?: string; phone?: string }
  discount?: number
  shippingCost?: number
}

export type OrdersTab = 'all' | 'unfulfilled' | 'unpaid' | 'open' | 'closed'
export type SortKey = 'date' | 'total' | 'customer' | 'orderNo'
export type SortDir = 'asc' | 'desc'