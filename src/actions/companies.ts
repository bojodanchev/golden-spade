"use server"

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"

interface GetCompaniesParams {
  search?: string
  type?: string
  region?: string
  isMember?: string
  page?: number
  pageSize?: number
}

export async function getCompanies(params: GetCompaniesParams = {}) {
  const {
    search,
    type,
    region,
    isMember,
    page = 1,
    pageSize = 20,
  } = params

  const where: Record<string, unknown> = {}

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { country: { contains: search, mode: "insensitive" } },
    ]
  }

  if (type && type !== "all") {
    where.type = type
  }

  if (region && region !== "all") {
    where.region = region
  }

  if (isMember === "true") {
    where.isMember = true
  }

  const [companies, total] = await Promise.all([
    db.company.findMany({
      where,
      include: {
        _count: { select: { contacts: true } },
      },
      orderBy: { updatedAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    db.company.count({ where }),
  ])

  return {
    companies,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  }
}

export async function getCompany(id: string) {
  const company = await db.company.findUnique({
    where: { id },
    include: {
      contacts: { orderBy: { lastName: "asc" } },
      tags: { include: { tag: true } },
      deals: { include: { contact: true } },
    },
  })

  return company
}

interface CompanyInsert {
  name: string
  type?: string
  website?: string | null
  linkedinUrl?: string | null
  country?: string | null
  region?: string
  size?: string | null
  isMember?: boolean
  notes?: string | null
}

export async function createCompany(data: CompanyInsert) {
  const company = await db.company.create({
    data: {
      name: data.name,
      type: data.type || "other",
      website: data.website || null,
      linkedinUrl: data.linkedinUrl || null,
      country: data.country || null,
      region: data.region || "bulgaria",
      size: data.size || null,
      isMember: data.isMember ?? false,
      notes: data.notes || null,
    },
  })

  revalidatePath("/dashboard/companies")
  return company
}

export async function updateCompany(id: string, data: Partial<CompanyInsert>) {
  const company = await db.company.update({
    where: { id },
    data,
  })

  revalidatePath("/dashboard/companies")
  revalidatePath(`/dashboard/companies/${id}`)
  return company
}

export async function deleteCompany(id: string) {
  await db.company.delete({ where: { id } })
  revalidatePath("/dashboard/companies")
}

export async function getAllCompanies() {
  return db.company.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  })
}
