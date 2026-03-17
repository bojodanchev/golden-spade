"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import { deleteEvent } from "@/actions/events"
import { Trash2 } from "lucide-react"
import { toast } from "sonner"

interface EventDeleteButtonProps {
  eventId: string
  eventName: string
}

export function EventDeleteButton({
  eventId,
  eventName,
}: EventDeleteButtonProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    setLoading(true)
    try {
      await deleteEvent(eventId)
      toast.success("Event deleted")
      router.push("/dashboard/events")
    } catch {
      toast.error("Failed to delete event")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="text-red-600 hover:text-red-700"
        onClick={() => setOpen(true)}
      >
        <Trash2 className="mr-2 h-3.5 w-3.5" />
        Delete
      </Button>
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title="Delete Event"
        description={`Are you sure you want to delete "${eventName}"? This will remove all guests, sponsors, and follow-ups. This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        variant="destructive"
        loading={loading}
      />
    </>
  )
}
