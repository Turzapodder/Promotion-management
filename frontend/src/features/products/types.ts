export type Product = {
  id: string
  name: string
  description?: string
  category: string
  price: number
  weight: number
  sku: string
  rating: number
  quantity: number
  image: string
  status: 'new' | 'active' | 'deactive'
}

export type SortKey = 'name' | 'price' | 'rating' | 'sku'
export type SortDir = 'asc' | 'desc'