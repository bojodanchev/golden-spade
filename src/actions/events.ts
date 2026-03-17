"use server"

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"

interface GetEventsParams {
  status?: string
  eventType?: string
}

export async function getEvents(params: GetEventsParams = {}) {
  const { status, eventType } = params
  const where: Record<string, unknown> = {}

  if (status && status !== "all") {
    where.status = status
  }
  if (eventType && eventType !== "all") {
    where.eventType = eventType
  }

  const events = await db.event.findMany({
    where,
    include: {
      _count: { select: { guests: true } },
    },
    orderBy: { startsAt: "desc" },
  })

  return events
}

export async function getEvent(id: string) {
  const event = await db.event.findUnique({
    where: { id },
    include: {
      guests: {
        orderBy: [{ tier: "asc" }, { guestName: "asc" }],
      },
      sponsors: {
        include: { company: true },
        orderBy: { sponsorTier: "asc" },
      },
      followUps: {
        orderBy: { createdAt: "desc" },
      },
    },
  })

  return event
}

interface EventInsert {
  name: string
  eventType: string
  venue?: string | null
  description?: string | null
  startsAt?: string | null
  endsAt?: string | null
  maxCapacity?: number | null
  dressCode?: string | null
  status?: string
}

export async function createEvent(data: EventInsert) {
  const event = await db.event.create({
    data: {
      name: data.name,
      eventType: data.eventType,
      venue: data.venue || null,
      description: data.description || null,
      startsAt: data.startsAt ? new Date(data.startsAt) : null,
      endsAt: data.endsAt ? new Date(data.endsAt) : null,
      maxCapacity: data.maxCapacity || null,
      dressCode: data.dressCode || null,
      status: data.status || "draft",
    },
  })

  revalidatePath("/dashboard/events")
  return event
}

export async function updateEvent(id: string, data: Partial<EventInsert>) {
  const updateData: Record<string, unknown> = { ...data }
  if (data.startsAt !== undefined) {
    updateData.startsAt = data.startsAt ? new Date(data.startsAt) : null
  }
  if (data.endsAt !== undefined) {
    updateData.endsAt = data.endsAt ? new Date(data.endsAt) : null
  }

  const event = await db.event.update({
    where: { id },
    data: updateData,
  })

  revalidatePath("/dashboard/events")
  revalidatePath(`/dashboard/events/${id}`)
  return event
}

export async function deleteEvent(id: string) {
  await db.event.delete({ where: { id } })
  revalidatePath("/dashboard/events")
}
