"use server"

import { db } from "@/lib/db"

export async function getDashboardStats() {
  const [totalContacts, activeDeals, pipelineValue, overdueFollowUps] =
    await Promise.all([
      db.contact.count(),
      db.deal.count({
        where: {
          stage: {
            notIn: ["closed_won", "closed_lost"],
          },
        },
      }),
      db.deal.aggregate({
        where: {
          stage: {
            notIn: ["closed_won", "closed_lost"],
          },
        },
        _sum: { valueEur: true },
      }),
      db.followUp.count({
        where: {
          status: "pending",
          dueDate: { lt: new Date() },
        },
      }),
    ])

  return {
    totalContacts,
    activeDeals,
    pipelineValue: pipelineValue._sum.valueEur ?? 0,
    overdueFollowUps,
  }
}

export async function getPipelineSummary() {
  const deals = await db.deal.groupBy({
    by: ["stage"],
    _count: { id: true },
    _sum: { valueEur: true },
  })

  return deals.map((d) => ({
    stage: d.stage,
    count: d._count.id,
    totalValue: d._sum.valueEur ?? 0,
  }))
}

export async function getRecentActivity(limit = 10) {
  const interactions = await db.interaction.findMany({
    take: limit,
    orderBy: { occurredAt: "desc" },
    include: {
      contact: true,
    },
  })

  return interactions
}

export async function getUpcomingFollowUps(limit = 5) {
  const followUps = await db.followUp.findMany({
    where: {
      status: { in: ["pending", "overdue"] },
    },
    take: limit,
    orderBy: { dueDate: "asc" },
    include: {
      contact: true,
    },
  })

  return followUps
}
