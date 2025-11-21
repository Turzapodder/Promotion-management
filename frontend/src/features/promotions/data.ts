import type { Promotion } from './types'

export const MOCK_PROMOTIONS: Promotion[] = [
  { id: 'pr-001', title: 'Winter Sale', startDate: '2024-12-01', endDate: '2024-12-31', enabled: true },
  { id: 'pr-002', title: 'Flash Deal', startDate: '2025-01-10', endDate: '2025-01-12', enabled: false },
  { id: 'pr-003', title: 'Spring Offer', startDate: '2025-03-01', endDate: '2025-03-20', enabled: true },
]