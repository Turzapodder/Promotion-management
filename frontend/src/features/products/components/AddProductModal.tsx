/* eslint-disable @typescript-eslint/no-explicit-any */
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { XIcon, UploadIcon } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import type { Product } from '@/features/products/types'

export function AddProductModal({ onAdd }: { onAdd: (p: Omit<Product, 'id'>) => void }) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    weight: '',
    status: 'active' as Product['status'],
  })
  const [gallery, setGallery] = useState<string[]>([])
  const [imageInput, setImageInput] = useState('')

  const addImage = () => {
    if (!imageInput) return
    setGallery((g) => [imageInput, ...g])
    setImageInput('')
  }

  const submit = () => {
    const priceNum = Number(form.price)
    const weightNum = Number(form.weight)
    if (!form.name || Number.isNaN(priceNum) || Number.isNaN(weightNum)) return
    onAdd({
      name: form.name,
      description: form.description,
      category: 'General',
      price: priceNum,
      weight: weightNum,
      sku: `SKU-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
      rating: 0,
      quantity: 0,
      image: gallery[0] || 'https://via.placeholder.com/40',
      status: form.status,
    })
    setOpen(false)
    setForm({ name: '', description: '', price: '', weight: '', status: 'active' })
    setGallery([])
    setImageInput('')
  }

  return (
    <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
      <DialogPrimitive.Trigger asChild>
        <Button className="bg-primary text-primary-foreground">New Product</Button>
      </DialogPrimitive.Trigger>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-[100] bg-black/40" />
        <DialogPrimitive.Content className="bg-background text-foreground fixed left-1/2 top-1/2 z-[101] w-[95vw] max-w-3xl -translate-x-1/2 -translate-y-1/2 rounded-lg border p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <DialogPrimitive.Title className="text-lg font-semibold">Add Product</DialogPrimitive.Title>
            <DialogPrimitive.Close asChild>
              <button className="inline-flex size-7 items-center justify-center rounded-md border" aria-label="Close">
                <XIcon className="size-4" />
              </button>
            </DialogPrimitive.Close>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-[1fr_360px]">
            <Card>
              <CardHeader>
                <CardTitle>General Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Name</label>
                  <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="bg-background border-input w-full rounded-md border p-3 text-sm" rows={5} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Price</label>
                    <Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Weight</label>
                    <Input type="number" value={form.weight} onChange={(e) => setForm({ ...form, weight: e.target.value })} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as any })}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="deactive">Deactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Images</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-center rounded-lg border p-3">
                  <Avatar className="size-40 rounded-lg">
                    <AvatarImage src={gallery[0] || 'https://via.placeholder.com/200'} alt={form.name || 'image'} />
                    <AvatarFallback className="rounded-lg">IMG</AvatarFallback>
                  </Avatar>
                </div>
                <div className="flex items-center gap-2">
                  <Input placeholder="Image URL" value={imageInput} onChange={(e) => setImageInput(e.target.value)} />
                  <Button variant="outline" onClick={addImage}><UploadIcon className="size-4" /></Button>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {gallery.map((src, i) => (
                    <Avatar key={src + i} className="size-12 rounded-md">
                      <AvatarImage src={src} alt={form.name || 'img'} />
                      <AvatarFallback className="rounded-md">IMG</AvatarFallback>
                    </Avatar>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="mt-6 flex items-center gap-2 justify-end">
            <Button onClick={submit}>Add Product</Button>
            <DialogPrimitive.Close asChild>
              <Button variant="outline">Cancel</Button>
            </DialogPrimitive.Close>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}