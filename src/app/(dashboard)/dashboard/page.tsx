import { Spade } from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-brand-primary">
        <Spade className="h-10 w-10 text-brand-secondary" />
      </div>
      <h1 className="mt-6 font-heading text-3xl font-bold text-brand-primary">
        Welcome to Golden Spades
      </h1>
      <p className="mt-2 text-muted-foreground">
        Your CRM &amp; Event Management dashboard
      </p>
    </div>
  )
}
