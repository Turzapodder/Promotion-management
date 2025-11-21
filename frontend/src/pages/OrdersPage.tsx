import { useOrders } from '@/features/orders/useOrders'
import { useNavigate } from 'react-router-dom'
import { OrdersStatsCards } from '@/features/orders/components/OrdersStatsCards'
import { OrdersToolbar } from '@/features/orders/components/OrdersToolbar'
import { OrdersTable } from '@/features/orders/components/OrdersTable'

export default function OrdersPage() {
  const navigate = useNavigate()
  const {
    orders,
    allOrders,
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
        onCreate={() => navigate('/dashboard/orders/new')}
      />
      <OrdersTable orders={orders} onDelete={removeOrder} />
    </div>
  )
}