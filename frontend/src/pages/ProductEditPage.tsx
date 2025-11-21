import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { useProducts } from '@/features/products/useProducts'

export default function ProductEditPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getProductById, addProduct, updateProduct } = useProducts()

  const isNew = id === 'new'
  const existing = isNew ? undefined : getProductById(id!)

  const [form, setForm] = useState({
    name: existing?.name || '',
    description: existing?.description || '',
    price: existing?.price?.toString() || '',
    weight: existing?.weight?.toString() || '',
    status: existing?.status || 'active',
    image: existing?.image || 'https://via.placeholder.com/200',
  })

  useEffect(() => {
    if (!isNew && !existing) {
      // If editing but no product found, go back
      navigate('/dashboard/products')
    }
  }, [isNew, existing, navigate])

  const save = () => {
    const priceNum = Number(form.price)
    const weightNum = Number(form.weight)
    if (!form.name || Number.isNaN(priceNum) || Number.isNaN(weightNum)) return
    if (isNew) {
      addProduct({
        name: form.name,
        description: form.description,
        category: existing?.category || 'General',
        price: priceNum,
        weight: weightNum,
        sku: existing?.sku || `SKU-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
        rating: existing?.rating || 0,
        quantity: existing?.quantity || 0,
        image: form.image,
        status: form.status,
      })
    } else {
      updateProduct(existing!.id, {
        name: form.name,
        description: form.description,
        price: priceNum,
        weight: weightNum,
        status: form.status,
        image: form.image,
      })
    }
    navigate('/dashboard/products')
  }

  return (
    <div className="flex justify-center">
    <div className="px-4 lg:px-6 space-y-6 w-7xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-lg">{isNew ? 'Add New Product' : 'Edit Product'}</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={save}>Save Draft</Button>
          <Button className="bg-primary text-primary-foreground" onClick={save}>{isNew ? 'Add Product' : 'Save'}</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 @xl/main:grid-cols-[1fr_420px]">
        <Card className='bg-[#f9f9f9]'>
          <CardHeader>
            <CardTitle>General Information</CardTitle>
            <CardDescription>Fill in the product details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name Product</label>
              <Input className='bg-[#efefef] min-h-[40px]' value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description Product</label>
              <textarea  value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="bg-[#efefef] border-input w-full rounded-md border p-3 text-sm" rows={6} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Base Pricing</label>
                <Input className='bg-[#efefef] min-h-[40px]' type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Weight</label>
                <Input className='bg-[#efefef] min-h-[40px]' type="number" value={form.weight} onChange={(e) => setForm({ ...form, weight: e.target.value })} />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as any })}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent >
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="deactive">Deactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card className='bg-[#f9f9f9]'>
          <CardHeader>
            <CardTitle>Upload Img</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3" >
            <div className="flex items-center justify-center rounded-lg border p-3 bg-[#efefef]">
              <Avatar className="size-40 rounded-lg">
                <AvatarImage src={form.image} alt={form.name || 'image'} />
                <AvatarFallback className="rounded-lg bg-[#efefef]">IMG</AvatarFallback>
              </Avatar>
            </div>
            <Input placeholder="Image URL" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
          </CardContent>
        </Card>
      </div>
    </div>
    </div>
  )
}