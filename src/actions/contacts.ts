"use server"

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"

interface GetContactsParams {
  search?: string
  category?: string
  leadTier?: string
  page?: number
  pageSize?: number
}

export async function getContacts(params: GetContactsParams = {}) {
  const {
    search,
    category,
    leadTier,
    page = 1,
    pageSize = 20,
  } = params

  const where: Record<string, unknown> = {}

  if (search) {
    where.OR = [
      { firstName: { contains: search, mode: "insensitive" } },
      { lastName: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
    ]
  }

  if (category && category !== "all") {
    where.category = category
  }

  if (leadTier && leadTier !== "all") {
    where.leadTier = leadTier
  }

  const [contacts, total] = await Promise.all([
    db.contact.findMany({
      where,
      include: { company: true },
      orderBy: { updatedAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    db.contact.count({ where }),
  ])

  return { contacts, total, page, pageSize, totalPages: Math.ceil(total / pageSize) }
}

export async function getContact(id: string) {
  const contact = await db.contact.findUnique({
    where: { id },
    include: {
      company: true,
      tags: { include: { tag: true } },
      interactions: { orderBy: { occurredAt: "desc" } },
      followUps: { orderBy: { dueDate: "asc" } },
      deals: { include: { company: true } },
    },
  })

  return contact
}

interface ContactInsert {
  firstName: string
  lastName: string
  email?: string | null
  phone?: string | null
  linkedinUrl?: string | null
  title?: string | null
  companyId?: string | null
  category?: string
}

export async function createContact(data: ContactInsert) {
  const contact = await db.contact.create({
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email || null,
      phone: data.phone || null,
      linkedinUrl: data.linkedinUrl || null,
      title: data.title || null,
      companyId: data.companyId || null,
      category: data.category || "other",
    },
  })

  revalidatePath("/dashboard/contacts")
  return contact
}

export async function updateContact(id: string, data: Partial<ContactInsert>) {
  const contact = await db.contact.update({
    where: { id },
    data,
  })

  revalidatePath("/dashboard/contacts")
  revalidatePath(`/dashboard/contacts/${id}`)
  return contact
}

export async function deleteContact(id: string) {
  await db.contact.delete({ where: { id } })
  revalidatePath("/dashboard/contacts")
}

export async function getCompaniesForSelect() {
  return db.company.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  })
}
