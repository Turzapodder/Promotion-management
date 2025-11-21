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
            <TableHead>Dates</TableHead>
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
              <TableCell className="font-medium">{p.title}</TableCell>
              <TableCell>{p.startDate} → {p.endDate}</TableCell>
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