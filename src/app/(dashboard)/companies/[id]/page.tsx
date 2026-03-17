import Link from "next/link"
import { notFound } from "next/navigation"
import {
  Globe,
  Linkedin,
  MapPin,
  CheckCircle,
  XCircle,
  Pencil,
  ExternalLink,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { PageHeader } from "@/components/shared/page-header"
import { CompanyContacts } from "@/components/companies/company-contacts"
import { CompanyDeleteButton } from "@/components/companies/company-delete-button"
import { getCompany } from "@/actions/companies"
import { COMPANY_TYPE_CONFIGS, type CompanyTypeKey } from "@/lib/constants"
import { formatCurrency } from "@/lib/utils"

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

const stageLabels: Record<string, string> = {
  initial_contact: "Initial Contact",
  discovery: "Discovery",
  proposal: "Proposal",
  negotiation: "Negotiation",
  closed_won: "Closed Won",
  closed_lost: "Closed Lost",
}

const stageColors: Record<string, string> = {
  initial_contact: "bg-gray-100 text-gray-700",
  discovery: "bg-blue-100 text-blue-700",
  proposal: "bg-orange-100 text-orange-700",
  negotiation: "bg-purple-100 text-purple-700",
  closed_won: "bg-green-100 text-green-700",
  closed_lost: "bg-red-100 text-red-700",
}

interface CompanyDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function CompanyDetailPage({
  params,
}: CompanyDetailPageProps) {
  const { id } = await params
  const company = await getCompany(id)

  if (!company) {
    notFound()
  }

  const typeConfig = COMPANY_TYPE_CONFIGS[company.type as CompanyTypeKey]

  return (
    <div className="space-y-6">
      <PageHeader title={company.name}>
        <Button
          variant="outline"
          size="sm"
          render={<Link href={`/dashboard/companies/new?edit=${company.id}`} />}
        >
          <Pencil className="mr-2 h-4 w-4" />
          Edit
        </Button>
        <CompanyDeleteButton companyId={company.id} companyName={company.name} />
      </PageHeader>

      {/* Info Card */}
      <Card>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Type */}
          <div>
            <p className="text-xs font-medium text-muted-foreground">Type</p>
            <div className="mt-1">
              {typeConfig ? (
                <Badge
                  className={`${typeConfig.bgColor} ${typeConfig.textColor}`}
                >
                  {typeConfig.label}
                </Badge>
              ) : (
                <Badge variant="secondary">{company.type}</Badge>
              )}
            </div>
          </div>

          {/* Region */}
          <div>
            <p className="text-xs font-medium text-muted-foreground">Region</p>
            <p className="mt-1 flex items-center gap-1.5 text-sm">
              <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
              {regionLabels[company.region] ?? company.region}
              {company.country && (
                <span className="text-muted-foreground">
                  ({company.country})
                </span>
              )}
            </p>
          </div>

          {/* Size */}
          <div>
            <p className="text-xs font-medium text-muted-foreground">Size</p>
            <p className="mt-1 text-sm">
              {company.size
                ? sizeLabels[company.size] ?? company.size
                : "Not specified"}
            </p>
          </div>

          {/* Member status */}
          <div>
            <p className="text-xs font-medium text-muted-foreground">
              Member Status
            </p>
            <p className="mt-1 flex items-center gap-1.5 text-sm">
              {company.isMember ? (
                <>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Active Member
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4 text-gray-400" />
                  Not a Member
                </>
              )}
            </p>
          </div>

          {/* Website */}
          <div>
            <p className="text-xs font-medium text-muted-foreground">Website</p>
            {company.website ? (
              <a
                href={company.website}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 flex items-center gap-1.5 text-sm text-brand-primary hover:underline"
              >
                <Globe className="h-3.5 w-3.5" />
                {company.website.replace(/^https?:\/\//, "")}
                <ExternalLink className="h-3 w-3" />
              </a>
            ) : (
              <p className="mt-1 text-sm text-muted-foreground">-</p>
            )}
          </div>

          {/* LinkedIn */}
          <div>
            <p className="text-xs font-medium text-muted-foreground">
              LinkedIn
            </p>
            {company.linkedinUrl ? (
              <a
                href={company.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 flex items-center gap-1.5 text-sm text-brand-primary hover:underline"
              >
                <Linkedin className="h-3.5 w-3.5" />
                LinkedIn Profile
                <ExternalLink className="h-3 w-3" />
              </a>
            ) : (
              <p className="mt-1 text-sm text-muted-foreground">-</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="contacts">
        <TabsList>
          <TabsTrigger value="contacts">
            Contacts ({company.contacts.length})
          </TabsTrigger>
          <TabsTrigger value="deals">
            Deals ({company.deals.length})
          </TabsTrigger>
          <TabsTrigger value="overview">Overview</TabsTrigger>
        </TabsList>

        <TabsContent value="contacts" className="mt-4">
          <Card>
            <CardContent>
              <CompanyContacts
                contacts={company.contacts}
                companyId={company.id}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="deals" className="mt-4">
          <Card>
            <CardContent>
              {company.deals.length === 0 ? (
                <div className="py-8 text-center text-sm text-muted-foreground">
                  No deals associated with this company.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Stage</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead>Type</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {company.deals.map((deal) => (
                      <TableRow key={deal.id}>
                        <TableCell>
                          <Link
                            href={`/dashboard/pipeline?deal=${deal.id}`}
                            className="font-medium text-brand-primary hover:underline"
                          >
                            {deal.title}
                          </Link>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              stageColors[deal.stage] ?? "bg-gray-100 text-gray-700"
                            }
                          >
                            {stageLabels[deal.stage] ?? deal.stage}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {deal.valueEur
                            ? formatCurrency(deal.valueEur)
                            : "-"}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {deal.dealType}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="overview" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Notes</CardTitle>
            </CardHeader>
            <CardContent>
              {company.notes ? (
                <p className="whitespace-pre-wrap text-sm">{company.notes}</p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No notes for this company.
                </p>
              )}
            </CardContent>
          </Card>

          {company.tags.length > 0 && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {company.tags.map((ct) => (
                    <Badge
                      key={ct.tagId}
                      variant="outline"
                      style={{
                        borderColor: ct.tag.color,
                        color: ct.tag.color,
                      }}
                    >
                      {ct.tag.name}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
