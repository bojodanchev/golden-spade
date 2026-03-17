"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { updateGuest, removeGuest } from "@/actions/guests"
import { GUEST_TIERS, RSVP_STATUSES } from "@/types/events"
import type { EventGuest } from "@/types/events"
import {
  CheckCircle2,
  Circle,
  Copy,
  Trash2,
  Loader2,
} from "lucide-react"
import { toast } from "sonner"

const TIER_COLORS: Record<string, string> = {
  vip: "bg-amber-100 text-amber-800 border-amber-200",
  sponsor: "bg-purple-100 text-purple-800 border-purple-200",
  speaker: "bg-blue-100 text-blue-800 border-blue-200",
  media: "bg-pink-100 text-pink-800 border-pink-200",
  partner: "bg-cyan-100 text-cyan-800 border-cyan-200",
  member: "bg-green-100 text-green-800 border-green-200",
  general: "bg-gray-100 text-gray-700 border-gray-200",
}

const RSVP_COLORS: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800 border-amber-200",
  confirmed: "bg-green-100 text-green-800 border-green-200",
  declined: "bg-red-100 text-red-800 border-red-200",
  tentative: "bg-blue-100 text-blue-800 border-blue-200",
}

interface GuestListProps {
  guests: EventGuest[]
  eventId: string
  onRefresh: () => void
}

export function GuestList({ guests, eventId, onRefresh }: GuestListProps) {
  const [editingTable, setEditingTable] = useState<string | null>(null)
  const [tableValue, setTableValue] = useState("")
  const [removingId, setRemovingId] = useState<string | null>(null)

  async function handleTierChange(guestId: string, tier: string | null) {
    if (!tier) return
    try {
      await updateGuest(guestId, { tier })
      onRefresh()
    } catch {
      toast.error("Failed to update tier")
    }
  }

  async function handleTableSave(guestId: string) {
    try {
      await updateGuest(guestId, {
        tableNumber: tableValue ? parseInt(tableValue, 10) : null,
      })
      setEditingTable(null)
      onRefresh()
    } catch {
      toast.error("Failed to update table")
    }
  }

  async function handleRemove(guestId: string) {
    setRemovingId(guestId)
    try {
      await removeGuest(guestId)
      toast.success("Guest removed")
      onRefresh()
    } catch {
      toast.error("Failed to remove guest")
    } finally {
      setRemovingId(null)
    }
  }

  function copyRsvpLink(token: string) {
    const url = `${window.location.origin}/rsvp/${token}`
    navigator.clipboard.writeText(url)
    toast.success("RSVP link copied")
  }

  if (guests.length === 0) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        No guests added yet. Use the &quot;Add Guest&quot; button to get started.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Guest</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Tier</TableHead>
            <TableHead className="w-20">Table</TableHead>
            <TableHead>RSVP</TableHead>
            <TableHead>Dietary</TableHead>
            <TableHead className="w-16">In</TableHead>
            <TableHead className="w-24">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {guests.map((guest) => (
            <TableRow key={guest.id}>
              <TableCell className="font-medium">{guest.guestName}</TableCell>
              <TableCell className="text-muted-foreground">
                {guest.guestEmail || "—"}
              </TableCell>
              <TableCell>
                <Select
                  value={guest.tier}
                  onValueChange={(v) => handleTierChange(guest.id, v)}
                >
                  <SelectTrigger className="h-7 w-28 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {GUEST_TIERS.map((t) => (
                      <SelectItem key={t} value={t}>
                        <Badge
                          variant="outline"
                          className={`${TIER_COLORS[t]} text-xs`}
                        >
                          {t.toUpperCase()}
                        </Badge>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>
                {editingTable === guest.id ? (
                  <Input
                    type="number"
                    className="h-7 w-16 text-xs"
                    value={tableValue}
                    onChange={(e) => setTableValue(e.target.value)}
                    onBlur={() => handleTableSave(guest.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleTableSave(guest.id)
                      if (e.key === "Escape") setEditingTable(null)
                    }}
                    autoFocus
                  />
                ) : (
                  <button
                    className="h-7 w-16 rounded border border-dashed border-muted-foreground/30 text-center text-xs hover:border-muted-foreground/60"
                    onClick={() => {
                      setEditingTable(guest.id)
                      setTableValue(guest.tableNumber?.toString() ?? "")
                    }}
                  >
                    {guest.tableNumber || "—"}
                  </button>
                )}
              </TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={`${RSVP_COLORS[guest.rsvpStatus]} text-xs`}
                >
                  {guest.rsvpStatus.charAt(0).toUpperCase() +
                    guest.rsvpStatus.slice(1)}
                </Badge>
              </TableCell>
              <TableCell className="text-xs text-muted-foreground">
                {guest.dietaryRequirements || "—"}
              </TableCell>
              <TableCell>
                {guest.checkedIn ? (
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                ) : (
                  <Circle className="h-5 w-5 text-muted-foreground/30" />
                )}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger
                        render={
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => copyRsvpLink(guest.rsvpToken)}
                          />
                        }
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </TooltipTrigger>
                      <TooltipContent>Copy RSVP link</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-red-600 hover:text-red-700"
                    onClick={() => handleRemove(guest.id)}
                    disabled={removingId === guest.id}
                  >
                    {removingId === guest.id ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="h-3.5 w-3.5" />
                    )}
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
