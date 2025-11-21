/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useRef, useState } from 'react'
import { Input } from '@/components/ui/input'
import type { Promotion } from '@/features/promotions/types'

export function PromotionSearchDropdown({
  query,
  onQuery,
  suggestions,
  onSelect,
}: {
  query: string
  onQuery: (v: string) => void
  suggestions: Promotion[]
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
    <div ref={containerRef} className="relative min-w-[200px]">
      <Input placeholder="Search promotions" value={query} onChange={(e) => onQuery(e.target.value)} className="max-w-xs" onFocus={() => setOpen(suggestions.length > 0)} />
      {open && (
        <div className="bg-popover text-popover-foreground absolute z-50 mt-2 w-[300px] rounded-lg border shadow-md">
          <div className="py-1">
            {suggestions.map((p) => (
              <button key={p.id} className="flex w-full items-center gap-2 px-2 py-2 text-left hover:bg-accent hover:text-accent-foreground" onClick={() => { onSelect(p.title); setOpen(false) }}>
                <span className="truncate flex-1">{p.title}</span>
                <span className="text-muted-foreground text-xs">{p.startDate} → {p.endDate}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}