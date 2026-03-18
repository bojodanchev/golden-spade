export const dynamic = "force-dynamic"

import { notFound } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  Building2,
  User,
  Euro,
  Calendar,
  Percent,
  FileText,
  MessageSquare,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { PageHeader } from "@/components/shared/page-header"
import { StageHistory } from "@/components/pipeline/stage-history"
import { getDeal } from "@/actions/deals"
import { DEAL_STAGES } from "@/types/crm"
import { DealDetailActions } from "./actions"

const STAGE_LABELS: Record<string, string> = {
  initial_contact: "Initial Contact",
  discovery: "Discovery",
  proposal: "Proposal",
  negotiation: "Negotiation",
  closed_won: "Closed Won",
  closed_lost: "Closed Lost",
}

const STAGE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  initial_contact: { bg: "bg-blue-100", text: "text-blue-700", border: "border-blue-400" },
  discovery: { bg: "bg-yellow-100", text: "text-yellow-700", border: "border-yellow-400" },
  proposal: { bg: "bg-orange-100", text: "text-orange-700", border: "border-orange-400" },
  negotiation: { bg: "bg-purple-100", text: "text-purple-700", border: "border-purple-400" },
  closed_won: { bg: "bg-green-100", text: "text-green-700", border: "border-green-400" },
  closed_lost: { bg: "bg-red-100", text: "text-red-700", border: "border-red-400" },
}

const TYPE_LABELS: Record<string, string> = {
  sponsorship: "Sponsorship",
  advertising: "Advertising",
  membership: "Membership",
  event: "Event",
  partnership: "Partnership",
}

export default async function DealDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const deal = await getDeal(id)

  if (!deal) notFound()

  const currentStageIndex = DEAL_STAGES.indexOf(
    deal.stage as (typeof DEAL_STAGES)[number]
  )
  const stageColor = STAGE_COLORS[deal.stage] ?? STAGE_COLORS.initial_contact

  return (
    <div className="space-y-6">
      <PageHeader title={deal.title}>
        <Link href="/dashboard/pipeline">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </Link>
        <DealDetailActions deal={deal} />
      </PageHeader>

      {/* Stage Progress Bar */}
      <Card>
        <CardContent className="py-4">
          <div className="flex items-center gap-1">
            {DEAL_STAGES.map((stage, index) => {
              const isActive = stage === deal.stage
              const isPast = index < currentStageIndex
              const colors = STAGE_COLORS[stage]

              return (
                <div key={stage} className="flex flex-1 flex-col items-center gap-1">
                  <div
                    className={`h-2 w-full rounded-full transition-colors ${
                      isActive
                        ? `${colors?.bg ?? "bg-gray-200"}`
                        : isPast
                          ? "bg-green-200"
                          : "bg-muted"
                    }`}
                  />
                  <span
                    className={`text-[10px] font-medium ${
                      isActive
                        ? `${colors?.text ?? "text-foreground"} font-bold`
                        : isPast
                          ? "text-green-600"
                          : "text-muted-foreground"
                    }`}
                  >
                    {STAGE_LABELS[stage] ?? stage}
                  </span>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Deal Info */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileText className="h-5 w-5" />
              Deal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">
                  Stage
                </p>
                <Badge className={`${stageColor.bg} ${stageColor.text}`}>
                  {STAGE_LABELS[deal.stage] ?? deal.stage}
                </Badge>
              </div>

              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">
                  Deal Type
                </p>
                <Badge variant="secondary">
                  {TYPE_LABELS[deal.dealType] ?? deal.dealType}
                </Badge>
              </div>

              {deal.company && (
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">
                    Company
                  </p>
                  <div className="flex items-center gap-1.5">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{deal.company.name}</span>
                  </div>
                </div>
              )}

              {deal.contact && (
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">
                    Contact
                  </p>
                  <div className="flex items-center gap-1.5">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {deal.contact.firstName} {deal.contact.lastName}
                    </span>
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">
                  Value
                </p>
                <div className="flex items-center gap-1">
                  <Euro className="h-4 w-4 text-brand-secondary-dark" />
                  <span className="text-sm font-semibold">
                    {deal.valueEur != null
                      ? deal.valueEur.toLocaleString("en-US")
                      : "Not set"}
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">
                  Probability
                </p>
                <div className="flex items-center gap-1">
                  <Percent className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{deal.probability}%</span>
                </div>
              </div>

              {deal.expectedCloseDate && (
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">
                    Expected Close
                  </p>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {new Date(deal.expectedCloseDate).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        }
                      )}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {deal.notes && (
              <>
                <Separator />
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">
                    Notes
                  </p>
                  <p className="whitespace-pre-wrap text-sm">{deal.notes}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Stage History */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Stage History</CardTitle>
          </CardHeader>
          <CardContent>
            <StageHistory history={deal.stageHistory} />
          </CardContent>
        </Card>
      </div>

      {/* Related Interactions */}
      {deal.interactions && deal.interactions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <MessageSquare className="h-5 w-5" />
              Related Interactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {deal.interactions.map((interaction) => (
                <div
                  key={interaction.id}
                  className="flex items-start gap-3 rounded-lg border p-3"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {interaction.type}
                      </Badge>
                      {interaction.direction && (
                        <Badge variant="outline" className="text-xs">
                          {interaction.direction}
                        </Badge>
                      )}
                    </div>
                    <p className="mt-1 text-sm font-medium">
                      {interaction.subject}
                    </p>
                    {interaction.content && (
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {interaction.content}
                      </p>
                    )}
                    <p className="mt-1 text-xs text-muted-foreground">
                      {new Date(interaction.occurredAt).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        }
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
