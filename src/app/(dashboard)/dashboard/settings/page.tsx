import { getSession } from "@/lib/auth-helpers"
import { getScoringRules } from "@/actions/lead-scoring"
import { SettingsTabs } from "@/components/dashboard/settings-tabs"

export default async function SettingsPage() {
  const [session, scoringRules] = await Promise.all([
    getSession(),
    getScoringRules(),
  ])

  const user = session?.user as
    | { id: string; name?: string | null; email?: string | null; role?: string }
    | undefined

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-brand-primary">
          Settings
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage your profile and application settings
        </p>
      </div>

      <SettingsTabs user={user ?? null} scoringRules={scoringRules} />
    </div>
  )
}
