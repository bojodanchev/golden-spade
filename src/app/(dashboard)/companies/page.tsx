import { Suspense } from "react"
import Link from "next/link"
import { Building2, Plus, CheckCircle, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { PageHeader } from "@/components/shared/page-header"
import { EmptyState } from "@/components/shared/empty-state"
import { getCompanies } from "@/actions/companies"
import { COMPANY_TYPE_CONFIGS, type CompanyTypeKey } from "@/lib/constants"
import { CompaniesFilters } from "@/components/companies/companies-filters"

interface CompaniesPageProps {
  searchParams: Promise<{
    search?: string
    type?: string
    region?: string
    isMember?: string
    page?: string
  }>
}

const regionLabels: Record<string, string> = {
  bulgaria: "Bulgaria",
  balkans: "Balkans",
  europe: "Europe",
  global: "Global",
}

const sizeLabels: Record<string, string> = {
  small: "Small",
  medium: "Medium",
  large: "Large",
  enterprise: "Enterprise",
}

export default async function CompaniesPage({ searchParams }: CompaniesPageProps) {
  const params = await searchParams
  const page = Number(params.page) || 1

  const { companies, total, totalPages } = await getCompanies({
    search: params.search,
    type: params.type,
    region: params.region,
    isMember: params.isMember,
    page,
  })

  const hasFilters = params.search || params.type || params.region || params.isMember

  return (
    <div className="space-y-6">
      <PageHeader title="Companies" description={`${total} companies`}>
        <Button
          className="bg-brand-primary hover:bg-brand-primary-light"
          render={<Link href="/dashboard/companies/new" />}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Company
        </Button>
      </PageHeader>

      {/* Filters */}
      <Suspense>
        <CompaniesFilters
          search={params.search}
          type={params.type}
          region={params.region}
          isMember={params.isMember}
        />
      </Suspense>

      {/* Table */}
      {companies.length === 0 ? (
        <EmptyState
          icon={Building2}
          title={hasFilters ? "No companies found" : "No companies yet"}
          description={
            hasFilters
              ? "Try adjusting your filters to find what you're looking for."
              : "Get started by adding your first company to the CRM."
          }
        />
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Region</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Member</TableHead>
                <TableHead>Contacts</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {companies.map((company) => {
                const typeConfig =
                  COMPANY_TYPE_CONFIGS[company.type as CompanyTypeKey]

                return (
                  <TableRow key={company.id}>
                    <TableCell>
                      <Link
                        href={`/dashboard/companies/${company.id}`}
                        className="font-medium text-brand-primary hover:underline"
                      >
                        {company.name}
                      </Link>
                    </TableCell>
                    <TableCell>
                      {typeConfig ? (
                        <Badge
                          className={`${typeConfig.bgColor} ${typeConfig.textColor}`}
                        >
                          {typeConfig.label}
                        </Badge>
                      ) : (
                        <Badge variant="secondary">{company.type}</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {regionLabels[company.region] ?? company.region}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {company.size
                        ? sizeLabels[company.size] ?? company.size
                        : "-"}
                    </TableCell>
                    <TableCell>
                      {company.isMember ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-gray-400" />
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {(company as Record<string, unknown>)._count
                        ? ((company as Record<string, unknown>)._count as Record<string, number>).contacts
                        : 0}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Page {page} of {totalPages} ({total} total)
              </p>
              <div className="flex gap-2">
                {page > 1 && (
                  <Button
                    variant="outline"
                    size="sm"
                    render={
                      <Link
                        href={{
                          pathname: "/dashboard/companies",
                          query: { ...params, page: String(page - 1) },
                        }}
                      />
                    }
                  >
                    Previous
                  </Button>
                )}
                {page < totalPages && (
                  <Button
                    variant="outline"
                    size="sm"
                    render={
                      <Link
                        href={{
                          pathname: "/dashboard/companies",
                          query: { ...params, page: String(page + 1) },
                        }}
                      />
                    }
                  >
                    Next
                  </Button>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
