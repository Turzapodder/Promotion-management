import { useOrders } from '@/features/orders/useOrders'
import { OrdersStatsCards } from '@/features/orders/components/OrdersStatsCards'
import { OrdersToolbar } from '@/features/orders/components/OrdersToolbar'
import { OrdersTable } from '@/features/orders/components/OrdersTable'

export default function OrdersPage() {
  const {
    orders,
    allOrders,
    addOrder,
    removeOrder,
    query,
    setQuery,
    setSearch,
    suggestions,
    sortKey,
    setSortKey,
    sortDir,
    setSortDir,
    tab,
    setTab,
  } = useOrders()

  return (
    <div className="flex flex-col gap-6">
      <div className="px-4 lg:px-6">
        <h1 className="text-2xl font-semibold">Orders</h1>
        <p className="text-muted-foreground">Manage and review your recent orders</p>
      </div>
      <OrdersStatsCards orders={allOrders} />
      <OrdersToolbar
        query={query}
        onQuery={setQuery}
        suggestions={suggestions}
        onSelectSuggestion={setSearch}
        sortKey={sortKey}
        onSortKey={setSortKey}
        sortDir={sortDir}
        onSortDir={setSortDir}
        tab={tab}
        onTab={setTab}
        onCreate={() => {
          addOrder({ orderNo: `#${Math.floor(Math.random() * 9000) + 1000}`, date: new Date().toISOString().slice(0, 10), customer: 'New Customer', payment: 'pending', total: 0, delivery: 'N/A', items: 0, fulfillment: 'unfulfilled', status: 'open' })
        }}
      />
      <OrdersTable orders={orders} onDelete={removeOrder} />
    </div>
  )
}