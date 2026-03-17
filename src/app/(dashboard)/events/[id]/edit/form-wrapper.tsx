"use client"

import { EventForm } from "@/components/events/event-form"
import type { Event } from "@/types/events"

interface FormWrapperProps {
  event: Event
}

export function EventFormWrapper({ event }: FormWrapperProps) {
  return <EventForm event={event} />
}
