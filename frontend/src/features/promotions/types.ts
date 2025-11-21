export type Promotion = {
  id: string
  title: string
  description?: string
  startDate: string
  endDate: string
  banner?: string
  enabled: boolean
  discountType?: 'percentage' | 'fixed' | 'weighted'
  percentageRate?: number
  fixedAmount?: number
}

export type PromotionsTab = 'all' | 'active' | 'disabled'
export type SortKey = 'title' | 'startDate' | 'endDate'
export type SortDir = 'asc' | 'desc'