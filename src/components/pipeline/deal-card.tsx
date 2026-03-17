"use client"

import { useDraggable } from "@dnd-kit/core"
import { CSS } from "@dnd-kit/utilities"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { GripVertical, Building2, User, Euro } from "lucide-react"
import type { DealWithRelations } from "@/types/crm"

interface DealCardProps {
  deal: DealWithRelations
  isDragOverlay?: boolean
}

export function DealCard({ deal, isDragOverlay }: DealCardProps) {
  const router = useRouter()
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: deal.id,
      data: { deal },
    })

  const style = transform
    ? {
        transform: CSS.Translate.toString(transform),
      }
    : undefined

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`cursor-pointer border p-3 transition-shadow hover:shadow-md ${
        isDragging ? "opacity-50" : ""
      } ${isDragOverlay ? "rotate-2 shadow-lg" : ""}`}
      onClick={() => {
        if (!isDragging) {
          router.push(`/dashboard/pipeline/${deal.id}`)
        }
      }}
    >
      <div className="flex items-start gap-2">
        <button
          {...listeners}
          {...attributes}
          className="mt-0.5 shrink-0 cursor-grab touch-none text-muted-foreground hover:text-foreground"
          onClick={(e) => e.stopPropagation()}
        >
          <GripVertical className="h-4 w-4" />
        </button>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{deal.title}</p>

          {deal.company && (
            <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
              <Building2 className="h-3 w-3 shrink-0" />
              <span className="truncate">{deal.company.name}</span>
            </div>
          )}

          {deal.contact && (
            <div className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
              <User className="h-3 w-3 shrink-0" />
              <span className="truncate">
                {deal.contact.firstName} {deal.contact.lastName}
              </span>
            </div>
          )}

          <div className="mt-2 flex items-center justify-between gap-2">
            {deal.valueEur != null && (
              <div className="flex items-center gap-0.5 text-sm font-semibold text-brand-secondary-dark">
                <Euro className="h-3.5 w-3.5" />
                {deal.valueEur.toLocaleString("en-US")}
              </div>
            )}
            <Badge variant="secondary" className="text-[10px]">
              {deal.probability}%
            </Badge>
          </div>
        </div>
      </div>
    </Card>
  )
}
