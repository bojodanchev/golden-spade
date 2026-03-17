"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import { deleteCompany } from "@/actions/companies"

interface CompanyDeleteButtonProps {
  companyId: string
  companyName: string
}

export function CompanyDeleteButton({
  companyId,
  companyName,
}: CompanyDeleteButtonProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    setLoading(true)
    try {
      await deleteCompany(companyId)
      toast.success("Company deleted successfully")
      router.push("/dashboard/companies")
    } catch {
      toast.error("Failed to delete company")
    } finally {
      setLoading(false)
      setOpen(false)
    }
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
        className="text-red-600 hover:text-red-600"
      >
        <Trash2 className="mr-2 h-4 w-4" />
        Delete
      </Button>

      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title="Delete Company"
        description={`Are you sure you want to delete "${companyName}"? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        variant="destructive"
        loading={loading}
      />
    </>
  )
}
