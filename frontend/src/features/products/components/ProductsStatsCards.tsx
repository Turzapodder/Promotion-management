import { IconTrendingUp, IconTrendingDown } from '@tabler/icons-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import type { Product } from '@/features/products/types'

export function ProductsStatsCards({ products }: { products: Product[] }) {
  const total = products.length
  const active = products.filter((p) => p.status === 'active').length
  const archived = products.filter((p) => p.status === 'deactive').length

  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-3">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Products by sell-through rate</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">0 -</CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              0.00% last week
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="text-muted-foreground">{active} active, {archived} archived</div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Product by days of inventory remaining</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">0 -</CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingDown />
              No data found
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="text-muted-foreground">Total items {total}</div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>ABC product analysis</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">0 -</CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              No data
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="text-muted-foreground">Overview of product mix</div>
        </CardFooter>
      </Card>
    </div>
  )
}