"use client"

import { Suspense, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { PageHeader } from "@/components/shared/page-header"
import { ContactForm } from "@/components/contacts/contact-form"
import { createContact, updateContact, getContact, getCompaniesForSelect } from "@/actions/contacts"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"

function NewContactContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const isEdit = searchParams.get("edit") === "true"
  const editId = searchParams.get("id")

  const [companies, setCompanies] = useState<{ id: string; name: string }[]>([])
  const [initialData, setInitialData] = useState<Record<string, string> | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [companiesList, contactData] = await Promise.all([
        getCompaniesForSelect(),
        isEdit && editId ? getContact(editId) : null,
      ])
      setCompanies(companiesList)
      if (contactData) {
        setInitialData({
          firstName: contactData.firstName,
          lastName: contactData.lastName,
          email: contactData.email || "",
          phone: contactData.phone || "",
          linkedinUrl: contactData.linkedinUrl || "",
          title: contactData.title || "",
          companyId: contactData.companyId || "",
          category: contactData.category,
          notes: "", // notes field not on Contact model directly but included in form
        })
      }
      setLoading(false)
    }
    load()
  }, [isEdit, editId])

  async function handleSubmit(data: {
    firstName: string
    lastName: string
    email: string
    phone: string
    linkedinUrl: string
    title: string
    companyId: string
    category: string
    notes: string
  }) {
    try {
      if (isEdit && editId) {
        await updateContact(editId, {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email || null,
          phone: data.phone || null,
          linkedinUrl: data.linkedinUrl || null,
          title: data.title || null,
          companyId: data.companyId || null,
          category: data.category,
        })
        toast.success("Contact updated")
        router.push(`/dashboard/contacts/${editId}`)
      } else {
        const contact = await createContact({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email || null,
          phone: data.phone || null,
          linkedinUrl: data.linkedinUrl || null,
          title: data.title || null,
          companyId: data.companyId || null,
          category: data.category,
        })
        toast.success("Contact created")
        router.push(`/dashboard/contacts/${contact.id}`)
      }
    } catch {
      toast.error(isEdit ? "Failed to update contact" : "Failed to create contact")
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PageHeader
        title={isEdit ? "Edit Contact" : "New Contact"}
        description={isEdit ? "Update contact information" : "Add a new contact to your CRM"}
      />
      <ContactForm
        initialData={initialData || undefined}
        companies={companies}
        onSubmit={handleSubmit}
        submitLabel={isEdit ? "Save Changes" : "Create Contact"}
      />
    </div>
  )
}

function NewContactFallback() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-10 w-64" />
      <Skeleton className="h-64 w-full" />
      <Skeleton className="h-48 w-full" />
    </div>
  )
}

export default function NewContactPage() {
  return (
    <Suspense fallback={<NewContactFallback />}>
      <NewContactContent />
    </Suspense>
  )
}
