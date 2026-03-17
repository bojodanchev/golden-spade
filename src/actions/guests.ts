"use server"

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import QRCode from "qrcode"
import type { RsvpFormData } from "@/types/events"

export async function getGuests(eventId: string) {
  const guests = await db.eventGuest.findMany({
    where: { eventId },
    include: { contact: true },
    orderBy: [{ tier: "asc" }, { guestName: "asc" }],
  })
  return guests
}

interface GuestInsert {
  eventId: string
  guestName: string
  guestEmail?: string | null
  tier?: string
  contactId?: string | null
  tableNumber?: number | null
  notes?: string | null
}

export async function addGuest(data: GuestInsert) {
  const guest = await db.eventGuest.create({
    data: {
      eventId: data.eventId,
      guestName: data.guestName,
      guestEmail: data.guestEmail || null,
      tier: data.tier || "general",
      contactId: data.contactId || null,
      tableNumber: data.tableNumber || null,
      notes: data.notes || null,
    },
  })

  revalidatePath(`/dashboard/events/${data.eventId}`)
  return guest
}

export async function addGuestsFromCRM(
  eventId: string,
  contactIds: string[],
  tier: string = "general"
) {
  const contacts = await db.contact.findMany({
    where: { id: { in: contactIds } },
  })

  const guests = await Promise.all(
    contacts.map((contact) =>
      db.eventGuest.create({
        data: {
          eventId,
          contactId: contact.id,
          guestName: `${contact.firstName} ${contact.lastName}`,
          guestEmail: contact.email,
          tier,
        },
      })
    )
  )

  revalidatePath(`/dashboard/events/${eventId}`)
  return guests
}

export async function updateGuest(
  id: string,
  data: Partial<{
    tier: string
    tableNumber: number | null
    rsvpStatus: string
    dietaryRequirements: string | null
    plusOne: boolean
    plusOneName: string | null
    notes: string | null
  }>
) {
  const guest = await db.eventGuest.update({
    where: { id },
    data,
  })

  revalidatePath(`/dashboard/events/${guest.eventId}`)
  return guest
}

export async function removeGuest(id: string) {
  const guest = await db.eventGuest.findUnique({ where: { id } })
  if (!guest) throw new Error("Guest not found")

  await db.eventGuest.delete({ where: { id } })
  revalidatePath(`/dashboard/events/${guest.eventId}`)
}

export async function generateQRCode(guestId: string) {
  const guest = await db.eventGuest.findUnique({ where: { id: guestId } })
  if (!guest) throw new Error("Guest not found")

  const qrData = JSON.stringify({
    guestId: guest.id,
    eventId: guest.eventId,
    name: guest.guestName,
    token: guest.rsvpToken,
  })

  const qrCodeData = await QRCode.toDataURL(qrData, {
    width: 300,
    margin: 2,
    color: { dark: "#1a365d", light: "#ffffff" },
  })

  await db.eventGuest.update({
    where: { id: guestId },
    data: { qrCodeData },
  })

  revalidatePath(`/dashboard/events/${guest.eventId}`)
  return qrCodeData
}

export async function checkInGuest(guestId: string) {
  const guest = await db.eventGuest.update({
    where: { id: guestId },
    data: {
      checkedIn: true,
      checkedInAt: new Date(),
    },
  })

  revalidatePath(`/dashboard/events/${guest.eventId}`)
  return guest
}

export async function getRSVPByToken(token: string) {
  const guest = await db.eventGuest.findUnique({
    where: { rsvpToken: token },
    include: {
      event: true,
    },
  })

  return guest
}

export async function submitRSVP(token: string, data: RsvpFormData) {
  const guest = await db.eventGuest.update({
    where: { rsvpToken: token },
    data: {
      rsvpStatus: data.rsvpStatus,
      dietaryRequirements: data.dietaryRequirements || null,
      plusOne: data.plusOne,
      plusOneName: data.plusOneName || null,
      rsvpRespondedAt: new Date(),
    },
  })

  return guest
}

export async function searchContacts(query: string) {
  if (!query || query.length < 2) return []

  const contacts = await db.contact.findMany({
    where: {
      OR: [
        { firstName: { contains: query } },
        { lastName: { contains: query } },
        { email: { contains: query } },
      ],
    },
    take: 20,
    orderBy: { firstName: "asc" },
  })

  return contacts
}
