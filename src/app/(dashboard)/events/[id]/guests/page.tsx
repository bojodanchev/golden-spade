"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { PageHeader } from "@/components/shared/page-header"
import { GuestList } from "@/components/events/guest-list"
import { GuestForm } from "@/components/events/guest-form"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { getEvent } from "@/actions/events"
import { getGuests } from "@/actions/guests"
import type { EventGuest } from "@/types/events"
import {
  Plus,
  Info,
  Users,
  ClipboardCheck,
} from "lucide-react"

export default function GuestListPage() {
  const params = useParams<{ id: string }>()
  const eventId = params.id

  const [guests, setGuests] = useState<EventGuest[]>([])
  const [eventName, setEventName] = useState("")
  const [loading, setLoading] = useState(true)
  const [addOpen, setAddOpen] = useState(false)

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
      <PageHeader title={eventName || "Guest List"}>
        <Button
          className="bg-brand-primary hover:bg-brand-primary-light"
          onClick={() => setAddOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Guest
        </Button>
      </PageHeader>

      {/* Tab navigation */}
      <div className="flex gap-2 border-b pb-0">
        <Link href={`/dashboard/events/${eventId}`}>
          <Button variant="ghost" size="sm" className="gap-2 rounded-b-none">
            <Info className="h-4 w-4" />
            Overview
          </Button>
        </Link>
        <Link href={`/dashboard/events/${eventId}/guests`}>
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 rounded-b-none border-b-2 border-brand-primary"
          >
            <Users className="h-4 w-4" />
            Guest List
          </Button>
        </Link>
        <Link href={`/dashboard/events/${eventId}/check-in`}>
          <Button variant="ghost" size="sm" className="gap-2 rounded-b-none">
            <ClipboardCheck className="h-4 w-4" />
            Check-in
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : (
        <GuestList
          guests={guests}
          eventId={eventId}
          onRefresh={loadData}
        />
      )}

      <GuestForm
        open={addOpen}
        onOpenChange={setAddOpen}
        eventId={eventId}
        onAdded={loadData}
      />
    </div>
  )
}
