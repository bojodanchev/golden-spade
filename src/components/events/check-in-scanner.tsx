"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { checkInGuest } from "@/actions/guests"
import type { EventGuest } from "@/types/events"
import { CheckCircle2, Search, UserCheck, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface CheckInScannerProps {
  guests: EventGuest[]
  onRefresh: () => void
}

export function CheckInScanner({ guests, onRefresh }: CheckInScannerProps) {
  const [search, setSearch] = useState("")
  const [checkingIn, setCheckingIn] = useState<string | null>(null)
  const [justCheckedIn, setJustCheckedIn] = useState<string | null>(null)

  const confirmedGuests = guests.filter((g) => g.rsvpStatus === "confirmed")
  const checkedInCount = confirmedGuests.filter((g) => g.checkedIn).length

  const filtered = confirmedGuests.filter((g) =>
    g.guestName.toLowerCase().includes(search.toLowerCase())
  )

  const handleCheckIn = useCallback(
    async (guestId: string) => {
      setCheckingIn(guestId)
      try {
        await checkInGuest(guestId)
        setJustCheckedIn(guestId)
        toast.success("Guest checked in!")
        setTimeout(() => setJustCheckedIn(null), 2000)
        onRefresh()
      } catch {
        toast.error("Check-in failed")
      } finally {
        setCheckingIn(null)
      }
    },
    [onRefresh]
  )

  return (
    <div className="space-y-6">
      {/* Counter */}
      <Card>
        <CardContent className="flex items-center justify-between p-6">
          <div>
            <p className="text-sm text-muted-foreground">Checked In</p>
            <p className="font-heading text-4xl font-bold text-brand-primary">
              {checkedInCount}{" "}
              <span className="text-lg text-muted-foreground">
                / {confirmedGuests.length}
              </span>
            </p>
          </div>
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-primary/10">
            <UserCheck className="h-8 w-8 text-brand-primary" />
          </div>
        </CardContent>
      </Card>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search guest by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-14 pl-12 text-lg"
        />
      </div>

      {/* Guest list */}
      <div className="space-y-2">
        {filtered.map((guest) => {
          const isJustChecked = justCheckedIn === guest.id

          return (
            <Card
              key={guest.id}
              className={
                isJustChecked
                  ? "border-green-400 bg-green-50 transition-colors"
                  : guest.checkedIn
                    ? "border-green-200 bg-green-50/50"
                    : ""
              }
            >
              <CardContent className="flex items-center justify-between p-4">
                <div className="min-w-0 flex-1">
                  <p className="text-lg font-medium">{guest.guestName}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {guest.tier.toUpperCase()}
                    </Badge>
                    {guest.tableNumber && (
                      <span className="text-xs text-muted-foreground">
                        Table {guest.tableNumber}
                      </span>
                    )}
                    {guest.dietaryRequirements && (
                      <span className="text-xs text-amber-600">
                        {guest.dietaryRequirements}
                      </span>
                    )}
                  </div>
                </div>

                {guest.checkedIn ? (
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle2
                      className={`h-8 w-8 ${isJustChecked ? "animate-bounce" : ""}`}
                    />
                    <span className="text-sm font-medium">Checked In</span>
                  </div>
                ) : (
                  <Button
                    size="lg"
                    className="h-14 min-w-[140px] bg-brand-primary text-lg hover:bg-brand-primary-light"
                    onClick={() => handleCheckIn(guest.id)}
                    disabled={checkingIn === guest.id}
                  >
                    {checkingIn === guest.id ? (
                      <Loader2 className="h-6 w-6 animate-spin" />
                    ) : (
                      "Check In"
                    )}
                  </Button>
                )}
              </CardContent>
            </Card>
          )
        })}

        {filtered.length === 0 && (
          <div className="py-12 text-center text-muted-foreground">
            {search
              ? "No guests found matching your search"
              : "No confirmed guests to check in"}
          </div>
        )}
      </div>
    </div>
  )
}
