import type {
  Company,
  Contact,
  Tag,
  Interaction,
  FollowUp,
  Deal,
  DealStageHistory,
  ContactTag,
  CompanyTag,
  LeadScoringRule,
  LeadScoreHistory,
} from "@prisma/client"

// Re-export Prisma types
export type {
  Company,
  Contact,
  Tag,
  Interaction,
  FollowUp,
  Deal,
  DealStageHistory,
  ContactTag,
  CompanyTag,
  LeadScoringRule,
  LeadScoreHistory,
}

// Extended types with relations
export type ContactWithCompany = Contact & {
  company: Company | null
}

export type ContactFull = Contact & {
  company: Company | null
  tags: (ContactTag & { tag: Tag })[]
  interactions: Interaction[]
  followUps: FollowUp[]
  deals: Deal[]
}

export type CompanyWithContacts = Company & {
  contacts: Contact[]
}

export type CompanyFull = Company & {
  contacts: Contact[]
  tags: (CompanyTag & { tag: Tag })[]
  deals: Deal[]
}

export type DealWithRelations = Deal & {
  company: Company | null
  contact: Contact | null
  stageHistory: DealStageHistory[]
}

export type InteractionWithRelations = Interaction & {
  contact: Contact | null
  company: Company | null
  deal: Deal | null
}

// Enum-like constants for type safety
export const COMPANY_TYPES = ["gaming_operator", "supplier", "association", "media", "regulator", "technology", "legal", "financial", "other"] as const
export const COMPANY_REGIONS = ["bulgaria", "balkans", "europe", "global"] as const
export const COMPANY_SIZES = ["small", "medium", "large", "enterprise"] as const
export const CONTACT_CATEGORIES = ["sponsor", "partner", "member", "media", "vip", "speaker", "government", "other"] as const
export const LEAD_TIERS = ["cold", "warm", "hot", "qualified"] as const
export const INTERACTION_TYPES = ["email", "call", "meeting", "linkedin", "note", "whatsapp"] as const
export const INTERACTION_DIRECTIONS = ["inbound", "outbound"] as const
export const DEAL_STAGES = ["initial_contact", "discovery", "proposal", "negotiation", "closed_won", "closed_lost"] as const
export const DEAL_TYPES = ["sponsorship", "advertising", "membership", "event", "partnership"] as const
export const FOLLOW_UP_PRIORITIES = ["low", "medium", "high", "critical"] as const
export const FOLLOW_UP_STATUSES = ["pending", "completed", "overdue"] as const

export type CompanyType = typeof COMPANY_TYPES[number]
export type CompanyRegion = typeof COMPANY_REGIONS[number]
export type CompanySize = typeof COMPANY_SIZES[number]
export type ContactCategory = typeof CONTACT_CATEGORIES[number]
export type LeadTier = typeof LEAD_TIERS[number]
export type InteractionType = typeof INTERACTION_TYPES[number]
export type DealStage = typeof DEAL_STAGES[number]
export type DealType = typeof DEAL_TYPES[number]
export type FollowUpPriority = typeof FOLLOW_UP_PRIORITIES[number]
export type FollowUpStatus = typeof FOLLOW_UP_STATUSES[number]
