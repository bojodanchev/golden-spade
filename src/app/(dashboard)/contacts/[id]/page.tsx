import { notFound } from "next/navigation"
import Link from "next/link"
import { getContact } from "@/actions/contacts"
import { PageHeader } from "@/components/shared/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Mail,
  Phone,
  Linkedin,
  Building2,
  Edit,
  Tag,
} from "lucide-react"
import { formatCurrency, formatDate } from "@/lib/utils"
import { InteractionTimeline } from "@/components/contacts/interaction-timeline"
import { ContactDetailActions } from "@/components/contacts/contact-detail-actions"

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

const stageColors: Record<string, string> = {
  initial_contact: "bg-gray-100 text-gray-700",
  discovery: "bg-blue-100 text-blue-700",
  proposal: "bg-purple-100 text-purple-700",
  negotiation: "bg-amber-100 text-amber-700",
  closed_won: "bg-green-100 text-green-700",
  closed_lost: "bg-red-100 text-red-700",
}

export default async function ContactDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const contact = await getContact(id)

  if (!contact) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={`${contact.firstName} ${contact.lastName}`}
        description={contact.title || undefined}
      >
        <Button
          variant="outline"
          render={<Link href={`/dashboard/contacts/new?edit=true&id=${contact.id}`} />}
        >
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </Button>
        <ContactDetailActions contactId={contact.id} />
      </PageHeader>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="interactions">
            Interactions ({contact.interactions.length})
          </TabsTrigger>
          <TabsTrigger value="deals">
            Deals ({contact.deals.length})
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            {/* Contact Info Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {contact.email && (
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <a
                      href={`mailto:${contact.email}`}
                      className="text-brand-primary hover:underline"
                    >
                      {contact.email}
                    </a>
                  </div>
                )}
                {contact.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <a
                      href={`tel:${contact.phone}`}
                      className="hover:underline"
                    >
                      {contact.phone}
                    </a>
                  </div>
                )}
                {contact.linkedinUrl && (
                  <div className="flex items-center gap-2 text-sm">
                    <Linkedin className="h-4 w-4 text-muted-foreground" />
                    <a
                      href={contact.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-primary hover:underline"
                    >
                      LinkedIn Profile
                    </a>
                  </div>
                )}
                <div className="flex flex-wrap gap-2 pt-2">
                  <Badge
                    variant="secondary"
                    className={categoryColors[contact.category] || categoryColors.other}
                  >
                    {contact.category}
                  </Badge>
                  <Badge
                    variant="secondary"
                    className={tierColors[contact.leadTier] || tierColors.cold}
                  >
                    {contact.leadTier}
                  </Badge>
                </div>
                <div className="pt-1 text-sm text-muted-foreground">
                  Lead Score: <span className="font-semibold text-foreground">{contact.leadScore}</span>
                </div>
                {contact.nextFollowUpAt && (
                  <div className="text-sm text-muted-foreground">
                    Next Follow-up:{" "}
                    <span className="font-medium text-foreground">
                      {formatDate(contact.nextFollowUpAt)}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Company Card */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Company</CardTitle>
                </CardHeader>
                <CardContent>
                  {contact.company ? (
                    <Link
                      href={`/dashboard/companies/${contact.company.id}`}
                      className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-primary/10">
                        <Building2 className="h-5 w-5 text-brand-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{contact.company.name}</p>
                        <p className="text-xs text-muted-foreground capitalize">
                          {contact.company.type.replace(/_/g, " ")}
                        </p>
                      </div>
                    </Link>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No company associated
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Tags Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Tags</CardTitle>
                </CardHeader>
                <CardContent>
                  {contact.tags.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {contact.tags.map((ct) => (
                        <Badge
                          key={ct.tagId}
                          variant="outline"
                          className="gap-1"
                          style={{ borderColor: ct.tag.color, color: ct.tag.color }}
                        >
                          <Tag className="h-3 w-3" />
                          {ct.tag.name}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No tags</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Interactions Tab */}
        <TabsContent value="interactions" className="space-y-4">
          <ContactDetailActions contactId={contact.id} showInteractionButton />
          <InteractionTimeline interactions={contact.interactions} />
        </TabsContent>

        {/* Deals Tab */}
        <TabsContent value="deals" className="space-y-4">
          {contact.deals.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-sm text-muted-foreground">
                No deals associated with this contact.
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {contact.deals.map((deal) => (
                <Card key={deal.id}>
                  <CardContent className="pt-6">
                    <h3 className="font-medium">{deal.title}</h3>
                    {deal.company && (
                      <p className="mt-0.5 text-sm text-muted-foreground">
                        {deal.company.name}
                      </p>
                    )}
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <Badge
                        variant="secondary"
                        className={stageColors[deal.stage] || stageColors.initial_contact}
                      >
                        {deal.stage.replace(/_/g, " ")}
                      </Badge>
                      {deal.valueEur != null && (
                        <span className="text-sm font-semibold">
                          {formatCurrency(deal.valueEur)}
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
