"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createCompany, updateCompany } from "@/actions/companies"
import {
  COMPANY_TYPE_CONFIGS,
  type CompanyTypeKey,
} from "@/lib/constants"
import { COMPANY_REGIONS, COMPANY_SIZES } from "@/types/crm"

interface CompanyFormProps {
  initialData?: {
    id: string
    name: string
    type: string
    website: string | null
    linkedinUrl: string | null
    country: string | null
    region: string
    size: string | null
    isMember: boolean
    notes: string | null
  }
}

export function CompanyForm({ initialData }: CompanyFormProps) {
  const router = useRouter()
  const isEditing = !!initialData

  const [loading, setLoading] = useState(false)
  const [name, setName] = useState(initialData?.name ?? "")
  const [type, setType] = useState(initialData?.type ?? "other")
  const [website, setWebsite] = useState(initialData?.website ?? "")
  const [linkedinUrl, setLinkedinUrl] = useState(initialData?.linkedinUrl ?? "")
  const [country, setCountry] = useState(initialData?.country ?? "")
  const [region, setRegion] = useState(initialData?.region ?? "bulgaria")
  const [size, setSize] = useState(initialData?.size ?? "")
  const [isMember, setIsMember] = useState(initialData?.isMember ?? false)
  const [notes, setNotes] = useState(initialData?.notes ?? "")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!name.trim()) {
      toast.error("Company name is required")
      return
    }

    setLoading(true)

    try {
      const data = {
        name: name.trim(),
        type,
        website: website.trim() || null,
        linkedinUrl: linkedinUrl.trim() || null,
        country: country.trim() || null,
        region,
        size: size || null,
        isMember,
        notes: notes.trim() || null,
      }

      if (isEditing) {
        await updateCompany(initialData.id, data)
        toast.success("Company updated successfully")
        router.push(`/dashboard/companies/${initialData.id}`)
      } else {
        const company = await createCompany(data)
        toast.success("Company created successfully")
        router.push(`/dashboard/companies/${company.id}`)
      }
    } catch {
      toast.error(isEditing ? "Failed to update company" : "Failed to create company")
    } finally {
      setLoading(false)
    }
  }

  const regionLabels: Record<string, string> = {
    bulgaria: "Bulgaria",
    balkans: "Balkans",
    europe: "Europe",
    global: "Global",
  }

  const sizeLabels: Record<string, string> = {
    small: "Small",
    medium: "Medium",
    large: "Large",
    enterprise: "Enterprise",
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>{isEditing ? "Edit Company" : "New Company"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">
              Company Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter company name"
              required
            />
          </div>

          {/* Type & Region */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={type} onValueChange={(v) => setType(v ?? "other")}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(COMPANY_TYPE_CONFIGS) as CompanyTypeKey[]).map(
                    (key) => (
                      <SelectItem key={key} value={key}>
                        {COMPANY_TYPE_CONFIGS[key].label}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Region</Label>
              <Select value={region} onValueChange={(v) => setRegion(v ?? "bulgaria")}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {COMPANY_REGIONS.map((r) => (
                    <SelectItem key={r} value={r}>
                      {regionLabels[r] ?? r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Website & LinkedIn */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
              <Input
                id="linkedinUrl"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                placeholder="https://linkedin.com/company/..."
              />
            </div>
          </div>

          {/* Country & Size */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="e.g. Bulgaria"
              />
            </div>
            <div className="space-y-2">
              <Label>Size</Label>
              <Select value={size} onValueChange={(v) => setSize(v ?? "")}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Not specified</SelectItem>
                  {COMPANY_SIZES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {sizeLabels[s] ?? s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Member Checkbox */}
          <div className="flex items-center gap-2">
            <Checkbox
              id="isMember"
              checked={isMember}
              onCheckedChange={(checked) => setIsMember(checked)}
            />
            <Label htmlFor="isMember" className="cursor-pointer">
              Active member
            </Label>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Additional notes about this company..."
              rows={4}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              type="submit"
              disabled={loading}
              className="bg-brand-primary hover:bg-brand-primary-light"
            >
              {loading
                ? "Saving..."
                : isEditing
                  ? "Update Company"
                  : "Create Company"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}
