"use client"

import { useDroppable } from "@dnd-kit/core"
import { Euro } from "lucide-react"
import type { DealWithRelations } from "@/types/crm"
import { DealCard } from "./deal-card"

interface KanbanColumnProps {
  stageId: string
  label: string
  color: string
  deals: DealWithRelations[]
}

export function KanbanColumn({
  stageId,
  label,
  color,
  deals,
}: KanbanColumnProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: stageId,
  })

  const totalValue = deals.reduce((sum, d) => sum + (d.valueEur ?? 0), 0)

  return (
    <div
      ref={setNodeRef}
      className={`flex h-full min-w-[280px] flex-col rounded-lg border bg-muted/30 transition-colors ${
        isOver ? "border-brand-secondary bg-brand-secondary/5" : ""
      }`}
    >
      {/* Column header with colored top border */}
      <div
        className="rounded-t-lg border-b px-3 py-3"
        style={{ borderTopWidth: 3, borderTopColor: color }}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">{label}</h3>
          <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
            {deals.length}
          </span>
        </div>
        {totalValue > 0 && (
          <div className="mt-1 flex items-center gap-0.5 text-xs text-muted-foreground">
            <Euro className="h-3 w-3" />
            {totalValue.toLocaleString("en-US")}
          </div>
        )}
      </div>

      {/* Cards */}
      <div className="flex-1 space-y-2 overflow-y-auto p-2">
        {deals.map((deal) => (
          <DealCard key={deal.id} deal={deal} />
        ))}
      </div>
    </div>
  )
}
