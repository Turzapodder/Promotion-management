import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { MoreVertical, XIcon } from 'lucide-react'
import { useState } from 'react'
import type { Promotion } from '@/features/promotions/types'

export function PromotionsTable({ promotions, onDelete, onEdit, onToggle }: { promotions: Promotion[]; onDelete: (id: string) => void; onEdit: (id: string) => void; onToggle: (id: string) => void }) {
  const [selected, setSelected] = useState<Record<string, boolean>>({})
  const [confirmId, setConfirmId] = useState<string | null>(null)

  const toggleSelect = (id: string) => {
    setSelected((s) => ({ ...s, [id]: !s[id] }))
  }

  return (
    <div className="px-4 lg:px-6">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10">
              <Checkbox aria-label="Select all" />
            </TableHead>
            <TableHead>Promotion</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Value</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>End Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-14">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {promotions.map((p) => (
            <TableRow key={p.id}>
              <TableCell>
                <Checkbox checked={!!selected[p.id]} onCheckedChange={() => toggleSelect(p.id)} aria-label={`Select ${p.title}`} />
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  {p.banner ? (
                    <img src={p.banner} alt={p.title} className="h-10 w-16 rounded-md object-cover" />
                  ) : (
                    <div className="h-10 w-16 rounded-md border bg-muted flex items-center justify-center text-[10px] text-muted-foreground">
                      Banner
                    </div>
                  )}
                  <span className="font-medium">{p.title}</span>
                </div>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground truncate max-w-[240px]">{p.description || '-'}</TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={
                    p.discountType === 'percentage'
                      ? 'bg-blue-100 text-blue-700 border-blue-200'
                      : p.discountType === 'fixed'
                      ? 'bg-purple-100 text-purple-700 border-purple-200'
                      : p.discountType === 'weighted'
                      ? 'bg-slate-100 text-slate-700 border-slate-200'
                      : 'bg-gray-100 text-gray-700 border-gray-200'
                  }
                >
                  {p.discountType ? p.discountType : '—'}
                </Badge>
              </TableCell>
              <TableCell className="text-sm">
                {p.discountType === 'percentage' && typeof p.percentageRate === 'number' ? `${p.percentageRate}%` : ''}
                {p.discountType === 'fixed' && typeof p.fixedAmount === 'number' ? `${p.fixedAmount} tk` : ''}
              </TableCell>
              <TableCell>{new Date(p.startDate).toLocaleDateString()} </TableCell>
              <TableCell>{new Date(p.endDate).toLocaleDateString()} </TableCell>
              <TableCell>
                <Badge variant="outline" className={p.enabled ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-100 text-red-700 border-red-200'}>
                  {p.enabled ? 'Enabled' : 'Disabled'}
                </Badge>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" aria-label="More">
                      <MoreVertical className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(p.id)}>Edit</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onToggle(p.id)}>{p.enabled ? 'Disable' : 'Enable'}</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setConfirmId(p.id)}>Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <DialogPrimitive.Root open={confirmId === p.id} onOpenChange={(v) => setConfirmId(v ? p.id : null)}>
                  <DialogPrimitive.Portal>
                    <DialogPrimitive.Overlay className="fixed inset-0 bg-black/40" />
                    <DialogPrimitive.Content className="bg-background text-foreground fixed left-1/2 top-1/2 w-[95vw] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-lg border p-6 shadow-lg">
                      <div className="flex items-center justify-between">
                        <DialogPrimitive.Title className="text-lg font-semibold">Delete Promotion</DialogPrimitive.Title>
                        <DialogPrimitive.Close asChild>
                          <button className="inline-flex size-7 items-center justify-center rounded-md border" aria-label="Close">
                            <XIcon className="size-4" />
                          </button>
                        </DialogPrimitive.Close>
                      </div>
                      <p className="text-muted-foreground mt-2 text-sm">Are you sure you want to delete {p.title}?</p>
                      <div className="mt-6 flex items-center gap-2 justify-end">
                        <Button variant="destructive" onClick={() => { onDelete(p.id); setConfirmId(null) }}>Delete</Button>
                        <DialogPrimitive.Close asChild>
                          <Button variant="outline">Cancel</Button>
                        </DialogPrimitive.Close>
                      </div>
                    </DialogPrimitive.Content>
                  </DialogPrimitive.Portal>
                </DialogPrimitive.Root>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}