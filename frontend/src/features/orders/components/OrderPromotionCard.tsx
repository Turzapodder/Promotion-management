import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export function OrderPromotionCard({ promotionId, onPromotionId, promotions, promotion }: { promotionId: string; onPromotionId: (id: string) => void; promotions: any[]; promotion: any }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Promotion</CardTitle>
        <CardDescription>Select an active promotion to apply</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <Select value={promotionId} onValueChange={onPromotionId}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select promotion" />
          </SelectTrigger>
          <SelectContent>
            {promotions
              .filter((p) => p.enabled && new Date(p.startDate) <= new Date() && new Date(p.endDate) >= new Date())
              .map((p) => (
                <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>
              ))}
          </SelectContent>
        </Select>
        {promotion && (
          <div className="text-xs text-muted-foreground">
            <div>Type: {promotion.discountType || 'N/A'}</div>
            {promotion.discountType === 'percentage' && <div>Rate: {promotion.percentageRate}%</div>}
            {promotion.discountType === 'fixed' && <div>Amount: {promotion.fixedAmount}</div>}
          </div>
        )}
      </CardContent>
    </Card>
  )
}