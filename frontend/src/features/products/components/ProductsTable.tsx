import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Checkbox } from '@/components/ui/checkbox'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { MoreVertical, XIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Product } from '@/features/products/types'

export function ProductsTable({ products, onDelete, onAddNew }: { products: Product[]; onDelete: (id: string) => void; onAddNew?: () => void }) {
  const [selected, setSelected] = useState<Record<string, boolean>>({})
  const [confirmId, setConfirmId] = useState<string | null>(null)
  const navigate = useNavigate()

  const toggleSelect = (id: string) => {
    setSelected((s) => ({ ...s, [id]: !s[id] }))
  }

  if (products.length === 0) {
    return (
      <div className="px-4 lg:px-6">
        <div className="flex items-center justify-center rounded-lg border p-10">
          <div className="flex flex-col items-center gap-3">
            <span className="text-muted-foreground">No products added</span>
            <Button className="bg-primary text-primary-foreground" onClick={() => onAddNew?.()}>Add Product</Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 lg:px-6">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10">
              <Checkbox aria-label="Select all" />
            </TableHead>
            <TableHead>Product</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Inventory</TableHead>
            <TableHead>Weight</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Vendor</TableHead>
            <TableHead className="w-14">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((p) => (
            <TableRow key={p.id}>
              <TableCell>
                <Checkbox checked={!!selected[p.id]} onCheckedChange={() => toggleSelect(p.id)} aria-label={`Select ${p.name}`} />
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="size-8 rounded-md">
                    <AvatarImage src={p.image} alt={p.name} />
                    <AvatarFallback className="rounded-md">P</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-medium">{p.name}</span>
                    {p.description && (
                      <span className="text-muted-foreground text-xs">{p.description}</span>
                    )}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={
                    p.status === 'active'
                      ? 'bg-green-100 text-green-700 border-green-200'
                      : p.status === 'new'
                        ? 'bg-orange-100 text-orange-700 border-orange-200'
                        : 'bg-yellow-100 text-yellow-700 border-yellow-200'
                  }
                >
                  {p.status === 'deactive' ? 'Archived' : p.status === 'new' ? 'Draft' : 'Active'}
                </Badge>
              </TableCell>
              <TableCell>{p.quantity} in stock</TableCell>
              <TableCell>{p.weight} {p.weight_unit ?? 'kg'}</TableCell>
              <TableCell>{p.category}</TableCell>
              <TableCell>Acme Inc.</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" aria-label="More">
                      <MoreVertical className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => navigate(`/dashboard/products/${p.id}/edit`)}>Edit</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setConfirmId(p.id)}>Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <DialogPrimitive.Root open={confirmId === p.id} onOpenChange={(o) => setConfirmId(o ? p.id : null)}>
                  <DialogPrimitive.Portal>
                    <DialogPrimitive.Overlay className="fixed inset-0 bg-black/40" />
                    <DialogPrimitive.Content className="bg-background text-foreground fixed left-1/2 top-1/2 w-[95vw] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-lg border p-6 shadow-lg">
                      <div className="flex items-center justify-between">
                        <DialogPrimitive.Title className="text-lg font-semibold">Delete Product</DialogPrimitive.Title>
                        <DialogPrimitive.Close asChild>
                          <button className="inline-flex size-7 items-center justify-center rounded-md border" aria-label="Close">
                            <XIcon className="size-4" />
                          </button>
                        </DialogPrimitive.Close>
                      </div>
                      <p className="text-muted-foreground mt-2 text-sm">Are you sure you want to delete "{p.name}"?</p>
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