import Link from "next/link"
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
import { Plus, Mail } from "lucide-react"
import type { Contact } from "@/types/crm"

const categoryColors: Record<string, string> = {
  sponsor: "bg-yellow-100 text-yellow-800",
  partner: "bg-blue-100 text-blue-800",
  member: "bg-green-100 text-green-800",
  media: "bg-red-100 text-red-800",
  vip: "bg-purple-100 text-purple-800",
  speaker: "bg-orange-100 text-orange-800",
  government: "bg-gray-100 text-gray-800",
  other: "bg-gray-100 text-gray-700",
}

interface CompanyContactsProps {
  contacts: Contact[]
  companyId: string
}

export function CompanyContacts({ contacts, companyId }: CompanyContactsProps) {
  if (contacts.length === 0) {
    return (
      <div className="flex flex-col items-center py-8 text-center">
        <p className="text-sm text-muted-foreground">
          No contacts linked to this company yet.
        </p>
        <Button
          className="mt-4 bg-brand-primary hover:bg-brand-primary-light"
          render={
            <Link
              href={`/dashboard/contacts/new?companyId=${companyId}`}
            />
          }
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Contact
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          size="sm"
          className="bg-brand-primary hover:bg-brand-primary-light"
          render={
            <Link
              href={`/dashboard/contacts/new?companyId=${companyId}`}
            />
          }
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Contact
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Category</TableHead>
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
              </TableCell>
              <TableCell className="text-muted-foreground">
                {contact.title || "-"}
              </TableCell>
              <TableCell>
                {contact.email ? (
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <Mail className="h-3.5 w-3.5" />
                    {contact.email}
                  </span>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </TableCell>
              <TableCell>
                <Badge
                  className={
                    categoryColors[contact.category] ?? categoryColors.other
                  }
                >
                  {contact.category}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
