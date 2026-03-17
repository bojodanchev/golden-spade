"use server"

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"

interface GetDealsParams {
  stage?: string
  dealType?: string
}

export async function getDeals(params: GetDealsParams = {}) {
  const { stage, dealType } = params

  const where: Record<string, unknown> = {}

  if (stage && stage !== "all") {
    where.stage = stage
  }

  if (dealType && dealType !== "all") {
    where.dealType = dealType
  }

  const deals = await db.deal.findMany({
    where,
    include: {
      company: true,
      contact: true,
    },
    orderBy: { updatedAt: "desc" },
  })

  return deals
}

export async function getDeal(id: string) {
  const deal = await db.deal.findUnique({
    where: { id },
    include: {
      company: true,
      contact: true,
      stageHistory: {
        orderBy: { changedAt: "desc" },
        include: { changedBy: true },
      },
      interactions: {
        orderBy: { occurredAt: "desc" },
        include: {
          contact: true,
          company: true,
        },
      },
    },
  })

  return deal
}

interface DealInsert {
  title: string
  companyId?: string | null
  contactId?: string | null
  stage?: string
  dealType: string
  valueEur?: number | null
  probability?: number
  expectedCloseDate?: string | null
  notes?: string | null
}

export async function createDeal(data: DealInsert) {
  const stage = data.stage || "initial_contact"

  const deal = await db.deal.create({
    data: {
      title: data.title,
      companyId: data.companyId || null,
      contactId: data.contactId || null,
      stage,
      dealType: data.dealType,
      valueEur: data.valueEur ?? null,
      probability: data.probability ?? 10,
      expectedCloseDate: data.expectedCloseDate
        ? new Date(data.expectedCloseDate)
        : null,
      notes: data.notes || null,
    },
  })

  // Create initial stage history entry
  await db.dealStageHistory.create({
    data: {
      dealId: deal.id,
      fromStage: null,
      toStage: stage,
      notes: "Deal created",
    },
  })

  revalidatePath("/dashboard/pipeline")
  return deal
}

export async function updateDeal(id: string, data: Partial<DealInsert>) {
  const updateData: Record<string, unknown> = {}

  if (data.title !== undefined) updateData.title = data.title
  if (data.companyId !== undefined) updateData.companyId = data.companyId || null
  if (data.contactId !== undefined) updateData.contactId = data.contactId || null
  if (data.dealType !== undefined) updateData.dealType = data.dealType
  if (data.valueEur !== undefined) updateData.valueEur = data.valueEur ?? null
  if (data.probability !== undefined) updateData.probability = data.probability
  if (data.expectedCloseDate !== undefined) {
    updateData.expectedCloseDate = data.expectedCloseDate
      ? new Date(data.expectedCloseDate)
      : null
  }
  if (data.notes !== undefined) updateData.notes = data.notes || null

  const deal = await db.deal.update({
    where: { id },
    data: updateData,
  })

  revalidatePath("/dashboard/pipeline")
  revalidatePath(`/dashboard/pipeline/${id}`)
  return deal
}

export async function updateDealStage(
  id: string,
  newStage: string,
  notes?: string
) {
  const deal = await db.deal.findUnique({
    where: { id },
    select: { stage: true },
  })

  if (!deal) throw new Error("Deal not found")

  const fromStage = deal.stage

  await db.deal.update({
    where: { id },
    data: { stage: newStage },
  })

  await db.dealStageHistory.create({
    data: {
      dealId: id,
      fromStage,
      toStage: newStage,
      notes: notes || null,
    },
  })

  revalidatePath("/dashboard/pipeline")
  revalidatePath(`/dashboard/pipeline/${id}`)
}

export async function deleteDeal(id: string) {
  await db.deal.delete({ where: { id } })
  revalidatePath("/dashboard/pipeline")
}

export async function getCompaniesForSelect() {
  return db.company.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  })
}

export async function getContactsForSelect(companyId?: string | null) {
  const where: Record<string, unknown> = {}
  if (companyId) {
    where.companyId = companyId
  }

  return db.contact.findMany({
    where,
    select: {
      id: true,
      firstName: true,
      lastName: true,
      companyId: true,
    },
    orderBy: { firstName: "asc" },
  })
}
