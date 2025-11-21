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
}

export type OrdersTab = 'all' | 'unfulfilled' | 'unpaid' | 'open' | 'closed'
export type SortKey = 'date' | 'total' | 'customer' | 'orderNo'
export type SortDir = 'asc' | 'desc'