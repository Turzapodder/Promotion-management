export type Promotion = {
  id: string
  title: string
  startDate: string
  endDate: string
  enabled: boolean
}

export type PromotionsTab = 'all' | 'active' | 'disabled'
export type SortKey = 'title' | 'startDate' | 'endDate'
export type SortDir = 'asc' | 'desc'