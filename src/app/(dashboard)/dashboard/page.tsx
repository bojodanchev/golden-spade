import { Suspense } from "react"
import {
  getDashboardStats,
  getPipelineSummary,
  getRecentActivity,
  getUpcomingFollowUps,
} from "@/actions/dashboard"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { PipelineSummary } from "@/components/dashboard/pipeline-summary"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { UpcomingFollowUps } from "@/components/dashboard/upcoming-followups"
import { Skeleton } from "@/components/ui/skeleton"

function StatsCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-24 rounded-xl" />
      ))}
    </div>
  )
}

function ChartSkeleton() {
  return <Skeleton className="h-[380px] rounded-xl" />
}

function ListSkeleton() {
  return <Skeleton className="h-[320px] rounded-xl" />
}

export default async function DashboardPage() {
  const [stats, pipelineData, recentActivity, upcomingFollowUps] =
    await Promise.all([
      getDashboardStats(),
      getPipelineSummary(),
      getRecentActivity(),
      getUpcomingFollowUps(),
    ])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-brand-primary">
          Dashboard
        </h1>
        <p className="text-sm text-muted-foreground">
          Overview of your CRM performance
        </p>
      </div>

      <Suspense fallback={<StatsCardsSkeleton />}>
        <StatsCards
          totalContacts={stats.totalContacts}
          activeDeals={stats.activeDeals}
          pipelineValue={stats.pipelineValue}
          overdueFollowUps={stats.overdueFollowUps}
        />
      </Suspense>

      <Suspense fallback={<ChartSkeleton />}>
        <PipelineSummary data={pipelineData} />
      </Suspense>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Suspense fallback={<ListSkeleton />}>
          <RecentActivity interactions={recentActivity} />
        </Suspense>
        <Suspense fallback={<ListSkeleton />}>
          <UpcomingFollowUps followUps={upcomingFollowUps as any} />
        </Suspense>
      </div>
    </div>
  )
}
