import { IconTrendingDown, IconTrendingUp } from '@tabler/icons-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import type { Order } from '@/features/orders/types'

export function OrdersStatsCards({ orders }: { orders: Order[] }) {
  const total = orders.length
  const items = orders.reduce((acc, o) => acc + o.items, 0)
  const returns = 0
  const fulfilled = orders.filter((o) => o.fulfillment === 'fulfilled').length

  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Orders</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">{total} -</CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              25.2% last week
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="text-muted-foreground">Overview</CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Order items over time</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">{items} -</CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              18.2% last week
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="text-muted-foreground">Trends</CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Returns Orders</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">{returns} -</CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingDown />
              -1.2% last week
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="text-muted-foreground">Returns</CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Fulfilled orders over time</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">{fulfilled} -</CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              12.2% last week
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="text-muted-foreground">Fulfillment</CardFooter>
      </Card>
    </div>
  )
}