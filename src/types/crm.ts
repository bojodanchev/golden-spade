import { Database } from '@/lib/supabase/database.types'

// ─── Row types (read from DB) ───────────────────────────────────────────────
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Tag = Database['public']['Tables']['tags']['Row']
export type Company = Database['public']['Tables']['companies']['Row']
export type Contact = Database['public']['Tables']['contacts']['Row']
export type Interaction = Database['public']['Tables']['interactions']['Row']
export type FollowUp = Database['public']['Tables']['follow_ups']['Row']
export type Deal = Database['public']['Tables']['deals']['Row']
export type DealStageHistory = Database['public']['Tables']['deal_stage_history']['Row']
export type LeadScoringRule = Database['public']['Tables']['lead_scoring_rules']['Row']
export type LeadScoreHistory = Database['public']['Tables']['lead_score_history']['Row']

// ─── Insert types (write to DB) ─────────────────────────────────────────────
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert']
export type TagInsert = Database['public']['Tables']['tags']['Insert']
export type CompanyInsert = Database['public']['Tables']['companies']['Insert']
export type ContactInsert = Database['public']['Tables']['contacts']['Insert']
export type InteractionInsert = Database['public']['Tables']['interactions']['Insert']
export type FollowUpInsert = Database['public']['Tables']['follow_ups']['Insert']
export type DealInsert = Database['public']['Tables']['deals']['Insert']
export type DealStageHistoryInsert = Database['public']['Tables']['deal_stage_history']['Insert']

// ─── Update types (partial writes) ──────────────────────────────────────────
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update']
export type TagUpdate = Database['public']['Tables']['tags']['Update']
export type CompanyUpdate = Database['public']['Tables']['companies']['Update']
export type ContactUpdate = Database['public']['Tables']['contacts']['Update']
export type InteractionUpdate = Database['public']['Tables']['interactions']['Update']
export type FollowUpUpdate = Database['public']['Tables']['follow_ups']['Update']
export type DealUpdate = Database['public']['Tables']['deals']['Update']

// ─── Enum types ─────────────────────────────────────────────────────────────
export type CompanyType = Database['public']['Enums']['company_type']
export type CompanyRegion = Database['public']['Enums']['company_region']
export type CompanySize = Database['public']['Enums']['company_size']
export type ContactCategory = Database['public']['Enums']['contact_category']
export type LeadTier = Database['public']['Enums']['lead_tier']
export type InteractionType = Database['public']['Enums']['interaction_type']
export type InteractionDirection = Database['public']['Enums']['interaction_direction']
export type FollowUpPriority = Database['public']['Enums']['follow_up_priority']
export type FollowUpStatus = Database['public']['Enums']['follow_up_status']
export type DealStage = Database['public']['Enums']['deal_stage']
export type DealType = Database['public']['Enums']['deal_type']

// ─── Extended types with joins ──────────────────────────────────────────────
export type ContactWithCompany = Contact & {
  company: Company | null
}

export type ContactWithTags = Contact & {
  tags: Tag[]
}

export type ContactFull = Contact & {
  company: Company | null
  tags: Tag[]
  interactions: Interaction[]
  follow_ups: FollowUp[]
}

export type CompanyWithContacts = Company & {
  contacts: Contact[]
}

export type CompanyWithTags = Company & {
  tags: Tag[]
}

export type CompanyFull = Company & {
  contacts: Contact[]
  tags: Tag[]
  deals: Deal[]
}

export type DealWithRelations = Deal & {
  company: Company | null
  contact: Contact | null
  stage_history: DealStageHistory[]
}

export type InteractionWithContact = Interaction & {
  contact: Contact | null
  company: Company | null
}

export type FollowUpWithContact = FollowUp & {
  contact: Contact | null
  assigned_profile: Profile | null
}

// ─── Pipeline view types ────────────────────────────────────────────────────
export type PipelineColumn = {
  stage: DealStage
  deals: DealWithRelations[]
  total_value: number
  weighted_value: number
}

export type PipelineView = PipelineColumn[]
