"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { getRSVPByToken, submitRSVP } from "@/actions/guests"
import type { RsvpFormData } from "@/types/events"
import {
  Calendar,
  MapPin,
  Shirt,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Loader2,
  Spade,
} from "lucide-react"

type RsvpGuest = Awaited<ReturnType<typeof getRSVPByToken>>

function formatEventDate(date: Date | string | null): string {
  if (!date) return ""
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date))
}

export default function RSVPPage() {
  const params = useParams<{ token: string }>()
  const token = params.token

  const [guest, setGuest] = useState<RsvpGuest>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState<
    "confirmed" | "declined" | "tentative" | null
  >(null)

  // Confirm-specific fields
  const [dietary, setDietary] = useState("")
  const [plusOne, setPlusOne] = useState(false)
  const [plusOneName, setPlusOneName] = useState("")

  useEffect(() => {
    async function load() {
      try {
        const data = await getRSVPByToken(token)
        setGuest(data)
        if (data?.rsvpStatus && data.rsvpStatus !== "pending") {
          setSelectedStatus(
            data.rsvpStatus as "confirmed" | "declined" | "tentative"
          )
          setDietary(data.dietaryRequirements || "")
          setPlusOne(data.plusOne)
          setPlusOneName(data.plusOneName || "")
        }
      } catch {
        // token invalid
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [token])

  async function handleSubmit() {
    if (!selectedStatus) return

    setSubmitting(true)
    try {
      const data: RsvpFormData = {
        rsvpStatus: selectedStatus,
        dietaryRequirements: dietary || undefined,
        plusOne,
        plusOneName: plusOneName || undefined,
      }
      await submitRSVP(token, data)
      setSubmitted(true)
    } catch {
      // handle error
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#1a365d] to-[#2d4a7a]">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </div>
    )
  }

  if (!guest) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#1a365d] to-[#2d4a7a] p-4 text-center">
        <Spade className="h-12 w-12 text-[#d69e2e]" />
        <h1 className="mt-4 text-2xl font-bold text-white">
          Invalid Invitation
        </h1>
        <p className="mt-2 text-white/70">
          This RSVP link is not valid or has expired.
        </p>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#1a365d] to-[#2d4a7a] p-4 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/10">
          {selectedStatus === "confirmed" ? (
            <CheckCircle2 className="h-10 w-10 text-green-400" />
          ) : selectedStatus === "declined" ? (
            <XCircle className="h-10 w-10 text-red-400" />
          ) : (
            <HelpCircle className="h-10 w-10 text-amber-400" />
          )}
        </div>
        <h1 className="mt-6 text-2xl font-bold text-white">Thank You!</h1>
        <p className="mt-2 text-lg text-white/80">
          {selectedStatus === "confirmed"
            ? "We look forward to seeing you!"
            : selectedStatus === "declined"
              ? "Sorry you can't make it."
              : "We'll keep you updated."}
        </p>
        <p className="mt-4 text-sm text-white/50">
          Your response has been recorded for {guest.event.name}
        </p>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center bg-gradient-to-b from-[#1a365d] to-[#2d4a7a] p-4 pt-12 sm:pt-20">
      {/* Logo */}
      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#d69e2e]">
        <Spade className="h-7 w-7 text-[#1a365d]" />
      </div>

      <h1 className="mt-4 text-center text-2xl font-bold text-white sm:text-3xl">
        {guest.event.name}
      </h1>

      {/* Event details */}
      <div className="mt-4 flex flex-wrap justify-center gap-4 text-sm text-white/70">
        {guest.event.startsAt && (
          <span className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            {formatEventDate(guest.event.startsAt)}
          </span>
        )}
        {guest.event.venue && (
          <span className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4" />
            {guest.event.venue}
          </span>
        )}
        {guest.event.dressCode && (
          <span className="flex items-center gap-1.5">
            <Shirt className="h-4 w-4" />
            {guest.event.dressCode}
          </span>
        )}
      </div>

      {/* RSVP Card */}
      <Card className="mt-8 w-full max-w-md">
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">
            You are invited,
          </p>
          <p className="mt-1 text-center text-xl font-bold text-[#1a365d]">
            {guest.guestName}
          </p>

          {/* Status buttons */}
          <div className="mt-6 grid grid-cols-3 gap-2">
            <Button
              variant={selectedStatus === "confirmed" ? "default" : "outline"}
              className={
                selectedStatus === "confirmed"
                  ? "bg-green-600 hover:bg-green-700"
                  : "border-green-200 text-green-700 hover:bg-green-50"
              }
              onClick={() => setSelectedStatus("confirmed")}
            >
              <CheckCircle2 className="mr-1.5 h-4 w-4" />
              Accept
            </Button>
            <Button
              variant={selectedStatus === "declined" ? "default" : "outline"}
              className={
                selectedStatus === "declined"
                  ? "bg-red-600 hover:bg-red-700"
                  : "border-red-200 text-red-700 hover:bg-red-50"
              }
              onClick={() => setSelectedStatus("declined")}
            >
              <XCircle className="mr-1.5 h-4 w-4" />
              Decline
            </Button>
            <Button
              variant={selectedStatus === "tentative" ? "default" : "outline"}
              className={
                selectedStatus === "tentative"
                  ? "bg-amber-500 hover:bg-amber-600"
                  : "border-amber-200 text-amber-700 hover:bg-amber-50"
              }
              onClick={() => setSelectedStatus("tentative")}
            >
              <HelpCircle className="mr-1.5 h-4 w-4" />
              Maybe
            </Button>
          </div>

          {/* Confirm details */}
          {selectedStatus === "confirmed" && (
            <div className="mt-6 space-y-4 border-t pt-4">
              <div className="space-y-2">
                <Label htmlFor="dietary">
                  Dietary Requirements
                </Label>
                <Input
                  id="dietary"
                  value={dietary}
                  onChange={(e) => setDietary(e.target.value)}
                  placeholder="e.g., Vegetarian, Gluten-free"
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="plusOne">Bringing a plus one?</Label>
                <Switch
                  id="plusOne"
                  checked={plusOne}
                  onCheckedChange={setPlusOne}
                />
              </div>

              {plusOne && (
                <div className="space-y-2">
                  <Label htmlFor="plusOneName">
                    Plus One Name
                  </Label>
                  <Input
                    id="plusOneName"
                    value={plusOneName}
                    onChange={(e) => setPlusOneName(e.target.value)}
                    placeholder="Guest name"
                  />
                </div>
              )}
            </div>
          )}

          {/* Submit */}
          {selectedStatus && (
            <Button
              className="mt-6 w-full bg-[#1a365d] text-white hover:bg-[#2d4a7a]"
              size="lg"
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Submit Response
            </Button>
          )}
        </CardContent>
      </Card>

      <p className="mt-6 text-xs text-white/30">
        Golden Spades Event Management
      </p>
    </div>
  )
}
