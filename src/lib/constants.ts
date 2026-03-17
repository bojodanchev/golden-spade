import {
  Flame,
  ThermometerSun,
  Snowflake,
  Trophy,
  Star,
  Crown,
  Gem,
  Briefcase,
  Users,
  Building2,
  Globe,
  type LucideIcon,
} from "lucide-react"

// Pipeline Stages
export type StageKey =
  | "lead"
  | "contacted"
  | "qualified"
  | "proposal"
  | "negotiation"
  | "closed_won"
  | "closed_lost"

export interface StageConfig {
  label: string
  color: string
  bgColor: string
  textColor: string
  icon: LucideIcon
  order: number
}

export const STAGE_CONFIGS: Record<StageKey, StageConfig> = {
  lead: {
    label: "Lead",
    color: "#718096",
    bgColor: "bg-gray-100",
    textColor: "text-gray-700",
    icon: Snowflake,
    order: 0,
  },
  contacted: {
    label: "Contacted",
    color: "#4299e1",
    bgColor: "bg-blue-100",
    textColor: "text-blue-700",
    icon: ThermometerSun,
    order: 1,
  },
  qualified: {
    label: "Qualified",
    color: "#d69e2e",
    bgColor: "bg-yellow-100",
    textColor: "text-yellow-700",
    icon: Star,
    order: 2,
  },
  proposal: {
    label: "Proposal",
    color: "#dd6b20",
    bgColor: "bg-orange-100",
    textColor: "text-orange-700",
    icon: Flame,
    order: 3,
  },
  negotiation: {
    label: "Negotiation",
    color: "#805ad5",
    bgColor: "bg-purple-100",
    textColor: "text-purple-700",
    icon: Gem,
    order: 4,
  },
  closed_won: {
    label: "Closed Won",
    color: "#38a169",
    bgColor: "bg-green-100",
    textColor: "text-green-700",
    icon: Trophy,
    order: 5,
  },
  closed_lost: {
    label: "Closed Lost",
    color: "#e53e3e",
    bgColor: "bg-red-100",
    textColor: "text-red-700",
    icon: Snowflake,
    order: 6,
  },
}

// Member Tiers
export type TierKey = "bronze" | "silver" | "gold" | "platinum" | "vip"

export interface TierConfig {
  label: string
  color: string
  bgColor: string
  textColor: string
  icon: LucideIcon
  minSpend: number
}

export const TIER_CONFIGS: Record<TierKey, TierConfig> = {
  bronze: {
    label: "Bronze",
    color: "#cd7f32",
    bgColor: "bg-orange-100",
    textColor: "text-orange-800",
    icon: Star,
    minSpend: 0,
  },
  silver: {
    label: "Silver",
    color: "#c0c0c0",
    bgColor: "bg-gray-100",
    textColor: "text-gray-700",
    icon: Star,
    minSpend: 500,
  },
  gold: {
    label: "Gold",
    color: "#d69e2e",
    bgColor: "bg-yellow-100",
    textColor: "text-yellow-800",
    icon: Crown,
    minSpend: 2000,
  },
  platinum: {
    label: "Platinum",
    color: "#805ad5",
    bgColor: "bg-purple-100",
    textColor: "text-purple-800",
    icon: Gem,
    minSpend: 5000,
  },
  vip: {
    label: "VIP",
    color: "#1a365d",
    bgColor: "bg-blue-100",
    textColor: "text-blue-900",
    icon: Crown,
    minSpend: 10000,
  },
}

// Contact Categories
export type CategoryKey =
  | "player"
  | "sponsor"
  | "vendor"
  | "staff"
  | "vip_guest"
  | "media"

export interface CategoryConfig {
  label: string
  color: string
  bgColor: string
  textColor: string
}

