import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

export function OrderNotesCard({ notes, onNotes }: { notes: string; onNotes: (v: string) => void }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notes</CardTitle>
      </CardHeader>
      <CardContent>
        <textarea value={notes} onChange={(e) => onNotes(e.target.value)} className="bg-background border-input w-full rounded-md border p-3 text-sm" rows={6} />
      </CardContent>
    </Card>
  )
}