"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createEvent, updateEvent } from "@/actions/events"
import { EVENT_TYPES, EVENT_STATUSES } from "@/types/events"
import type { Event } from "@/types/events"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

const TYPE_LABELS: Record<string, string> = {
  gala_dinner: "Gala Dinner",
  conference: "Conference",
  networking: "Networking",
  workshop: "Workshop",
  awards: "Awards",
}

const STATUS_LABELS: Record<string, string> = {
  draft: "Draft",
  active: "Active",
  completed: "Completed",
  cancelled: "Cancelled",
}

function toLocalDatetimeString(date: Date | string | null | undefined): string {
  if (!date) return ""
  const d = new Date(date)
  const offset = d.getTimezoneOffset()
  const local = new Date(d.getTime() - offset * 60000)
  return local.toISOString().slice(0, 16)
}

interface EventFormProps {
  event?: Event | null
}

export function EventForm({ event }: EventFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    name: event?.name ?? "",
    eventType: event?.eventType ?? "networking",
    venue: event?.venue ?? "",
    description: event?.description ?? "",
    startsAt: toLocalDatetimeString(event?.startsAt),
    endsAt: toLocalDatetimeString(event?.endsAt),
    maxCapacity: event?.maxCapacity?.toString() ?? "",
    dressCode: event?.dressCode ?? "",
    status: event?.status ?? "draft",
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!formData.name.trim()) {
      toast.error("Event name is required")
      return
    }

    setLoading(true)
    try {
      const payload = {
        name: formData.name,
        eventType: formData.eventType,
        venue: formData.venue || null,
        description: formData.description || null,
        startsAt: formData.startsAt || null,
        endsAt: formData.endsAt || null,
        maxCapacity: formData.maxCapacity
          ? parseInt(formData.maxCapacity, 10)
          : null,
        dressCode: formData.dressCode || null,
        status: formData.status,
      }

      if (event) {
        await updateEvent(event.id, payload)
        toast.success("Event updated")
        router.push(`/dashboard/events/${event.id}`)
      } else {
        const created = await createEvent(payload)
        toast.success("Event created")
        router.push(`/dashboard/events/${created.id}`)
      }
    } catch {
      toast.error("Failed to save event")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>{event ? "Edit Event" : "New Event"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="name">Event Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Annual Gala Dinner 2026"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="eventType">Event Type</Label>
              <Select
                value={formData.eventType}
                onValueChange={(v) =>
                  setFormData({ ...formData, eventType: v ?? "networking" })
                }
              >
                <SelectTrigger id="eventType">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {EVENT_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {TYPE_LABELS[t] || t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(v) => setFormData({ ...formData, status: v ?? "draft" })}
              >
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {EVENT_STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {STATUS_LABELS[s] || s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="venue">Venue</Label>
              <Input
                id="venue"
                value={formData.venue}
                onChange={(e) =>
                  setFormData({ ...formData, venue: e.target.value })
                }
                placeholder="Sofia Event Center"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="startsAt">Start Date & Time</Label>
              <Input
                id="startsAt"
                type="datetime-local"
                value={formData.startsAt}
                onChange={(e) =>
                  setFormData({ ...formData, startsAt: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endsAt">End Date & Time</Label>
              <Input
                id="endsAt"
                type="datetime-local"
                value={formData.endsAt}
                onChange={(e) =>
                  setFormData({ ...formData, endsAt: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxCapacity">Max Capacity</Label>
              <Input
                id="maxCapacity"
                type="number"
                min="1"
                value={formData.maxCapacity}
                onChange={(e) =>
                  setFormData({ ...formData, maxCapacity: e.target.value })
                }
                placeholder="200"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dressCode">Dress Code</Label>
              <Input
                id="dressCode"
                value={formData.dressCode}
                onChange={(e) =>
                  setFormData({ ...formData, dressCode: e.target.value })
                }
                placeholder="Black Tie"
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                rows={4}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Event description..."
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="submit"
              disabled={loading}
              className="bg-brand-primary hover:bg-brand-primary-light"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {event ? "Update Event" : "Create Event"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}
