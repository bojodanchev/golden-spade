"use client"

import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DEAL_STAGES, DEAL_TYPES } from "@/types/crm"
import type { Deal } from "@/types/crm"
import {
  createDeal,
  updateDeal,
  getCompaniesForSelect,
  getContactsForSelect,
} from "@/actions/deals"
import { toast } from "sonner"

interface DealFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  deal?: Deal | null
  onSuccess: () => void
}

type CompanyOption = { id: string; name: string }
type ContactOption = {
  id: string
  firstName: string
  lastName: string
  companyId: string | null
}

export function DealForm({ open, onOpenChange, deal, onSuccess }: DealFormProps) {
  const [loading, setLoading] = useState(false)
  const [companies, setCompanies] = useState<CompanyOption[]>([])
  const [contacts, setContacts] = useState<ContactOption[]>([])
  const [allContacts, setAllContacts] = useState<ContactOption[]>([])

  const [title, setTitle] = useState("")
  const [companyId, setCompanyId] = useState("")
  const [contactId, setContactId] = useState("")
  const [dealType, setDealType] = useState("sponsorship")
  const [stage, setStage] = useState("initial_contact")
  const [valueEur, setValueEur] = useState("")
  const [probability, setProbability] = useState("10")
  const [expectedCloseDate, setExpectedCloseDate] = useState("")
  const [notes, setNotes] = useState("")

  const isEditing = !!deal

  useEffect(() => {
    if (open) {
      loadOptions()
      if (deal) {
        setTitle(deal.title)
        setCompanyId(deal.companyId ?? "")
        setContactId(deal.contactId ?? "")
        setDealType(deal.dealType)
        setStage(deal.stage)
        setValueEur(deal.valueEur?.toString() ?? "")
        setProbability(deal.probability?.toString() ?? "10")
        setExpectedCloseDate(
          deal.expectedCloseDate
            ? new Date(deal.expectedCloseDate).toISOString().split("T")[0]
            : ""
        )
        setNotes(deal.notes ?? "")
      } else {
        resetForm()
      }
    }
  }, [open, deal])

  async function loadOptions() {
    const [companiesData, contactsData] = await Promise.all([
      getCompaniesForSelect(),
      getContactsForSelect(),
    ])
    setCompanies(companiesData)
    setAllContacts(contactsData)
    setContacts(contactsData)
  }

  // Filter contacts when company changes
  useEffect(() => {
    if (companyId) {
      setContacts(allContacts.filter((c) => c.companyId === companyId))
    } else {
      setContacts(allContacts)
    }
  }, [companyId, allContacts])

  function resetForm() {
    setTitle("")
    setCompanyId("")
    setContactId("")
    setDealType("sponsorship")
    setStage("initial_contact")
    setValueEur("")
    setProbability("10")
    setExpectedCloseDate("")
    setNotes("")
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim() || !dealType) return

    setLoading(true)
    try {
      const data = {
        title: title.trim(),
        companyId: companyId || null,
        contactId: contactId || null,
        dealType,
        stage,
        valueEur: valueEur ? parseFloat(valueEur) : null,
        probability: parseInt(probability) || 10,
        expectedCloseDate: expectedCloseDate || null,
        notes: notes.trim() || null,
      }

      if (isEditing) {
        await updateDeal(deal.id, data)
        toast.success("Deal updated")
      } else {
        await createDeal(data)
        toast.success("Deal created")
      }

      onOpenChange(false)
      onSuccess()
    } catch {
      toast.error(isEditing ? "Failed to update deal" : "Failed to create deal")
    } finally {
      setLoading(false)
    }
  }

  const STAGE_LABELS: Record<string, string> = {
    initial_contact: "Initial Contact",
    discovery: "Discovery",
    proposal: "Proposal",
    negotiation: "Negotiation",
    closed_won: "Closed Won",
    closed_lost: "Closed Lost",
  }

  const TYPE_LABELS: Record<string, string> = {
    sponsorship: "Sponsorship",
    advertising: "Advertising",
    membership: "Membership",
    event: "Event",
    partnership: "Partnership",
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Deal" : "New Deal"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Sponsorship for Summer Event"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Company</Label>
              <Select value={companyId} onValueChange={(v) => setCompanyId(v ?? "")}>
                <SelectTrigger>
                  <SelectValue placeholder="Select company" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  {companies.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Contact</Label>
              <Select value={contactId} onValueChange={(v) => setContactId(v ?? "")}>
                <SelectTrigger>
                  <SelectValue placeholder="Select contact" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  {contacts.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.firstName} {c.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Deal Type *</Label>
              <Select value={dealType} onValueChange={(v) => setDealType(v ?? "sponsorship")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DEAL_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {TYPE_LABELS[t] ?? t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Stage</Label>
              <Select value={stage} onValueChange={(v) => setStage(v ?? "initial_contact")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DEAL_STAGES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {STAGE_LABELS[s] ?? s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="valueEur">Value (EUR)</Label>
              <Input
                id="valueEur"
                type="number"
                min="0"
                step="0.01"
                value={valueEur}
                onChange={(e) => setValueEur(e.target.value)}
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="probability">Probability (%)</Label>
              <Input
                id="probability"
                type="number"
                min="0"
                max="100"
                value={probability}
                onChange={(e) => setProbability(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="expectedCloseDate">Expected Close Date</Label>
            <Input
              id="expectedCloseDate"
              type="date"
              value={expectedCloseDate}
              onChange={(e) => setExpectedCloseDate(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Additional notes..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || !title.trim()}
              className="bg-brand-primary hover:bg-brand-primary-light"
            >
              {loading
                ? "Saving..."
                : isEditing
                  ? "Update Deal"
                  : "Create Deal"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
