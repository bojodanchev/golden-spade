"use client"

import { useState } from "react"
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import { DEAL_STAGES } from "@/types/crm"
import type { DealWithRelations } from "@/types/crm"
import { updateDealStage } from "@/actions/deals"
import { KanbanColumn } from "./kanban-column"
import { DealCard } from "./deal-card"
import { toast } from "sonner"

const PIPELINE_STAGE_CONFIG: Record<
  string,
  { label: string; color: string }
> = {
  initial_contact: { label: "Initial Contact", color: "#4299e1" },
  discovery: { label: "Discovery", color: "#d69e2e" },
  proposal: { label: "Proposal", color: "#dd6b20" },
  negotiation: { label: "Negotiation", color: "#805ad5" },
  closed_won: { label: "Closed Won", color: "#38a169" },
  closed_lost: { label: "Closed Lost", color: "#e53e3e" },
}

interface KanbanBoardProps {
  deals: DealWithRelations[]
  onStageChange: () => void
}

export function KanbanBoard({ deals, onStageChange }: KanbanBoardProps) {
  const [activeDeal, setActiveDeal] = useState<DealWithRelations | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  // Group deals by stage
  const dealsByStage: Record<string, DealWithRelations[]> = {}
  for (const stage of DEAL_STAGES) {
    dealsByStage[stage] = deals.filter((d) => d.stage === stage)
  }

  function handleDragStart(event: DragStartEvent) {
    const deal = event.active.data.current?.deal as DealWithRelations
    setActiveDeal(deal ?? null)
  }

  async function handleDragEnd(event: DragEndEvent) {
    setActiveDeal(null)

    const { active, over } = event
    if (!over) return

    const dealId = active.id as string
    const newStage = over.id as string

    // Find the deal to check current stage
    const deal = deals.find((d) => d.id === dealId)
    if (!deal || deal.stage === newStage) return

    try {
      await updateDealStage(dealId, newStage)
      onStageChange()
      toast.success(
        `Moved to ${PIPELINE_STAGE_CONFIG[newStage]?.label ?? newStage}`
      )
    } catch {
      toast.error("Failed to update deal stage")
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-3 overflow-x-auto pb-4" style={{ minHeight: 500 }}>
        {DEAL_STAGES.map((stage) => {
          const config = PIPELINE_STAGE_CONFIG[stage]
          return (
            <KanbanColumn
              key={stage}
              stageId={stage}
              label={config?.label ?? stage}
              color={config?.color ?? "#718096"}
              deals={dealsByStage[stage] ?? []}
            />
          )
        })}
      </div>

      <DragOverlay>
        {activeDeal ? <DealCard deal={activeDeal} isDragOverlay /> : null}
      </DragOverlay>
    </DndContext>
  )
}
