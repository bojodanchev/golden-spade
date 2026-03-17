"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { PageHeader } from "@/components/shared/page-header"
import { CheckInScanner } from "@/components/events/check-in-scanner"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { getEvent } from "@/actions/events"
import { getGuests } from "@/actions/guests"
import type { EventGuest } from "@/types/events"
import { Info, Users, ClipboardCheck } from "lucide-react"

export default function CheckInPage() {
  const params = useParams<{ id: string }>()
  const eventId = params.id

  const [guests, setGuests] = useState<EventGuest[]>([])
  const [eventName, setEventName] = useState("")
  const [loading, setLoading] = useState(true)

  const loadData = useCallback(async () => {
    try {
      const [guestData, eventData] = await Promise.all([
        getGuests(eventId),
        getEvent(eventId),
      ])
      setGuests(guestData)
      if (eventData) setEventName(eventData.name)
    } catch {
      // handle silently
    } finally {
      setLoading(false)
    }
  }, [eventId])

  useEffect(() => {
    loadData()
  }, [loadData])

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Check-in: ${eventName || "..."}`}
        description="Mark guests as arrived"
      />

      {/* Tab navigation */}
      <div className="flex gap-2 border-b pb-0">
        <Link href={`/dashboard/events/${eventId}`}>
          <Button variant="ghost" size="sm" className="gap-2 rounded-b-none">
            <Info className="h-4 w-4" />
            Overview
          </Button>
        </Link>
        <Link href={`/dashboard/events/${eventId}/guests`}>
          <Button variant="ghost" size="sm" className="gap-2 rounded-b-none">
            <Users className="h-4 w-4" />
            Guest List
          </Button>
        </Link>
        <Link href={`/dashboard/events/${eventId}/check-in`}>
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 rounded-b-none border-b-2 border-brand-primary"
          >
            <ClipboardCheck className="h-4 w-4" />
            Check-in
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-14 w-full" />
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      ) : (
        <CheckInScanner guests={guests} onRefresh={loadData} />
      )}
    </div>
  )
}
