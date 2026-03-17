"use client"

import { useRouter, usePathname } from "next/navigation"
import { useCallback } from "react"
import { SearchInput } from "@/components/shared/search-input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CONTACT_CATEGORIES, LEAD_TIERS } from "@/types/crm"

interface ContactsFiltersProps {
  search: string
  category: string
  leadTier: string
}

export function ContactsFilters({
  search,
  category,
  leadTier,
}: ContactsFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()

  const updateParams = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams()
      const current = { search, category, leadTier, [key]: value }
      if (current.search) params.set("search", current.search)
      if (current.category && current.category !== "all")
        params.set("category", current.category)
      if (current.leadTier && current.leadTier !== "all")
        params.set("leadTier", current.leadTier)
      // Reset to page 1 on filter change
      const qs = params.toString()
      router.push(qs ? `${pathname}?${qs}` : pathname)
    },
    [router, pathname, search, category, leadTier]
  )

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <SearchInput
        value={search}
        onChange={(v) => updateParams("search", v)}
        placeholder="Search contacts..."
        className="w-full sm:w-64"
      />
      <Select
        value={category}
        onValueChange={(v) => updateParams("category", v ?? "all")}
      >
        <SelectTrigger className="w-full sm:w-40">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          {CONTACT_CATEGORIES.map((cat) => (
            <SelectItem key={cat} value={cat}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={leadTier}
        onValueChange={(v) => updateParams("leadTier", v ?? "all")}
      >
        <SelectTrigger className="w-full sm:w-40">
          <SelectValue placeholder="Lead Tier" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Tiers</SelectItem>
          {LEAD_TIERS.map((tier) => (
            <SelectItem key={tier} value={tier}>
              {tier.charAt(0).toUpperCase() + tier.slice(1)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
