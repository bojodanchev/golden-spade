"use server"

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function getInteractions(contactId: string) {
  return db.interaction.findMany({
    where: { contactId },
    orderBy: { occurredAt: "desc" },
  })
}

interface CreateInteractionData {
  contactId: string
  type: string
  direction?: string | null
  subject?: string | null
  content?: string | null
  outcome?: string | null
}

export async function createInteraction(data: CreateInteractionData) {
  const interaction = await db.interaction.create({
    data: {
      contactId: data.contactId,
      type: data.type,
      direction: data.direction || null,
      subject: data.subject || null,
      content: data.content || null,
      outcome: data.outcome || null,
    },
  })

  revalidatePath(`/dashboard/contacts/${data.contactId}`)
  return interaction
}

export async function deleteInteraction(id: string) {
  const interaction = await db.interaction.findUnique({
    where: { id },
    select: { contactId: true },
  })

  await db.interaction.delete({ where: { id } })

  if (interaction?.contactId) {
    revalidatePath(`/dashboard/contacts/${interaction.contactId}`)
  }
}
