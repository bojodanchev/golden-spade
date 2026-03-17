import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET() {
  const now = new Date()

  const result = await db.followUp.updateMany({
    where: {
      status: "pending",
      dueDate: { lt: now },
    },
    data: {
      status: "overdue",
    },
  })

  return NextResponse.json({
    updated: result.count,
    timestamp: now.toISOString(),
  })
}
