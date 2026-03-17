"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import { DealForm } from "@/components/pipeline/deal-form"
import { deleteDeal } from "@/actions/deals"
import type { Deal } from "@/types/crm"
import { toast } from "sonner"

interface DealDetailActionsProps {
  deal: Deal
}

export function DealDetailActions({ deal }: DealDetailActionsProps) {
  const router = useRouter()
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  async function handleDelete() {
    setDeleting(true)
    try {
      await deleteDeal(deal.id)
      toast.success("Deal deleted")
      router.push("/dashboard/pipeline")
    } catch {
      toast.error("Failed to delete deal")
    } finally {
      setDeleting(false)
      setDeleteOpen(false)
    }
  }

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setEditOpen(true)}>
        <Pencil className="mr-2 h-4 w-4" />
        Edit
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="text-red-600 hover:text-red-700"
        onClick={() => setDeleteOpen(true)}
      >
        <Trash2 className="mr-2 h-4 w-4" />
        Delete
      </Button>

      <DealForm
        open={editOpen}
        onOpenChange={setEditOpen}
        deal={deal}
        onSuccess={() => router.refresh()}
      />

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete Deal"
        description={`Are you sure you want to delete "${deal.title}"? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        variant="destructive"
        loading={deleting}
      />
    </>
  )
}
