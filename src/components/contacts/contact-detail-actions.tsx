"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import { InteractionForm } from "@/components/contacts/interaction-form"
import { deleteContact } from "@/actions/contacts"
import { toast } from "sonner"
import { Trash2, Plus } from "lucide-react"

interface ContactDetailActionsProps {
  contactId: string
  showInteractionButton?: boolean
}

export function ContactDetailActions({
  contactId,
  showInteractionButton,
}: ContactDetailActionsProps) {
  const router = useRouter()
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [interactionOpen, setInteractionOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  async function handleDelete() {
    setDeleting(true)
    try {
      await deleteContact(contactId)
      toast.success("Contact deleted")
      router.push("/dashboard/contacts")
    } catch {
      toast.error("Failed to delete contact")
      setDeleting(false)
    }
  }

  return (
    <>
      {showInteractionButton ? (
        <div className="flex justify-end">
          <Button
            onClick={() => setInteractionOpen(true)}
            className="bg-brand-primary hover:bg-brand-primary-light"
          >
            <Plus className="mr-2 h-4 w-4" />
            Log Interaction
          </Button>
        </div>
      ) : (
        <Button
          variant="outline"
          className="text-red-600 hover:bg-red-50 hover:text-red-700"
          onClick={() => setDeleteOpen(true)}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </Button>
      )}

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete Contact"
        description="Are you sure you want to delete this contact? This action cannot be undone. All associated interactions, follow-ups, and tags will also be removed."
        confirmLabel="Delete"
        onConfirm={handleDelete}
        variant="destructive"
        loading={deleting}
      />

      <InteractionForm
        contactId={contactId}
        open={interactionOpen}
        onOpenChange={setInteractionOpen}
      />
    </>
  )
}
