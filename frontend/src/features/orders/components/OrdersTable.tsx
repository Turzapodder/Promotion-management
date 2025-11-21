import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { MoreVertical, XIcon } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Order } from '@/features/orders/types'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useOrders } from '@/features/orders/useOrders'

export function OrdersTable({ orders, onDelete }: { orders: Order[]; onDelete: (id: string) => void }) {
  const [selected, setSelected] = useState<Record<string, boolean>>({})
  const [confirmId, setConfirmId] = useState<string | null>(null)
  const navigate = useNavigate()
  const { setOrderStatus } = useOrders()

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
            <TableHead>Order</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Payment</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Delivery</TableHead>
            <TableHead>Items</TableHead>
            <TableHead>Fulfillment</TableHead>
            <TableHead className="w-14">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((o) => (
            <TableRow key={o.id}>
              <TableCell>
                <Checkbox checked={!!selected[o.id]} onCheckedChange={() => toggleSelect(o.id)} aria-label={`Select ${o.orderNo}`} />
              </TableCell>
              <TableCell className="font-medium">{o.orderNo}</TableCell>
              <TableCell>{new Date(o.date).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}</TableCell>
              <TableCell>{o.customer}</TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={o.payment === 'success' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-orange-100 text-orange-700 border-orange-200'}
                >
                  {o.payment === 'success' ? 'Success' : 'Pending'}
                </Badge>
              </TableCell>
              <TableCell>
                <Select value={o.status} onValueChange={(v) => setOrderStatus(o.id, v as Order['status'])}>
                  <SelectTrigger className="w-36">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Created">Created</SelectItem>
                    <SelectItem value="Shipped">Shipped</SelectItem>
                    <SelectItem value="Delivered">Delivered</SelectItem>
                    <SelectItem value="Complete">Complete</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>${Number(o.total).toFixed(2)}</TableCell>
              <TableCell>{o.delivery}</TableCell>
              <TableCell>{o.items} items</TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={o.fulfillment === 'fulfilled' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-100 text-red-700 border-red-200'}
                >
                  {o.fulfillment === 'fulfilled' ? 'Fulfilled' : 'Unfulfilled'}
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
                    <DropdownMenuItem onClick={() => navigate(`/dashboard/orders/${o.id}`)}>View</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate(`/dashboard/orders/${o.id}`)}>Edit</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setConfirmId(o.id)}>Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <DialogPrimitive.Root open={confirmId === o.id} onOpenChange={(v) => setConfirmId(v ? o.id : null)}>
                  <DialogPrimitive.Portal>
                    <DialogPrimitive.Overlay className="fixed inset-0 bg-black/40" />
                    <DialogPrimitive.Content className="bg-background text-foreground fixed left-1/2 top-1/2 w-[95vw] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-lg border p-6 shadow-lg">
                      <div className="flex items-center justify-between">
                        <DialogPrimitive.Title className="text-lg font-semibold">Delete Order</DialogPrimitive.Title>
                        <DialogPrimitive.Close asChild>
                          <button className="inline-flex size-7 items-center justify-center rounded-md border" aria-label="Close">
                            <XIcon className="size-4" />
                          </button>
                        </DialogPrimitive.Close>
                      </div>
                      <p className="text-muted-foreground mt-2 text-sm">Are you sure you want to delete {o.orderNo}?</p>
                      <div className="mt-6 flex items-center gap-2 justify-end">
                        <Button variant="destructive" onClick={() => { onDelete(o.id); setConfirmId(null) }}>Delete</Button>
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