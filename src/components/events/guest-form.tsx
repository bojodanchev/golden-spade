"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { addGuest, addGuestsFromCRM, searchContacts } from "@/actions/guests"
import { GUEST_TIERS } from "@/types/events"
import { Loader2, Search, UserPlus, Users } from "lucide-react"
import { toast } from "sonner"

const TIER_LABELS: Record<string, string> = {
  vip: "VIP",
  sponsor: "Sponsor",
  speaker: "Speaker",
  media: "Media",
  partner: "Partner",
  member: "Member",
  general: "General",
}

interface GuestFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  eventId: string
  onAdded: () => void
}

interface ContactResult {
  id: string
  firstName: string
  lastName: string
  email: string | null
}

export function GuestForm({
  open,
  onOpenChange,
  eventId,
  onAdded,
}: GuestFormProps) {
  const [tab, setTab] = useState("manual")
  const [loading, setLoading] = useState(false)

  // Manual form
  const [manualName, setManualName] = useState("")
  const [manualEmail, setManualEmail] = useState("")
  const [manualTier, setManualTier] = useState("general")

  // CRM search
  const [searchQuery, setSearchQuery] = useState("")
  const [contacts, setContacts] = useState<ContactResult[]>([])
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [crmTier, setCrmTier] = useState("general")
  const [searching, setSearching] = useState(false)

  useEffect(() => {
    if (!searchQuery || searchQuery.length < 2) {
      setContacts([])
      return
    }
    const timer = setTimeout(async () => {
      setSearching(true)
      try {
        const results = await searchContacts(searchQuery)
        setContacts(results)
      } catch {
        toast.error("Search failed")
      } finally {
        setSearching(false)
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  function resetForm() {
    setManualName("")
    setManualEmail("")
    setManualTier("general")
    setSearchQuery("")
    setContacts([])
    setSelectedIds(new Set())
    setCrmTier("general")
  }

  async function handleManualAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!manualName.trim()) {
      toast.error("Guest name is required")
      return
    }

    setLoading(true)
    try {
      await addGuest({
        eventId,
        guestName: manualName,
        guestEmail: manualEmail || null,
        tier: manualTier,
      })
      toast.success("Guest added")
      resetForm()
      onAdded()
      onOpenChange(false)
    } catch {
      toast.error("Failed to add guest")
    } finally {
      setLoading(false)
    }
  }

  async function handleCrmAdd() {
    if (selectedIds.size === 0) {
      toast.error("Select at least one contact")
      return
    }

    setLoading(true)
    try {
      await addGuestsFromCRM(eventId, Array.from(selectedIds), crmTier)
      toast.success(`${selectedIds.size} guest(s) added`)
      resetForm()
      onAdded()
      onOpenChange(false)
    } catch {
      toast.error("Failed to add guests")
    } finally {
      setLoading(false)
    }
  }

  function toggleContact(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Guest</DialogTitle>
        </DialogHeader>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="manual" className="gap-2">
              <UserPlus className="h-4 w-4" />
              Manual
            </TabsTrigger>
            <TabsTrigger value="crm" className="gap-2">
              <Users className="h-4 w-4" />
              From CRM
            </TabsTrigger>
          </TabsList>

          <TabsContent value="manual">
            <form onSubmit={handleManualAdd} className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label htmlFor="guestName">Name *</Label>
                <Input
                  id="guestName"
                  value={manualName}
                  onChange={(e) => setManualName(e.target.value)}
                  placeholder="John Smith"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="guestEmail">Email</Label>
                <Input
                  id="guestEmail"
                  type="email"
                  value={manualEmail}
                  onChange={(e) => setManualEmail(e.target.value)}
                  placeholder="john@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="guestTier">Tier</Label>
                <Select value={manualTier} onValueChange={(v) => setManualTier(v ?? "general")}>
                  <SelectTrigger id="guestTier">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {GUEST_TIERS.map((t) => (
                      <SelectItem key={t} value={t}>
                        {TIER_LABELS[t]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-brand-primary hover:bg-brand-primary-light"
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Add Guest
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="crm">
            <div className="space-y-4 pt-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search contacts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>

              <ScrollArea className="h-56 rounded-md border">
                {searching ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  </div>
                ) : contacts.length === 0 ? (
                  <div className="py-8 text-center text-sm text-muted-foreground">
                    {searchQuery.length >= 2
                      ? "No contacts found"
                      : "Type to search contacts"}
                  </div>
                ) : (
                  <div className="space-y-1 p-2">
                    {contacts.map((c) => (
                      <label
                        key={c.id}
                        className="flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 hover:bg-muted"
                      >
                        <Checkbox
                          checked={selectedIds.has(c.id)}
                          onCheckedChange={() => toggleContact(c.id)}
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium">
                            {c.firstName} {c.lastName}
                          </p>
                          {c.email && (
                            <p className="truncate text-xs text-muted-foreground">
                              {c.email}
                            </p>
                          )}
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </ScrollArea>

              <div className="space-y-2">
                <Label>Tier for selected contacts</Label>
                <Select value={crmTier} onValueChange={(v) => setCrmTier(v ?? "general")}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {GUEST_TIERS.map((t) => (
                      <SelectItem key={t} value={t}>
                        {TIER_LABELS[t]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={handleCrmAdd}
                disabled={loading || selectedIds.size === 0}
                className="w-full bg-brand-primary hover:bg-brand-primary-light"
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Add {selectedIds.size} Contact{selectedIds.size !== 1 ? "s" : ""}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
