import type {
  Event,
  EventGuest,
  EventSponsor,
  EventFollowUp,
} from "@prisma/client"

export type {
  Event,
  EventGuest,
  EventSponsor,
  EventFollowUp,
}

// Extended types
export type EventWithGuests = Event & {
  guests: EventGuest[]
}

export type EventFull = Event & {
  guests: EventGuest[]
  sponsors: (EventSponsor & { company: import("@prisma/client").Company })[]
  followUps: EventFollowUp[]
}

export type EventStats = {
  totalGuests: number
  confirmed: number
  declined: number
  pending: number
  tentative: number
  checkedIn: number
  capacityUsed: number
}

export type RsvpFormData = {
  rsvpStatus: "confirmed" | "declined" | "tentative"
  dietaryRequirements?: string
  plusOne: boolean
  plusOneName?: string
}

// Enum-like constants
export const EVENT_TYPES = ["gala_dinner", "conference", "networking", "workshop", "awards"] as const
export const EVENT_STATUSES = ["draft", "active", "completed", "cancelled"] as const
export const GUEST_TIERS = ["vip", "sponsor", "speaker", "media", "partner", "member", "general"] as const
export const RSVP_STATUSES = ["pending", "confirmed", "declined", "tentative"] as const
export const SPONSOR_TIERS = ["title", "gold", "silver", "bronze", "media"] as const

export type EventType = typeof EVENT_TYPES[number]
export type EventStatus = typeof EVENT_STATUSES[number]
export type GuestTier = typeof GUEST_TIERS[number]
export type RsvpStatus = typeof RSVP_STATUSES[number]
export type SponsorTier = typeof SPONSOR_TIERS[number]
