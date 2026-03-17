"use client"

import { useState } from "react"
import Link from "next/link"
import { CheckCircle2, Clock } from "lucide-react"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn, formatDate } from "@/lib/utils"
import { completeFollowUp } from "@/actions/follow-ups"
import type { Contact, FollowUp } from "@prisma/client"

const PRIORITY_STYLES: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; className: string }> = {
  low: { variant: "secondary", className: "bg-gray-100 text-gray-700" },
  medium: { variant: "secondary", className: "bg-blue-100 text-blue-700" },
  high: { variant: "secondary", className: "bg-orange-100 text-orange-700" },
  critical: { variant: "secondary", className: "bg-red-100 text-red-700" },
}

function getDueDateStatus(dueDate: Date): "overdue" | "today" | "upcoming" {
  const now = new Date()
  const due = new Date(dueDate)
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const dueDay = new Date(due.getFullYear(), due.getMonth(), due.getDate())

  if (dueDay < today) return "overdue"
  if (dueDay.getTime() === today.getTime()) return "today"
  return "upcoming"
}

const DUE_COLORS: Record<string, string> = {
  overdue: "text-red-600 font-semibold",
  today: "text-orange-600 font-medium",
  upcoming: "text-muted-foreground",
}

interface UpcomingFollowUpsProps {
  followUps: (FollowUp & { contact: Contact })[]
}

export function UpcomingFollowUps({ followUps }: UpcomingFollowUpsProps) {
  const [completing, setCompleting] = useState<string | null>(null)
  const [completed, setCompleted] = useState<Set<string>>(new Set())

  async function handleComplete(id: string) {
    setCompleting(id)
    try {
      await completeFollowUp(id)
      setCompleted((prev) => new Set(prev).add(id))
      toast.success("Follow-up marked as complete")
    } catch {
      toast.error("Failed to complete follow-up")
    } finally {
      setCompleting(null)
    }
  }

  const visibleFollowUps = followUps.filter((f) => !completed.has(f.id))

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          Upcoming Follow-ups
        </CardTitle>
      </CardHeader>
      <CardContent>
        {visibleFollowUps.length === 0 ? (
          <p className="py-4 text-center text-sm text-muted-foreground">
            No upcoming follow-ups
          </p>
        ) : (
          <div className="space-y-3">
            {visibleFollowUps.map((followUp) => {
              const dueStatus = getDueDateStatus(followUp.dueDate)
              const priorityStyle = PRIORITY_STYLES[followUp.priority] || PRIORITY_STYLES.medium

              return (
                <div
                  key={followUp.id}
                  className={cn(
                    "flex items-start justify-between gap-3 rounded-lg border p-3",
                    dueStatus === "overdue" && "border-red-200 bg-red-50/50"
                  )}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/dashboard/contacts/${followUp.contact.id}`}
                        className="text-sm font-medium hover:underline"
                      >
                        {followUp.contact.firstName} {followUp.contact.lastName}
                      </Link>
                      <Badge
                        className={priorityStyle.className}
                      >
                        {followUp.priority}
                      </Badge>
                    </div>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      {followUp.title}
                    </p>
                    <p className={cn("mt-1 text-xs", DUE_COLORS[dueStatus])}>
                      {dueStatus === "overdue" && "Overdue: "}
                      {dueStatus === "today" && "Due today: "}
                      {formatDate(followUp.dueDate)}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => handleComplete(followUp.id)}
                    disabled={completing === followUp.id}
                    title="Complete"
                  >
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  </Button>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
