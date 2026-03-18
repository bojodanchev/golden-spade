export const dynamic = "force-dynamic"

import { PageHeader } from "@/components/shared/page-header"
import { CompanyForm } from "@/components/companies/company-form"
import { getCompany } from "@/actions/companies"

interface NewCompanyPageProps {
  searchParams: Promise<{ edit?: string }>
}

export default async function NewCompanyPage({
  searchParams,
}: NewCompanyPageProps) {
  const params = await searchParams
  const editId = params.edit

  let initialData: {
    id: string
    name: string
    type: string
    website: string | null
    linkedinUrl: string | null
    country: string | null
    region: string
    size: string | null
    isMember: boolean
    notes: string | null
  } | undefined

  if (editId) {
    const company = await getCompany(editId)
    if (company) {
      initialData = {
        id: company.id,
        name: company.name,
        type: company.type,
        website: company.website,
        linkedinUrl: company.linkedinUrl,
        country: company.country,
        region: company.region,
        size: company.size,
        isMember: company.isMember,
        notes: company.notes,
      }
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PageHeader
        title={initialData ? "Edit Company" : "New Company"}
        description={
          initialData
            ? "Update the company details below."
            : "Add a new company to your CRM."
        }
      />
      <CompanyForm initialData={initialData} />
    </div>
  )
}
