"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { EventStats } from "@/types/events"
import { Users, UserCheck, UserX, Clock, CheckCircle2 } from "lucide-react"

interface RsvpTrackerProps {
  stats: EventStats
  maxCapacity?: number | null
}

export function RsvpTracker({ stats, maxCapacity }: RsvpTrackerProps) {
  const capacityPercent = maxCapacity
    ? Math.round((stats.totalGuests / maxCapacity) * 100)
    : 0

  const items = [
    {
      label: "Total Guests",
      value: stats.totalGuests,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      label: "Confirmed",
      value: stats.confirmed,
      icon: UserCheck,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      label: "Declined",
      value: stats.declined,
      icon: UserX,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      label: "Pending",
      value: stats.pending,
      icon: Clock,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
    },
    {
      label: "Checked In",
      value: stats.checkedIn,
      icon: CheckCircle2,
      color: "text-brand-primary",
      bgColor: "bg-blue-50",
    },
  ]

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {items.map((item) => (
          <Card key={item.label}>
            <CardContent className="flex items-center gap-3 p-4">
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${item.bgColor}`}
              >
                <item.icon className={`h-5 w-5 ${item.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold">{item.value}</p>
                <p className="text-xs text-muted-foreground">{item.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {maxCapacity && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Capacity</span>
              <span className="font-medium">
                {stats.totalGuests} / {maxCapacity} ({capacityPercent}%)
              </span>
            </div>
            <Progress value={capacityPercent} className="mt-2 h-2" />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
