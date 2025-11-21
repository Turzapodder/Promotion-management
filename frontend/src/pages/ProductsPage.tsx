import { useState } from 'react'
import { useProducts } from '@/features/products/useProducts'
import { ProductsToolbar } from '@/features/products/components/ProductsToolbar'
import { ProductsTable } from '@/features/products/components/ProductsTable'
import { ProductsStatsCards } from '@/features/products/components/ProductsStatsCards'

export default function ProductsPage() {
  const [addOpen, setAddOpen] = useState(false)
  const {
    products,
    allProducts,
    addProduct,
    removeProduct,
    statusFilter,
    setStatusFilter,
    query,
    setQuery,
    setSearch,
    suggestions,
    sortKey,
    setSortKey,
    sortDir,
    setSortDir,
  } = useProducts()

  return (
    <div className="flex flex-col gap-6">
      <div className="px-4 lg:px-6">
        <h1 className="text-2xl font-semibold">Products</h1>
        <p className="text-muted-foreground">Explore our diverse ShopZen collection: quality products await</p>
      </div>
      <ProductsStatsCards products={allProducts} />
      <ProductsToolbar
        query={query}
        onQuery={setQuery}
        suggestions={suggestions}
        onSelectSuggestion={setSearch}
        sortKey={sortKey}
        onSortKey={setSortKey}
        sortDir={sortDir}
        onSortDir={setSortDir}
        statusFilter={statusFilter}
        onStatusFilter={setStatusFilter}
        onAdd={addProduct}
        modalOpen={addOpen}
        onModalOpenChange={setAddOpen}
      />
      <ProductsTable products={products} onDelete={removeProduct} onAddNew={() => setAddOpen(true)} />
    </div>
  )
}