"use server"

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"

interface GetFollowUpsParams {
  status?: string
  assignedToId?: string
}

export async function getFollowUps(params: GetFollowUpsParams = {}) {
  const { status, assignedToId } = params

  const where: Record<string, unknown> = {}

  if (status && status !== "all") {
    where.status = status
  }

  if (assignedToId) {
    where.assignedToId = assignedToId
  }

  const followUps = await db.followUp.findMany({
    where,
    include: {
      contact: true,
    },
    orderBy: { dueDate: "asc" },
  })

  return followUps
}

interface FollowUpInsert {
  contactId: string
  title: string
  dueDate: string
  priority?: string
  assignedToId?: string | null
  notes?: string | null
}

export async function createFollowUp(data: FollowUpInsert) {
  const followUp = await db.followUp.create({
    data: {
      contactId: data.contactId,
      title: data.title,
      dueDate: new Date(data.dueDate),
      priority: data.priority || "medium",
      assignedToId: data.assignedToId || null,
      notes: data.notes || null,
    },
  })

  revalidatePath("/dashboard/contacts")
  return followUp
}

export async function completeFollowUp(id: string) {
  const followUp = await db.followUp.update({
    where: { id },
    data: {
      status: "completed",
      completedAt: new Date(),
    },
  })

  revalidatePath("/dashboard/contacts")
  return followUp
}

export async function getOverdueCount() {
  const count = await db.followUp.count({
    where: {
      status: "pending",
      dueDate: {
        lt: new Date(),
      },
    },
  })

  return count
}
