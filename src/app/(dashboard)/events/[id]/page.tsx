import Link from "next/link"
import { notFound } from "next/navigation"
import { getEvent } from "@/actions/events"
import { PageHeader } from "@/components/shared/page-header"
import { RsvpTracker } from "@/components/events/rsvp-tracker"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { formatDateTime, formatCurrency } from "@/lib/utils"
import type { EventStats } from "@/types/events"
import {
  Pencil,
  Trash2,
  Calendar,
  MapPin,
  Shirt,
  Users,
  ClipboardCheck,
  Info,
  Award,
} from "lucide-react"
import { EventDeleteButton } from "./delete-button"

const STATUS_STYLES: Record<string, string> = {
  draft: "bg-gray-100 text-gray-700 border-gray-200",
  active: "bg-green-100 text-green-800 border-green-200",
  completed: "bg-blue-100 text-blue-800 border-blue-200",
  cancelled: "bg-red-100 text-red-800 border-red-200",
}

const TYPE_LABELS: Record<string, string> = {
  gala_dinner: "Gala Dinner",
  conference: "Conference",
  networking: "Networking",
  workshop: "Workshop",
  awards: "Awards",
}

const SPONSOR_TIER_STYLES: Record<string, string> = {
  title: "bg-amber-100 text-amber-800",
  gold: "bg-yellow-100 text-yellow-800",
  silver: "bg-gray-100 text-gray-700",
  bronze: "bg-orange-100 text-orange-800",
  media: "bg-pink-100 text-pink-800",
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const event = await getEvent(id)

  if (!event) return notFound()

  const stats: EventStats = {
    totalGuests: event.guests.length,
    confirmed: event.guests.filter((g) => g.rsvpStatus === "confirmed").length,
    declined: event.guests.filter((g) => g.rsvpStatus === "declined").length,
    pending: event.guests.filter((g) => g.rsvpStatus === "pending").length,
    tentative: event.guests.filter((g) => g.rsvpStatus === "tentative").length,
    checkedIn: event.guests.filter((g) => g.checkedIn).length,
    capacityUsed: event.maxCapacity
      ? Math.round((event.guests.length / event.maxCapacity) * 100)
      : 0,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader title={event.name}>
        <Badge
          variant="outline"
          className={`${STATUS_STYLES[event.status]} text-sm`}
        >
          {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
        </Badge>
        <Link href={`/dashboard/events/${event.id}/edit`}>
          <Button variant="outline" size="sm">
            <Pencil className="mr-2 h-3.5 w-3.5" />
            Edit
          </Button>
        </Link>
        <EventDeleteButton eventId={event.id} eventName={event.name} />
      </PageHeader>

      {/* Stats */}
      <RsvpTracker stats={stats} maxCapacity={event.maxCapacity} />

      {/* Tab navigation */}
      <div className="flex gap-2 border-b pb-0">
        <Link href={`/dashboard/events/${event.id}`}>
          <Button variant="ghost" size="sm" className="gap-2 rounded-b-none border-b-2 border-brand-primary">
            <Info className="h-4 w-4" />
            Overview
          </Button>
        </Link>
        <Link href={`/dashboard/events/${event.id}/guests`}>
          <Button variant="ghost" size="sm" className="gap-2 rounded-b-none">
            <Users className="h-4 w-4" />
            Guest List
          </Button>
        </Link>
        <Link href={`/dashboard/events/${event.id}/check-in`}>
          <Button variant="ghost" size="sm" className="gap-2 rounded-b-none">
            <ClipboardCheck className="h-4 w-4" />
            Check-in
          </Button>
        </Link>
      </div>

      {/* Overview Content */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Event Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Event Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  Type
                </p>
                <p className="mt-1 text-sm font-medium">
                  {TYPE_LABELS[event.eventType] || event.eventType}
                </p>
              </div>
              {event.venue && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground">
                    Venue
                  </p>
                  <p className="mt-1 flex items-center gap-1.5 text-sm">
                    <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                    {event.venue}
                  </p>
                </div>
              )}
              {event.startsAt && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground">
                    Start
                  </p>
                  <p className="mt-1 flex items-center gap-1.5 text-sm">
                    <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                    {formatDateTime(event.startsAt)}
                  </p>
                </div>
              )}
              {event.endsAt && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground">
                    End
                  </p>
                  <p className="mt-1 flex items-center gap-1.5 text-sm">
                    <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                    {formatDateTime(event.endsAt)}
                  </p>
                </div>
              )}
              {event.dressCode && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground">
                    Dress Code
                  </p>
                  <p className="mt-1 flex items-center gap-1.5 text-sm">
                    <Shirt className="h-3.5 w-3.5 text-muted-foreground" />
                    {event.dressCode}
                  </p>
                </div>
              )}
              {event.maxCapacity && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground">
                    Capacity
                  </p>
                  <p className="mt-1 text-sm">{event.maxCapacity} guests</p>
                </div>
              )}
            </div>

            {event.description && (
              <>
                <Separator />
                <div>
                  <p className="text-xs font-medium text-muted-foreground">
                    Description
                  </p>
                  <p className="mt-1 whitespace-pre-wrap text-sm text-muted-foreground">
                    {event.description}
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Sponsors */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Award className="h-5 w-5 text-brand-secondary" />
              Sponsors
            </CardTitle>
          </CardHeader>
          <CardContent>
            {event.sponsors.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">
                No sponsors added for this event
              </p>
            ) : (
              <div className="space-y-3">
                {event.sponsors.map((sponsor) => (
                  <div
                    key={sponsor.id}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div>
                      <p className="font-medium">{sponsor.company.name}</p>
                      <Badge
                        variant="outline"
                        className={`mt-1 text-xs ${SPONSOR_TIER_STYLES[sponsor.sponsorTier] || ""}`}
                      >
                        {sponsor.sponsorTier.toUpperCase()}
                      </Badge>
                    </div>
                    {sponsor.amountEur && (
                      <span className="text-sm font-semibold text-brand-primary">
                        {formatCurrency(sponsor.amountEur)}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
