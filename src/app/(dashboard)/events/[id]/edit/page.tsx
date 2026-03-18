export const dynamic = "force-dynamic"

import { notFound } from "next/navigation"
import { getEvent } from "@/actions/events"
import { PageHeader } from "@/components/shared/page-header"
import { EventFormWrapper } from "./form-wrapper"

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const event = await getEvent(id)

  if (!event) return notFound()

  return (
    <div className="space-y-6">
      <PageHeader
        title="Edit Event"
        description={`Update details for ${event.name}`}
      />
      <div className="mx-auto max-w-2xl">
        <EventFormWrapper event={event} />
      </div>
    </div>
  )
}
