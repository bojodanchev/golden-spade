"use client"

import { useState } from "react"
import type { Interaction } from "@/types/crm"
import { timeAgo } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Mail,
  Phone,
  Users,
  Linkedin,
  StickyNote,
  MessageCircle,
  ArrowDownLeft,
  ArrowUpRight,
  Trash2,
} from "lucide-react"
import { deleteInteraction } from "@/actions/interactions"
import { toast } from "sonner"

const typeIcons: Record<string, React.ElementType> = {
  email: Mail,
  call: Phone,
  meeting: Users,
  linkedin: Linkedin,
  note: StickyNote,
  whatsapp: MessageCircle,
}

const typeColors: Record<string, string> = {
  email: "bg-blue-100 text-blue-600",
  call: "bg-green-100 text-green-600",
  meeting: "bg-purple-100 text-purple-600",
  linkedin: "bg-sky-100 text-sky-600",
  note: "bg-yellow-100 text-yellow-600",
  whatsapp: "bg-emerald-100 text-emerald-600",
}

interface InteractionTimelineProps {
  interactions: Interaction[]
}

export function InteractionTimeline({ interactions }: InteractionTimelineProps) {
  const [deleting, setDeleting] = useState<string | null>(null)

  async function handleDelete(id: string) {
    setDeleting(id)
    try {
      await deleteInteraction(id)
      toast.success("Interaction deleted")
    } catch {
      toast.error("Failed to delete interaction")
    } finally {
      setDeleting(null)
    }
  }

  if (interactions.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        No interactions yet. Log the first one to start tracking.
      </p>
    )
  }

  return (
    <div className="space-y-4">
      {interactions.map((interaction) => {
        const Icon = typeIcons[interaction.type] || StickyNote
        const colorClass = typeColors[interaction.type] || "bg-gray-100 text-gray-600"

        return (
          <div
            key={interaction.id}
            className="flex gap-3 rounded-lg border p-4 transition-colors hover:bg-muted/50"
          >
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${colorClass}`}>
              <Icon className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    {interaction.subject && (
                      <span className="font-medium">{interaction.subject}</span>
                    )}
                    {interaction.direction && (
                      <span className="flex items-center gap-0.5 text-xs text-muted-foreground">
                        {interaction.direction === "inbound" ? (
                          <ArrowDownLeft className="h-3 w-3" />
                        ) : (
                          <ArrowUpRight className="h-3 w-3" />
                        )}
                        {interaction.direction}
                      </span>
                    )}
                  </div>
                  {interaction.content && (
                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                      {interaction.content}
                    </p>
                  )}
                  {interaction.outcome && (
                    <p className="mt-1 text-sm">
                      <span className="font-medium text-muted-foreground">Outcome:</span>{" "}
                      {interaction.outcome}
                    </p>
                  )}
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    {timeAgo(interaction.occurredAt)}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-muted-foreground hover:text-red-600"
                    onClick={() => handleDelete(interaction.id)}
                    disabled={deleting === interaction.id}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
