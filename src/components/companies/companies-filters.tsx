"use client"

import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { useCallback } from "react"
import { SearchInput } from "@/components/shared/search-input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import {
  COMPANY_TYPE_CONFIGS,
  type CompanyTypeKey,
} from "@/lib/constants"
import { COMPANY_REGIONS } from "@/types/crm"

const regionLabels: Record<string, string> = {
  bulgaria: "Bulgaria",
  balkans: "Balkans",
  europe: "Europe",
  global: "Global",
}

interface CompaniesFiltersProps {
  search?: string
  type?: string
  region?: string
  isMember?: string
}

export function CompaniesFilters({
  search,
  type,
  region,
  isMember,
}: CompaniesFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value && value !== "all") {
        params.set(key, value)
      } else {
        params.delete(key)
      }
      params.delete("page")
      router.push(`${pathname}?${params.toString()}`)
    },
    [router, pathname, searchParams]
  )

  return (
    <div className="flex flex-wrap items-center gap-3">
      <SearchInput
        value={search ?? ""}
        onChange={(value) => updateParam("search", value)}
        placeholder="Search companies..."
        className="w-64"
      />

      <Select
        value={type ?? "all"}
        onValueChange={(value) => updateParam("type", value ?? "all")}
      >
        <SelectTrigger>
          <SelectValue placeholder="All types" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All types</SelectItem>
          {(Object.keys(COMPANY_TYPE_CONFIGS) as CompanyTypeKey[]).map(
            (key) => (
              <SelectItem key={key} value={key}>
                {COMPANY_TYPE_CONFIGS[key].label}
              </SelectItem>
            )
          )}
        </SelectContent>
      </Select>

      <Select
        value={region ?? "all"}
        onValueChange={(value) => updateParam("region", value ?? "all")}
      >
        <SelectTrigger>
          <SelectValue placeholder="All regions" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All regions</SelectItem>
          {COMPANY_REGIONS.map((r) => (
            <SelectItem key={r} value={r}>
              {regionLabels[r] ?? r}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="flex items-center gap-2">
        <Checkbox
          id="isMember"
          checked={isMember === "true"}
          onCheckedChange={(checked) =>
            updateParam("isMember", checked ? "true" : "")
          }
        />
        <Label htmlFor="isMember" className="cursor-pointer text-sm">
          Members only
        </Label>
      </div>
    </div>
  )
}
