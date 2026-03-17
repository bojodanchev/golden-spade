"use client"

import { useCallback, useEffect, useState } from "react"
import { Plus, Kanban } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { PageHeader } from "@/components/shared/page-header"
import { EmptyState } from "@/components/shared/empty-state"
import { KanbanBoard } from "@/components/pipeline/kanban-board"
import { DealForm } from "@/components/pipeline/deal-form"
import { getDeals } from "@/actions/deals"
import { DEAL_TYPES } from "@/types/crm"
import type { DealWithRelations } from "@/types/crm"

const TYPE_LABELS: Record<string, string> = {
  sponsorship: "Sponsorship",
  advertising: "Advertising",
  membership: "Membership",
  event: "Event",
  partnership: "Partnership",
}

export default function PipelinePage() {
  const [deals, setDeals] = useState<DealWithRelations[]>([])
  const [loading, setLoading] = useState(true)
  const [dealTypeFilter, setDealTypeFilter] = useState("all")
  const [formOpen, setFormOpen] = useState(false)

  const loadDeals = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getDeals({
        dealType: dealTypeFilter !== "all" ? dealTypeFilter : undefined,
      })
      setDeals(data as DealWithRelations[])
    } catch {
      // silently fail, deals will remain empty
    } finally {
      setLoading(false)
    }
  }, [dealTypeFilter])

  useEffect(() => {
    loadDeals()
  }, [loadDeals])

  return (
    <div className="space-y-6">
      <PageHeader title="Pipeline" description="Manage your deals and track progress">
        <Select value={dealTypeFilter} onValueChange={(v) => setDealTypeFilter(v ?? "all")}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {DEAL_TYPES.map((t) => (
              <SelectItem key={t} value={t}>
                {TYPE_LABELS[t] ?? t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          onClick={() => setFormOpen(true)}
          className="bg-brand-primary hover:bg-brand-primary-light"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Deal
        </Button>
      </PageHeader>

      {loading ? (
        <div className="flex h-96 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-primary border-t-transparent" />
        </div>
      ) : deals.length === 0 && dealTypeFilter === "all" ? (
        <EmptyState
          icon={Kanban}
          title="No deals yet"
          description="Create your first deal to start tracking your pipeline."
          actionLabel="Add Deal"
          onAction={() => setFormOpen(true)}
        />
      ) : (
        <KanbanBoard deals={deals} onStageChange={loadDeals} />
      )}

      <DealForm
        open={formOpen}
        onOpenChange={setFormOpen}
        onSuccess={loadDeals}
      />
    </div>
  )
}
