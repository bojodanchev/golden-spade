import "dotenv/config"
import { PrismaClient } from "../src/generated/prisma/client.ts"
import { PrismaLibSql } from "@prisma/adapter-libsql"
import { createClient } from "@libsql/client"
import bcrypt from "bcryptjs"

const libsql = createClient({ url: "file:./prisma/dev.db" })
const adapter = new PrismaLibSql(libsql)
const prisma = new PrismaClient({ adapter })

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash("admin123", 12)

  const admin = await prisma.user.upsert({
    where: { email: "admin@goldenspades.com" },
    update: {},
    create: {
      email: "admin@goldenspades.com",
      name: "Admin",
      hashedPassword,
      role: "admin",
    },
  })

  console.log("Created admin user:", admin.email)

  // Seed lead scoring rules
  const rules = [
    { factor: "company_size", condition: '{"field":"company.size","operator":"equals","value":"enterprise"}', points: 25 },
    { factor: "company_size", condition: '{"field":"company.size","operator":"equals","value":"large"}', points: 20 },
    { factor: "company_size", condition: '{"field":"company.size","operator":"equals","value":"medium"}', points: 10 },
    { factor: "region", condition: '{"field":"company.region","operator":"equals","value":"bulgaria"}', points: 15 },
    { factor: "region", condition: '{"field":"company.region","operator":"equals","value":"balkans"}', points: 10 },
    { factor: "membership", condition: '{"field":"company.isMember","operator":"equals","value":true}', points: 25 },
    { factor: "category", condition: '{"field":"contact.category","operator":"equals","value":"sponsor"}', points: 20 },
    { factor: "category", condition: '{"field":"contact.category","operator":"equals","value":"vip"}', points: 15 },
    { factor: "category", condition: '{"field":"contact.category","operator":"equals","value":"partner"}', points: 10 },
    { factor: "engagement", condition: '{"field":"interactions_count","operator":"gte","value":5}', points: 20 },
    { factor: "engagement", condition: '{"field":"interactions_count","operator":"gte","value":3}', points: 10 },
    { factor: "industry_fit", condition: '{"field":"company.type","operator":"equals","value":"gaming_operator"}', points: 20 },
    { factor: "industry_fit", condition: '{"field":"company.type","operator":"equals","value":"supplier"}', points: 15 },
  ]

  for (const rule of rules) {
    await prisma.leadScoringRule.create({ data: rule })
  }

  console.log(`Seeded ${rules.length} lead scoring rules`)

  // Seed some demo companies
  const companies = [
    { name: "EFbet Bulgaria", type: "gaming_operator", region: "bulgaria", size: "large", isMember: true, country: "Bulgaria" },
    { name: "Palms Bet", type: "gaming_operator", region: "bulgaria", size: "large", isMember: true, country: "Bulgaria" },
    { name: "NOVOMATIC", type: "supplier", region: "europe", size: "enterprise", isMember: true, country: "Austria" },
    { name: "Gaming Technologies", type: "technology", region: "balkans", size: "medium", isMember: false, country: "Bulgaria" },
    { name: "Casino Magazine BG", type: "media", region: "bulgaria", size: "small", isMember: true, country: "Bulgaria" },
  ]

  for (const c of companies) {
    await prisma.company.create({ data: c })
  }

  console.log(`Seeded ${companies.length} demo companies`)

  // Seed some demo contacts
  const efbet = await prisma.company.findFirst({ where: { name: "EFbet Bulgaria" } })
  const palms = await prisma.company.findFirst({ where: { name: "Palms Bet" } })

  const contacts = [
    { firstName: "Ivan", lastName: "Petrov", email: "ivan@efbet.bg", title: "CEO", companyId: efbet?.id, category: "vip", leadTier: "hot", leadScore: 85 },
    { firstName: "Maria", lastName: "Georgieva", email: "maria@palmsbet.bg", title: "Marketing Director", companyId: palms?.id, category: "partner", leadTier: "warm", leadScore: 55 },
    { firstName: "Stefan", lastName: "Nikolov", email: "stefan@novomatic.com", title: "Regional Manager", category: "sponsor", leadTier: "qualified", leadScore: 90 },
    { firstName: "Elena", lastName: "Dimitrova", email: "elena@casinomagazine.bg", title: "Editor-in-Chief", category: "media", leadTier: "warm", leadScore: 40 },
  ]

  for (const c of contacts) {
    await prisma.contact.create({ data: c })
  }

  console.log(`Seeded ${contacts.length} demo contacts`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
