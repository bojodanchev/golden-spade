"use client"

import { PageHeader } from "@/components/shared/page-header"
import { EventForm } from "@/components/events/event-form"

export default function NewEventPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Create Event"
        description="Set up a new event with details and capacity"
      />
      <div className="mx-auto max-w-2xl">
        <EventForm />
      </div>
    </div>
  )
}
