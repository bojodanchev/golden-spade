import Link from "next/link"
import { getEvents } from "@/actions/events"
import { PageHeader } from "@/components/shared/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { EmptyState } from "@/components/shared/empty-state"
import { formatDate, formatDateTime } from "@/lib/utils"
import {
  Plus,
  Calendar,
  MapPin,
  Users,
} from "lucide-react"

const TYPE_LABELS: Record<string, string> = {
  gala_dinner: "Gala Dinner",
  conference: "Conference",
  networking: "Networking",
  workshop: "Workshop",
  awards: "Awards",
}

const STATUS_STYLES: Record<string, string> = {
  draft: "bg-gray-100 text-gray-700 border-gray-200",
  active: "bg-green-100 text-green-800 border-green-200",
  completed: "bg-blue-100 text-blue-800 border-blue-200",
  cancelled: "bg-red-100 text-red-800 border-red-200",
}

const TYPE_STYLES: Record<string, string> = {
  gala_dinner: "bg-amber-100 text-amber-800 border-amber-200",
  conference: "bg-purple-100 text-purple-800 border-purple-200",
  networking: "bg-cyan-100 text-cyan-800 border-cyan-200",
  workshop: "bg-blue-100 text-blue-800 border-blue-200",
  awards: "bg-brand-secondary/20 text-amber-800 border-brand-secondary/40",
}

export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; eventType?: string }>
}) {
  const params = await searchParams
  const events = await getEvents({
    status: params.status,
    eventType: params.eventType,
  })

  return (
    <div className="space-y-6">
      <PageHeader title="Events" description="Manage events, guests, and invitations">
        <Link href="/dashboard/events/new">
          <Button className="bg-brand-primary hover:bg-brand-primary-light">
            <Plus className="mr-2 h-4 w-4" />
            Create Event
          </Button>
        </Link>
      </PageHeader>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <form className="flex gap-3">
          <select
            name="status"
            defaultValue={params.status || "all"}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="all">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <select
            name="eventType"
            defaultValue={params.eventType || "all"}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="all">All Types</option>
            <option value="gala_dinner">Gala Dinner</option>
            <option value="conference">Conference</option>
            <option value="networking">Networking</option>
            <option value="workshop">Workshop</option>
            <option value="awards">Awards</option>
          </select>
          <Button type="submit" variant="outline" size="sm">
            Filter
          </Button>
        </form>
      </div>

      {/* Event Cards */}
      {events.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No events yet"
          description="Create your first event to start managing guests and invitations."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <Link key={event.id} href={`/dashboard/events/${event.id}`}>
              <Card className="transition-shadow hover:shadow-md">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-heading text-lg font-semibold leading-tight">
                      {event.name}
                    </h3>
                    <Badge
                      variant="outline"
                      className={`shrink-0 text-xs ${STATUS_STYLES[event.status]}`}
                    >
                      {event.status.charAt(0).toUpperCase() +
                        event.status.slice(1)}
                    </Badge>
                  </div>

                  <div className="mt-3 flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={`text-xs ${TYPE_STYLES[event.eventType] || ""}`}
                    >
                      {TYPE_LABELS[event.eventType] || event.eventType}
                    </Badge>
                  </div>

                  <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                    {event.venue && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">{event.venue}</span>
                      </div>
                    )}
                    {event.startsAt && (
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5 shrink-0" />
                        <span>{formatDateTime(event.startsAt)}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Users className="h-3.5 w-3.5 shrink-0" />
                      <span>
                        {event._count.guests} guest
                        {event._count.guests !== 1 ? "s" : ""}
                        {event.maxCapacity
                          ? ` / ${event.maxCapacity} capacity`
                          : ""}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
