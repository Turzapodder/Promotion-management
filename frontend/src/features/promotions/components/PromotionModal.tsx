/* eslint-disable react-hooks/set-state-in-effect */
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { XIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import type { Promotion } from '@/features/promotions/types'

export function PromotionModal({
  open,
  onOpenChange,
  initial,
  onSubmit,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  initial?: Promotion
  onSubmit: (p: Omit<Promotion, 'id'> | Promotion) => void
}) {
  const [title, setTitle] = useState(initial?.title || '')
  const [description, setDescription] = useState(initial?.description || '')
  const [startDate, setStartDate] = useState(initial?.startDate || '')
  const [endDate, setEndDate] = useState(initial?.endDate || '')
  const [enabled, setEnabled] = useState(initial?.enabled ?? true)
  const [banner, setBanner] = useState(initial?.banner || '')
  const [discountType, setDiscountType] = useState<string>((initial as any)?.discountType || '')
  const [percentageRate, setPercentageRate] = useState<number>((initial as any)?.percentageRate || 0)
  const [fixedAmount, setFixedAmount] = useState<number>((initial as any)?.fixedAmount || 0)

  useEffect(() => {
    setTitle(initial?.title || '')
    setDescription(initial?.description || '')
    setStartDate(initial?.startDate || '')
    setEndDate(initial?.endDate || '')
    setEnabled(initial?.enabled ?? true)
    setBanner(initial?.banner || '')
    setDiscountType((initial as any)?.discountType || '')
    setPercentageRate((initial as any)?.percentageRate || 0)
    setFixedAmount((initial as any)?.fixedAmount || 0)
  }, [initial])

  const submit = () => {
    if (!title || !startDate || !endDate) return
    const payload = initial
      ? { ...initial, title, startDate, endDate }
      : {
          title,
          description,
          startDate,
          endDate,
          banner,
          enabled,
          discountType: discountType || undefined,
          percentageRate: discountType === 'percentage' ? Number(percentageRate) || 0 : undefined,
          fixedAmount: discountType === 'fixed' ? Number(fixedAmount) || 0 : undefined,
        }
    onSubmit(payload as Promotion | Omit<Promotion, 'id'>)
    onOpenChange(false)
  }

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-[100] bg-black/40" />
        <DialogPrimitive.Content className="bg-background text-foreground fixed left-1/2 top-1/2 z-[101] w-[95vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg border p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <DialogPrimitive.Title className="text-lg font-semibold">{initial ? 'Edit Promotion' : 'Create Promotion'}</DialogPrimitive.Title>
            <DialogPrimitive.Close asChild>
              <button className="inline-flex size-7 items-center justify-center rounded-md border" aria-label="Close">
                <XIcon className="size-4" />
              </button>
            </DialogPrimitive.Close>
          </div>
          <div className="grid gap-3 mt-4">
            <Input placeholder="e.g. Black Friday Sale" value={title} onChange={(e) => setTitle(e.target.value)} disabled={!!initial} />
            <textarea placeholder="Describe the promotion (optional)" value={description} onChange={(e) => setDescription(e.target.value)} className="bg-background border-input w-full rounded-md border p-3 text-sm" rows={4} disabled={!!initial} />
            <Input type="date" placeholder="Start" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            <Input type="date" placeholder="End" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            {!initial && (
              <div className="space-y-2">
                <label className="text-sm">Discount type</label>
                <Select value={discountType} onValueChange={setDiscountType}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select discount type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Discounted (percentage)</SelectItem>
                    <SelectItem value="fixed">Fixed tk</SelectItem>
                    <SelectItem value="weighted">Weighted (slabs)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            {!initial && discountType === 'percentage' && (
              <div className="space-y-2">
                <label className="text-sm">Percentage rate (%)</label>
                <Input type="number" value={percentageRate} onChange={(e) => setPercentageRate(Number(e.target.value) || 0)} />
              </div>
            )}
            {!initial && discountType === 'fixed' && (
              <div className="space-y-2">
                <label className="text-sm">Fixed amount (tk)</label>
                <Input type="number" value={fixedAmount} onChange={(e) => setFixedAmount(Number(e.target.value) || 0)} />
              </div>
            )}
            {!initial && discountType === 'weighted' && (
              <div className="text-xs text-muted-foreground">
                Weighted promotions will use fixed slabs defined by the system.
              </div>
            )}
            <div className="space-y-2">
              <div className="flex items-center justify-center rounded-lg border p-3">
                {banner ? (
                  <img src={banner} alt={title || 'banner'} className="max-h-40 w-auto rounded-md" />
                ) : (
                  <div className="text-muted-foreground text-sm">No banner</div>
                )}
              </div>
              <Input placeholder="Paste banner image URL (optional)" value={banner} onChange={(e) => setBanner(e.target.value)} disabled={!!initial} />
            </div>
            {!initial && (
              <div className="flex items-center gap-2">
                <Checkbox checked={enabled} onCheckedChange={(v) => setEnabled(!!v)} id="enabled" />
                <label htmlFor="enabled" className="text-sm">Enabled</label>
              </div>
            )}
          </div>
          <div className="mt-6 flex items-center gap-2 justify-end">
            <Button onClick={submit}>{initial ? 'Save' : 'Create'}</Button>
            <DialogPrimitive.Close asChild>
              <Button variant="outline">Cancel</Button>
            </DialogPrimitive.Close>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}