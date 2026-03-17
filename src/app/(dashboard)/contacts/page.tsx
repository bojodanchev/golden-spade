import Link from "next/link"
import { getContacts } from "@/actions/contacts"
import { PageHeader } from "@/components/shared/page-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Plus, Users } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { ContactsFilters } from "@/components/contacts/contacts-filters"
import { EmptyState } from "@/components/shared/empty-state"

const categoryColors: Record<string, string> = {
  sponsor: "bg-amber-100 text-amber-800",
  partner: "bg-blue-100 text-blue-800",
  member: "bg-green-100 text-green-800",
  media: "bg-purple-100 text-purple-800",
  vip: "bg-rose-100 text-rose-800",
  speaker: "bg-indigo-100 text-indigo-800",
  government: "bg-slate-100 text-slate-800",
  other: "bg-gray-100 text-gray-800",
}

const tierColors: Record<string, string> = {
  cold: "bg-gray-100 text-gray-700",
  warm: "bg-yellow-100 text-yellow-800",
  hot: "bg-orange-100 text-orange-800",
  qualified: "bg-green-100 text-green-800",
}

export default async function ContactsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = await searchParams
  const search = typeof params.search === "string" ? params.search : undefined
  const category = typeof params.category === "string" ? params.category : undefined
  const leadTier = typeof params.leadTier === "string" ? params.leadTier : undefined
  const page = typeof params.page === "string" ? parseInt(params.page, 10) : 1

  const { contacts, total, totalPages } = await getContacts({
    search,
    category,
    leadTier,
    page,
    pageSize: 20,
  })

  return (
    <div className="space-y-6">
      <PageHeader title="Contacts" description={`${total} contact${total !== 1 ? "s" : ""}`}>
        <Button
          className="bg-brand-primary hover:bg-brand-primary-light"
          render={<Link href="/dashboard/contacts/new" />}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Contact
        </Button>
      </PageHeader>

      <ContactsFilters
        search={search || ""}
        category={category || "all"}
        leadTier={leadTier || "all"}
      />

      {contacts.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No contacts found"
          description={
            search || category || leadTier
              ? "Try adjusting your filters to find what you're looking for."
              : "Get started by adding your first contact."
          }
        />
      ) : (
        <>
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden sm:table-cell">Email</TableHead>
                  <TableHead className="hidden md:table-cell">Company</TableHead>
                  <TableHead className="hidden lg:table-cell">Category</TableHead>
                  <TableHead className="hidden lg:table-cell">Lead Tier</TableHead>
                  <TableHead className="hidden xl:table-cell">Next Follow-up</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contacts.map((contact) => (
                  <TableRow key={contact.id}>
                    <TableCell>
                      <Link
                        href={`/dashboard/contacts/${contact.id}`}
                        className="font-medium text-brand-primary hover:underline"
                      >
                        {contact.firstName} {contact.lastName}
                      </Link>
                      {contact.title && (
                        <p className="text-xs text-muted-foreground">{contact.title}</p>
                      )}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {contact.email || <span className="text-muted-foreground">&mdash;</span>}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {contact.company ? (
                        <Link
                          href={`/dashboard/companies/${contact.company.id}`}
                          className="hover:underline"
                        >
                          {contact.company.name}
                        </Link>
                      ) : (
                        <span className="text-muted-foreground">&mdash;</span>
                      )}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <Badge
                        variant="secondary"
                        className={categoryColors[contact.category] || categoryColors.other}
                      >
                        {contact.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <Badge
                        variant="secondary"
                        className={tierColors[contact.leadTier] || tierColors.cold}
                      >
                        {contact.leadTier}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden xl:table-cell">
                      {contact.nextFollowUpAt ? (
                        formatDate(contact.nextFollowUpAt)
                      ) : (
                        <span className="text-muted-foreground">&mdash;</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </p>
              <div className="flex gap-2">
                {page > 1 && (
                  <Button
                    variant="outline"
                    size="sm"
                    render={
                      <Link
                        href={{
                          pathname: "/dashboard/contacts",
                          query: {
                            ...(search && { search }),
                            ...(category && { category }),
                            ...(leadTier && { leadTier }),
                            page: page - 1,
                          },
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
                          pathname: "/dashboard/contacts",
                          query: {
                            ...(search && { search }),
                            ...(category && { category }),
                            ...(leadTier && { leadTier }),
                            page: page + 1,
                          },
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
