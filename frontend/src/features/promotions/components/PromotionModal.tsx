import * as DialogPrimitive from '@radix-ui/react-dialog'
import { XIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
  const [startDate, setStartDate] = useState(initial?.startDate || '')
  const [endDate, setEndDate] = useState(initial?.endDate || '')
  const [enabled, setEnabled] = useState(initial?.enabled ?? true)

  useEffect(() => {
    setTitle(initial?.title || '')
    setStartDate(initial?.startDate || '')
    setEndDate(initial?.endDate || '')
    setEnabled(initial?.enabled ?? true)
  }, [initial])

  const submit = () => {
    if (!title || !startDate || !endDate) return
    const payload = initial ? { ...initial, title, startDate, endDate } : { title, startDate, endDate, enabled }
    onSubmit(payload)
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
            <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
            <Input type="date" placeholder="Start" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            <Input type="date" placeholder="End" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
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