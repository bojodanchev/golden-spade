import { Users, Briefcase, Euro, AlertCircle, type LucideIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn, formatCurrency } from "@/lib/utils"

interface StatCardProps {
  label: string
  value: string | number
  icon: LucideIcon
  iconBgColor: string
  iconColor: string
  alert?: boolean
}

function StatCard({ label, value, icon: Icon, iconBgColor, iconColor, alert }: StatCardProps) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4">
        <div className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-full", iconBgColor)}>
          <Icon className={cn("h-6 w-6", iconColor)} />
        </div>
        <div className="min-w-0">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className={cn(
            "font-mono text-2xl font-bold tracking-tight",
            alert && "text-red-600"
          )}>
            {value}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

interface StatsCardsProps {
  totalContacts: number
  activeDeals: number
  pipelineValue: number
  overdueFollowUps: number
}

export function StatsCards({ totalContacts, activeDeals, pipelineValue, overdueFollowUps }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        label="Total Contacts"
        value={totalContacts}
        icon={Users}
        iconBgColor="bg-blue-100"
        iconColor="text-[#1a365d]"
      />
      <StatCard
        label="Active Deals"
        value={activeDeals}
        icon={Briefcase}
        iconBgColor="bg-yellow-100"
        iconColor="text-[#d69e2e]"
      />
      <StatCard
        label="Pipeline Value"
        value={formatCurrency(pipelineValue)}
        icon={Euro}
        iconBgColor="bg-green-100"
        iconColor="text-green-700"
      />
      <StatCard
        label="Overdue Follow-ups"
        value={overdueFollowUps}
        icon={AlertCircle}
        iconBgColor={overdueFollowUps > 0 ? "bg-red-100" : "bg-gray-100"}
        iconColor={overdueFollowUps > 0 ? "text-red-600" : "text-gray-500"}
        alert={overdueFollowUps > 0}
      />
    </div>
  )
}
