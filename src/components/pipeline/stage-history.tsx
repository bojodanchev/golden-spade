"use client"

import { Badge } from "@/components/ui/badge"
import { ArrowRight, Clock } from "lucide-react"
import type { DealStageHistory } from "@/types/crm"

const STAGE_LABELS: Record<string, string> = {
  initial_contact: "Initial Contact",
  discovery: "Discovery",
  proposal: "Proposal",
  negotiation: "Negotiation",
  closed_won: "Closed Won",
  closed_lost: "Closed Lost",
}

const STAGE_COLORS: Record<string, string> = {
  initial_contact: "bg-blue-100 text-blue-700",
  discovery: "bg-yellow-100 text-yellow-700",
  proposal: "bg-orange-100 text-orange-700",
  negotiation: "bg-purple-100 text-purple-700",
  closed_won: "bg-green-100 text-green-700",
  closed_lost: "bg-red-100 text-red-700",
}

type StageHistoryEntry = DealStageHistory & {
  changedBy?: { name?: string | null } | null
}

interface StageHistoryProps {
  history: StageHistoryEntry[]
}

export function StageHistory({ history }: StageHistoryProps) {
  if (history.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">No stage changes recorded.</p>
    )
  }

  return (
    <div className="space-y-3">
      {history.map((entry) => (
        <div
          key={entry.id}
          className="flex items-start gap-3 rounded-lg border p-3"
        >
          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
            <Clock className="h-4 w-4 text-muted-foreground" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              {entry.fromStage ? (
                <>
                  <Badge
                    variant="secondary"
                    className={STAGE_COLORS[entry.fromStage] ?? ""}
                  >
                    {STAGE_LABELS[entry.fromStage] ?? entry.fromStage}
                  </Badge>
                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                </>
              ) : null}
              <Badge
                variant="secondary"
                className={STAGE_COLORS[entry.toStage] ?? ""}
              >
                {STAGE_LABELS[entry.toStage] ?? entry.toStage}
              </Badge>
            </div>

            <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
              <span>
                {new Date(entry.changedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
              {entry.changedBy?.name && (
                <>
                  <span>by</span>
                  <span className="font-medium">{entry.changedBy.name}</span>
                </>
              )}
            </div>

            {entry.notes && (
              <p className="mt-1 text-sm text-muted-foreground">
                {entry.notes}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