export const CATEGORY_CONFIGS: Record<CategoryKey, CategoryConfig> = {
  player: {
    label: "Player",
    color: "#1a365d",
    bgColor: "bg-blue-100",
    textColor: "text-blue-800",
  },
  sponsor: {
    label: "Sponsor",
    color: "#d69e2e",
    bgColor: "bg-yellow-100",
    textColor: "text-yellow-800",
  },
  vendor: {
    label: "Vendor",
    color: "#38a169",
    bgColor: "bg-green-100",
    textColor: "text-green-800",
  },
  staff: {
    label: "Staff",
    color: "#805ad5",
    bgColor: "bg-purple-100",
    textColor: "text-purple-800",
  },
  vip_guest: {
    label: "VIP Guest",
    color: "#dd6b20",
    bgColor: "bg-orange-100",
    textColor: "text-orange-800",
  },
  media: {
    label: "Media",
    color: "#e53e3e",
    bgColor: "bg-red-100",
    textColor: "text-red-800",
  },
}

// Regions
export type RegionKey =
  | "sofia"
  | "plovdiv"
  | "varna"
  | "burgas"
  | "international"

export interface RegionConfig {
  label: string
  icon: LucideIcon
}

export const REGION_CONFIGS: Record<RegionKey, RegionConfig> = {
  sofia: { label: "Sofia", icon: Building2 },
  plovdiv: { label: "Plovdiv", icon: Building2 },
  varna: { label: "Varna", icon: Building2 },
  burgas: { label: "Burgas", icon: Building2 },
  international: { label: "International", icon: Globe },
}

// Company Types
export type CompanyTypeKey =
  | "casino"
  | "hotel"
  | "restaurant"
  | "sponsor"
  | "media"
  | "supplier"
  | "other"

export interface CompanyTypeConfig {
  label: string
  icon: LucideIcon
  color: string
  bgColor: string
  textColor: string
}

export const COMPANY_TYPE_CONFIGS: Record<CompanyTypeKey, CompanyTypeConfig> = {
  casino: {
    label: "Casino",
    icon: Gem,
    color: "#1a365d",
    bgColor: "bg-blue-100",
    textColor: "text-blue-800",
  },
  hotel: {
    label: "Hotel",
    icon: Building2,
    color: "#805ad5",
    bgColor: "bg-purple-100",
    textColor: "text-purple-800",
  },
  restaurant: {
    label: "Restaurant",
    icon: Briefcase,
    color: "#dd6b20",
    bgColor: "bg-orange-100",
    textColor: "text-orange-800",
  },
  sponsor: {
    label: "Sponsor",
    icon: Crown,
    color: "#d69e2e",
    bgColor: "bg-yellow-100",
    textColor: "text-yellow-800",
  },
  media: {
    label: "Media",
    icon: Globe,
    color: "#e53e3e",
    bgColor: "bg-red-100",
    textColor: "text-red-800",
  },
  supplier: {
    label: "Supplier",
    icon: Briefcase,
    color: "#38a169",
    bgColor: "bg-green-100",
    textColor: "text-green-800",
  },
  other: {
    label: "Other",
    icon: Users,
    color: "#718096",
    bgColor: "bg-gray-100",
    textColor: "text-gray-700",
  },
}

// Event Types
export type EventTypeKey =
  | "tournament"
  | "cash_game"
  | "private_event"
  | "networking"
  | "promotion"

export interface EventTypeConfig {
  label: string
  color: string
  bgColor: string
  textColor: string
}

export const EVENT_TYPE_CONFIGS: Record<EventTypeKey, EventTypeConfig> = {
  tournament: {
    label: "Tournament",
    color: "#1a365d",
    bgColor: "bg-blue-100",
    textColor: "text-blue-800",
  },
  cash_game: {
    label: "Cash Game",
    color: "#38a169",
    bgColor: "bg-green-100",
    textColor: "text-green-800",
  },
  private_event: {
    label: "Private Event",
    color: "#805ad5",
    bgColor: "bg-purple-100",
    textColor: "text-purple-800",
  },
  networking: {
    label: "Networking",
    color: "#d69e2e",
    bgColor: "bg-yellow-100",
    textColor: "text-yellow-800",
  },
  promotion: {
    label: "Promotion",
    color: "#dd6b20",
    bgColor: "bg-orange-100",
    textColor: "text-orange-800",
  },
}
