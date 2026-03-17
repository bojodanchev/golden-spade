"use server"

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function getScoringRules() {
  return db.leadScoringRule.findMany({
    orderBy: { factor: "asc" },
  })
}

interface ScoringRuleData {
  factor: string
  condition: string
  points: number
  isActive?: boolean
}

export async function createScoringRule(data: ScoringRuleData) {
  const rule = await db.leadScoringRule.create({
    data: {
      factor: data.factor,
      condition: data.condition,
      points: data.points,
      isActive: data.isActive ?? true,
    },
  })

  revalidatePath("/dashboard/settings")
  return rule
}

export async function updateScoringRule(
  id: string,
  data: Partial<ScoringRuleData>
) {
  const updateData: Record<string, unknown> = {}

  if (data.factor !== undefined) updateData.factor = data.factor
  if (data.condition !== undefined) updateData.condition = data.condition
  if (data.points !== undefined) updateData.points = data.points
  if (data.isActive !== undefined) updateData.isActive = data.isActive

  const rule = await db.leadScoringRule.update({
    where: { id },
    data: updateData,
  })

  revalidatePath("/dashboard/settings")
  return rule
}

export async function deleteScoringRule(id: string) {
  await db.leadScoringRule.delete({ where: { id } })
  revalidatePath("/dashboard/settings")
}
