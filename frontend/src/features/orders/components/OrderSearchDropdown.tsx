import { useEffect, useRef, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import type { Order } from '@/features/orders/types'

export function OrderSearchDropdown({
  query,
  onQuery,
  suggestions,
  onSelect,
}: {
  query: string
  onQuery: (v: string) => void
  suggestions: Order[]
  onSelect: (value: string) => void
}) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    setOpen(!!query && suggestions.length > 0)
  }, [query, suggestions])

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!containerRef.current) return
      if (!containerRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [])

  return (
    <div ref={containerRef} className="relative">
      <Input
        placeholder="Search orders"
        value={query}
        onChange={(e) => onQuery(e.target.value)}
        className="max-w-xs"
        onFocus={() => setOpen(suggestions.length > 0)}
      />
      {open && (
        <div className="bg-popover text-popover-foreground absolute z-50 mt-2 w-[300px] rounded-lg border shadow-md">
          <div className="py-1">
            {suggestions.map((o) => (
              <button
                key={o.id}
                className="flex w-full items-center gap-2 px-2 py-2 text-left hover:bg-accent hover:text-accent-foreground"
                onClick={() => {
                  onSelect(`${o.orderNo}`)
                  setOpen(false)
                }}
              >
                <Avatar className="size-6 rounded-md">
                  <AvatarImage src={`https://via.placeholder.com/40?text=${encodeURIComponent(o.customer[0])}`} alt={o.customer} />
                  <AvatarFallback className="rounded-md">O</AvatarFallback>
                </Avatar>
                <span className="truncate flex-1">{o.orderNo}</span>
                <span className="text-muted-foreground text-xs">{o.customer}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}