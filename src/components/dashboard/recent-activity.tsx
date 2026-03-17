import Link from "next/link"
import {
  Mail,
  Phone,
  Users,
  Linkedin,
  StickyNote,
  MessageCircle,
  type LucideIcon,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { timeAgo } from "@/lib/utils"
import type { Contact, Interaction } from "@prisma/client"

const TYPE_ICONS: Record<string, LucideIcon> = {
  email: Mail,
  call: Phone,
  meeting: Users,
  linkedin: Linkedin,
  note: StickyNote,
  whatsapp: MessageCircle,
}

const TYPE_COLORS: Record<string, string> = {
  email: "bg-blue-100 text-blue-700",
  call: "bg-green-100 text-green-700",
  meeting: "bg-purple-100 text-purple-700",
  linkedin: "bg-sky-100 text-sky-700",
  note: "bg-yellow-100 text-yellow-700",
  whatsapp: "bg-emerald-100 text-emerald-700",
}

interface RecentActivityProps {
  interactions: (Interaction & { contact: Contact | null })[]
}

export function RecentActivity({ interactions }: RecentActivityProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {interactions.length === 0 ? (
          <p className="py-4 text-center text-sm text-muted-foreground">
            No recent activity
          </p>
        ) : (
          <div className="relative space-y-0">
            {/* Timeline line */}
            <div className="absolute left-[17px] top-2 bottom-2 w-px border-l border-dashed border-muted-foreground/25" />

            {interactions.map((interaction) => {
              const Icon = TYPE_ICONS[interaction.type] || StickyNote
              const colorClass = TYPE_COLORS[interaction.type] || "bg-gray-100 text-gray-700"

              return (
                <div
                  key={interaction.id}
                  className="relative flex gap-3 py-2.5"
                >
                  <div
                    className={`relative z-10 flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full ${colorClass}`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <div className="min-w-0">
                        {interaction.contact ? (
                          <Link
                            href={`/dashboard/contacts/${interaction.contact.id}`}
                            className="text-sm font-medium hover:underline"
                          >
                            {interaction.contact.firstName}{" "}
                            {interaction.contact.lastName}
                          </Link>
                        ) : (
                          <span className="text-sm font-medium text-muted-foreground">
                            Unknown contact
                          </span>
                        )}
                      </div>
                      <span className="shrink-0 text-xs text-muted-foreground">
                        {timeAgo(interaction.occurredAt)}
                      </span>
                    </div>
                    {interaction.subject && (
                      <p className="truncate text-sm text-muted-foreground">
                        {interaction.subject}
                      </p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
