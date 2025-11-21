import { IconTrendingDown, IconTrendingUp } from '@tabler/icons-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import type { Promotion } from '@/features/promotions/types'

export function PromotionsStatsCards({ promotions }: { promotions: Promotion[] }) {
  const total = promotions.length
  const active = promotions.filter((p) => p.enabled).length
  const disabled = promotions.filter((p) => !p.enabled).length
  const upcoming = promotions.filter((p) => new Date(p.startDate).getTime() > Date.now()).length

  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Promotions</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">{total} -</CardTitle>
          <CardAction>
            <Badge variant="outline"><IconTrendingUp /> 0% last week</Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="text-muted-foreground">Overview</CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Active Promotions</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">{active} -</CardTitle>
          <CardAction>
            <Badge variant="outline"><IconTrendingUp /> 0%</Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="text-muted-foreground">Running now</CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Disabled Promotions</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">{disabled} -</CardTitle>
          <CardAction>
            <Badge variant="outline"><IconTrendingDown /> 0%</Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="text-muted-foreground">Hidden from orders</CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Upcoming</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">{upcoming} -</CardTitle>
          <CardAction>
            <Badge variant="outline"><IconTrendingUp /> Soon</Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="text-muted-foreground">Scheduled</CardFooter>
      </Card>
    </div>
  )
}