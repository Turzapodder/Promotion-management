import type { Order } from './types'

export const MOCK_ORDERS: Order[] = [
  { id: 'o-002', orderNo: '#1002', date: '2024-02-11', customer: 'Wade Warren', payment: 'pending', total: 20, delivery: 'N/A', items: 2, fulfillment: 'unfulfilled', status: 'open' },
  { id: 'o-004', orderNo: '#1004', date: '2024-02-13', customer: 'Esther Howard', payment: 'success', total: 22, delivery: 'N/A', items: 3, fulfillment: 'fulfilled', status: 'open' },
  { id: 'o-007', orderNo: '#1007', date: '2024-02-15', customer: 'Jenny Wilson', payment: 'pending', total: 25, delivery: 'N/A', items: 1, fulfillment: 'unfulfilled', status: 'open' },
  { id: 'o-009', orderNo: '#1009', date: '2024-02-17', customer: 'Guy Hawkins', payment: 'success', total: 27, delivery: 'N/A', items: 5, fulfillment: 'fulfilled', status: 'open' },
  { id: 'o-011', orderNo: '#1011', date: '2024-02-19', customer: 'Jacob Jones', payment: 'pending', total: 32, delivery: 'N/A', items: 4, fulfillment: 'unfulfilled', status: 'closed' },
  { id: 'o-013', orderNo: '#1013', date: '2024-02-21', customer: 'Kristin Watson', payment: 'success', total: 25, delivery: 'N/A', items: 3, fulfillment: 'fulfilled', status: 'open' },
  { id: 'o-015', orderNo: '#1015', date: '2024-02-23', customer: 'Albert Flores', payment: 'pending', total: 28, delivery: 'N/A', items: 2, fulfillment: 'unfulfilled', status: 'open' },
  { id: 'o-018', orderNo: '#1018', date: '2024-02-25', customer: 'Eleanor Pena', payment: 'success', total: 35, delivery: 'N/A', items: 1, fulfillment: 'fulfilled', status: 'closed' },
  { id: 'o-019', orderNo: '#1019', date: '2024-02-26', customer: 'Theresa Webb', payment: 'pending', total: 20, delivery: 'N/A', items: 2, fulfillment: 'unfulfilled', status: 'open' },
]