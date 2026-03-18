import { PrismaClient } from "@prisma/client"
import { PrismaLibSql } from "@prisma/adapter-libsql"
import bcrypt from "bcryptjs"

function createPrisma() {
  const url = process.env.TURSO_DATABASE_URL
  if (!url || url.startsWith("file:")) {
    return new PrismaClient()
  }
  const adapter = new PrismaLibSql({
    url,
    authToken: process.env.TURSO_AUTH_TOKEN,
  })
  return new PrismaClient({ adapter })
}

const prisma = createPrisma()

async function main() {
  console.log("Clearing existing data...")

  // Clear in correct FK order
  await prisma.eventFollowUp.deleteMany()
  await prisma.eventSponsor.deleteMany()
  await prisma.eventGuest.deleteMany()
  await prisma.event.deleteMany()
  await prisma.dealStageHistory.deleteMany()
  await prisma.deal.deleteMany()
  await prisma.followUp.deleteMany()
  await prisma.interaction.deleteMany()
  await prisma.contactTag.deleteMany()
  await prisma.companyTag.deleteMany()
  await prisma.leadScoreHistory.deleteMany()
  await prisma.contact.deleteMany()
  await prisma.company.deleteMany()
  await prisma.tag.deleteMany()
  await prisma.leadScoringRule.deleteMany()
  await prisma.user.deleteMany()

  console.log("Seeding fresh data...")

  // ========== ADMIN USER ==========
  const hashedPassword = await bcrypt.hash("admin123", 12)
  const admin = await prisma.user.upsert({
    where: { email: "admin@goldenspades.com" },
    update: {},
    create: {
      email: "admin@goldenspades.com",
      name: "Todor Chetrafilov",
      hashedPassword,
      role: "admin",
    },
  })
  console.log("Created admin user:", admin.email)

  // ========== TAGS ==========
  const tags = await Promise.all([
    prisma.tag.create({ data: { name: "VIP", color: "#d69e2e", category: "contact" } }),
    prisma.tag.create({ data: { name: "Key Decision Maker", color: "#1a365d", category: "contact" } }),
    prisma.tag.create({ data: { name: "Speaker Potential", color: "#805ad5", category: "contact" } }),
    prisma.tag.create({ data: { name: "Sponsor Lead", color: "#38a169", category: "contact" } }),
    prisma.tag.create({ data: { name: "BEGE Attendee", color: "#dd6b20", category: "contact" } }),
    prisma.tag.create({ data: { name: "Magazine Subscriber", color: "#e53e3e", category: "contact" } }),
    prisma.tag.create({ data: { name: "СОХИДБ Member", color: "#1a365d", category: "company" } }),
    prisma.tag.create({ data: { name: "Potential Sponsor", color: "#d69e2e", category: "company" } }),
    prisma.tag.create({ data: { name: "Advertiser", color: "#38a169", category: "company" } }),
    prisma.tag.create({ data: { name: "Strategic Partner", color: "#805ad5", category: "company" } }),
  ])
  console.log(`Created ${tags.length} tags`)

  // ========== LEAD SCORING RULES ==========
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
  console.log(`Created ${rules.length} lead scoring rules`)

  // ========== COMPANIES ==========
  // Romanian/Balkan Operators
  const superbet = await prisma.company.create({ data: { name: "Superbet Group", type: "gaming_operator", region: "balkans", size: "enterprise", isMember: false, country: "Romania", website: "https://superbet.com", linkedinUrl: "https://linkedin.com/company/superbet", notes: "Largest Romanian operator. €1.3bn backed by Blackstone. Expanding across CEE." } })
  const kaizen = await prisma.company.create({ data: { name: "Kaizen Gaming (Betano)", type: "gaming_operator", region: "europe", size: "enterprise", isMember: false, country: "Greece", website: "https://kaizengaming.com", notes: "Operates Betano brand in 13 countries including Romania and Bulgaria." } })
  const stanleybet = await prisma.company.create({ data: { name: "Stanleybet Romania", type: "gaming_operator", region: "balkans", size: "large", isMember: false, country: "Romania", website: "https://stanleybet.ro", notes: "One of Romania's largest bookmakers since 2004. Revenue $243.7M." } })
  const maxbet = await prisma.company.create({ data: { name: "Maxbet Entertainment", type: "gaming_operator", region: "balkans", size: "large", isMember: false, country: "Romania", website: "https://maxbet.ro", notes: "Founded 2002. 124+ gaming halls in Romania." } })
  const mozzart = await prisma.company.create({ data: { name: "Mozzart Bet", type: "gaming_operator", region: "balkans", size: "large", isMember: false, country: "Serbia", website: "https://mozzartbet.com", notes: "Major Serbian operator." } })
  const meridian = await prisma.company.create({ data: { name: "Meridianbet", type: "gaming_operator", region: "balkans", size: "large", isMember: false, country: "Serbia", website: "https://meridianbet.com", notes: "Top 3 operator in Serbia, Montenegro, Bosnia. Operates in 35 countries." } })
  const favbet = await prisma.company.create({ data: { name: "FAVBET Group", type: "gaming_operator", region: "balkans", size: "large", isMember: false, country: "Ukraine", website: "https://favbet.com", notes: "Operates in Romania, Ukraine, Croatia since 2015." } })
  const entain = await prisma.company.create({ data: { name: "Entain CEE (SuperSport)", type: "gaming_operator", region: "balkans", size: "enterprise", isMember: false, country: "Croatia", website: "https://entain.com", notes: "Croatia's leading operator. Part of Entain Group." } })
  const opap = await prisma.company.create({ data: { name: "OPAP", type: "gaming_operator", region: "balkans", size: "enterprise", isMember: false, country: "Greece", website: "https://opap.gr", notes: "Greece's largest gaming operator. Acquired Stoiximan." } })
  const kindred = await prisma.company.create({ data: { name: "Kindred Group (Vlad Cazino)", type: "gaming_operator", region: "europe", size: "enterprise", isMember: false, country: "Malta", website: "https://kindredgroup.com", notes: "Vlad Cazino is Romania's first purely Romanian-branded online casino." } })

  // Bulgarian Operators
  const efbet = await prisma.company.create({ data: { name: "Efbet", type: "gaming_operator", region: "bulgaria", size: "large", isMember: true, country: "Bulgaria", website: "https://efbet.com", notes: "Largest casino chain in Bulgaria. 52 casinos, 6 sports bars. Founded 1990." } })
  const palmsBet = await prisma.company.create({ data: { name: "Palms Bet", type: "gaming_operator", region: "bulgaria", size: "large", isMember: true, country: "Bulgaria", website: "https://palmsbet.com", notes: "23.1% market share. First publicly traded gambling company in Bulgaria (BSE)." } })
  const winbet = await prisma.company.create({ data: { name: "Winbet", type: "gaming_operator", region: "bulgaria", size: "large", isMember: true, country: "Bulgaria", website: "https://winbet.bg", notes: "Market leader with 30.7% share. 33 casinos, 20+ years history." } })
  const eurobet = await prisma.company.create({ data: { name: "Eurobet OOD", type: "gaming_operator", region: "bulgaria", size: "medium", isMember: true, country: "Bulgaria", website: "https://eurobet.bg", notes: "Founded 1996. Leader in number games. INTRALOT holds 49% stake." } })
  const inbet = await prisma.company.create({ data: { name: "Inbet", type: "gaming_operator", region: "bulgaria", size: "medium", isMember: true, country: "Bulgaria", website: "https://inbet.com", notes: "7 gaming halls under Inbet Casino brand." } })
  const topBet = await prisma.company.create({ data: { name: "8888.bg (Top Bet)", type: "gaming_operator", region: "bulgaria", size: "medium", isMember: true, country: "Bulgaria", website: "https://8888.bg", notes: "Among top 5 gambling operators in Bulgaria." } })
  const sesame = await prisma.company.create({ data: { name: "Sesame Online", type: "gaming_operator", region: "bulgaria", size: "medium", isMember: true, country: "Bulgaria", website: "https://sesame.bg", notes: "Operating since 2001. Licensed for online casino and sports betting." } })
  const betanoBG = await prisma.company.create({ data: { name: "Betano Bulgaria", type: "gaming_operator", region: "bulgaria", size: "large", isMember: false, country: "Bulgaria", website: "https://betano.bg", notes: "10.7% market share, 4th largest operator in Bulgaria. Part of Kaizen Gaming." } })

  // Suppliers/Technology
  const egt = await prisma.company.create({ data: { name: "Euro Games Technology (EGT)", type: "supplier", region: "bulgaria", size: "enterprise", isMember: true, country: "Bulgaria", website: "https://egt.com", linkedinUrl: "https://linkedin.com/company/euro-games-technology", notes: "Global gaming manufacturer. 3,200+ employees, 28 offices worldwide. Bulgarian HQ." } })
  const amusnet = await prisma.company.create({ data: { name: "Amusnet Interactive", type: "supplier", region: "bulgaria", size: "large", isMember: true, country: "Bulgaria", website: "https://amusnet.com", notes: "Formerly EGT Digital. 850+ employees. Major iGaming content provider." } })
  const ctGaming = await prisma.company.create({ data: { name: "CT Gaming", type: "supplier", region: "bulgaria", size: "large", isMember: true, country: "Bulgaria", website: "https://ctgaming.com", notes: "Founded by Milo Borissov. 900+ employees, 50+ jurisdictions." } })
  const ctInteractive = await prisma.company.create({ data: { name: "CT Interactive", type: "supplier", region: "bulgaria", size: "medium", isMember: true, country: "Bulgaria", website: "https://ct-interactive.com", notes: "iGaming division of CT Gaming group." } })
  const apex = await prisma.company.create({ data: { name: "APEX Gaming Technology", type: "supplier", region: "europe", size: "large", isMember: false, country: "Austria", website: "https://apex-gaming.com", notes: "Subsidiaries in Serbia, Albania, Macedonia. Manufacturing in Czech Republic." } })
  const pragmatic = await prisma.company.create({ data: { name: "Pragmatic Play", type: "supplier", region: "europe", size: "enterprise", isMember: false, country: "Malta", website: "https://pragmaticplay.com", notes: "Major content supplier to Balkan operators." } })
  const novomatic = await prisma.company.create({ data: { name: "NOVOMATIC Romania", type: "supplier", region: "balkans", size: "enterprise", isMember: false, country: "Romania", website: "https://novomatic.com", notes: "ADMIRAL brand in Romania. 35+ years in industry." } })
  const digitain = await prisma.company.create({ data: { name: "Digitain", type: "supplier", region: "europe", size: "large", isMember: false, country: "Armenia", website: "https://digitain.com", notes: "1,400+ employees. Opened Bucharest office 2023 for Balkan expansion." } })

  // Associations & Regulators
  const rombet = await prisma.company.create({ data: { name: "ROMBET", type: "association", region: "balkans", size: "small", isMember: false, country: "Romania", website: "https://rombet.com", notes: "Romania's main gambling industry association." } })
  const onjn = await prisma.company.create({ data: { name: "ONJN (Romanian National Gambling Office)", type: "regulator", region: "balkans", size: "medium", isMember: false, country: "Romania", notes: "Romanian gambling regulator." } })
  const agib = await prisma.company.create({ data: { name: "AGIB (Association of Gaming Industry in Bulgaria)", type: "association", region: "bulgaria", size: "small", isMember: true, country: "Bulgaria", website: "https://agib.bg", notes: "Founded 1992. Organizers of BEGE Expo." } })
  const sohidb = await prisma.company.create({ data: { name: "СОХИДБ / AOGGAB", type: "association", region: "bulgaria", size: "small", isMember: true, country: "Bulgaria", notes: "Largest non-profit in Bulgaria's gambling industry. 100+ members. Founded 2020." } })

  console.log("Created 30 companies")

  // ========== CONTACTS ==========
  // Romanian/Balkan executives
  const contacts = await Promise.all([
    // Superbet
    prisma.contact.create({ data: { firstName: "Sacha", lastName: "Dragic", email: "sacha.dragic@superbet.com", title: "Founder & CEO", companyId: superbet.id, category: "vip", leadTier: "qualified", leadScore: 95, linkedinUrl: "https://linkedin.com/in/sacha-dragic" } }),
    prisma.contact.create({ data: { firstName: "Albert", lastName: "Simsensohn", email: "albert.simsensohn@superbet.com", title: "Deputy CEO", companyId: superbet.id, category: "vip", leadTier: "hot", leadScore: 85 } }),
    prisma.contact.create({ data: { firstName: "Eamonn", lastName: "O'Loughlin", email: "eamonn.oloughlin@superbet.com", title: "Chief Operating Officer", companyId: superbet.id, category: "partner", leadTier: "hot", leadScore: 80 } }),
    // Kaizen/Betano
    prisma.contact.create({ data: { firstName: "George", lastName: "Daskalakis", email: "george.daskalakis@kaizengaming.com", title: "Co-Founder & CEO", companyId: kaizen.id, category: "vip", leadTier: "qualified", leadScore: 92 } }),
    // OPAP
    prisma.contact.create({ data: { firstName: "Jan", lastName: "Karas", email: "jan.karas@opap.gr", title: "Chairman & CEO", companyId: opap.id, category: "vip", leadTier: "hot", leadScore: 88 } }),
    // Stanleybet
    prisma.contact.create({ data: { firstName: "Csaba", lastName: "Tanko", email: "csaba.tanko@stanleybet.ro", title: "CEO", companyId: stanleybet.id, category: "sponsor", leadTier: "hot", leadScore: 82 } }),
    prisma.contact.create({ data: { firstName: "Catalin", lastName: "Moise", email: "catalin.moise@stanleybet.ro", title: "COO Online", companyId: stanleybet.id, category: "partner", leadTier: "warm", leadScore: 65 } }),
    prisma.contact.create({ data: { firstName: "Tamas", lastName: "Gajdo", email: "tamas.gajdo@stanleybet.ro", title: "Chief Technology Officer", companyId: stanleybet.id, category: "partner", leadTier: "warm", leadScore: 60 } }),
    // Mozzart
    prisma.contact.create({ data: { firstName: "Dejan", lastName: "Cirovic", email: "dejan.cirovic@mozzartbet.com", title: "CEO", companyId: mozzart.id, category: "vip", leadTier: "hot", leadScore: 78 } }),
    // Meridian
    prisma.contact.create({ data: { firstName: "Zoran", lastName: "Milosevic", email: "zoran.milosevic@meridianbet.com", title: "CEO", companyId: meridian.id, category: "vip", leadTier: "warm", leadScore: 72 } }),
    // Maxbet
    prisma.contact.create({ data: { firstName: "Victor", lastName: "Rusinov", email: "victor.rusinov@maxbet.ro", title: "CEO", companyId: maxbet.id, category: "sponsor", leadTier: "hot", leadScore: 75 } }),
    prisma.contact.create({ data: { firstName: "Avi", lastName: "Barel", email: "avi.barel@maxbet.com", title: "Founder & Owner", companyId: maxbet.id, category: "vip", leadTier: "qualified", leadScore: 90 } }),
    // FAVBET
    prisma.contact.create({ data: { firstName: "Andrii", lastName: "Matiukha", email: "andrii.matiukha@favbet.com", title: "Founder", companyId: favbet.id, category: "vip", leadTier: "warm", leadScore: 68 } }),
    // Entain
    prisma.contact.create({ data: { firstName: "Radim", lastName: "Haluza", email: "radim.haluza@entain.com", title: "CEO, Entain CEE", companyId: entain.id, category: "vip", leadTier: "hot", leadScore: 82 } }),
    // NOVOMATIC
    prisma.contact.create({ data: { firstName: "Valentin-Adrian", lastName: "Georgescu", email: "valentin.georgescu@novomatic.ro", title: "CEO", companyId: novomatic.id, category: "sponsor", leadTier: "qualified", leadScore: 88 } }),
    // Regulators/Associations
    prisma.contact.create({ data: { firstName: "Dan", lastName: "Iliovici", email: "dan.iliovici@onjn.gov.ro", title: "President", companyId: onjn.id, category: "government", leadTier: "hot", leadScore: 70 } }),
    prisma.contact.create({ data: { firstName: "Dan Alexandru", lastName: "Ghita", email: "dan.ghita@rombet.com", title: "President", companyId: rombet.id, category: "partner", leadTier: "hot", leadScore: 72 } }),

    // Bulgarian executives
    // Efbet
    prisma.contact.create({ data: { firstName: "Tsvetomir", lastName: "Naydenov", email: "tsvetomir.naydenov@efbet.com", title: "CEO & Co-Founder", companyId: efbet.id, category: "vip", leadTier: "qualified", leadScore: 95 } }),
    prisma.contact.create({ data: { firstName: "Boyan", lastName: "Naydenov", email: "boyan.naydenov@efbet.com", title: "Managing Director & Owner", companyId: efbet.id, category: "vip", leadTier: "qualified", leadScore: 90 } }),
    // Palms Bet
    prisma.contact.create({ data: { firstName: "Lachezar", lastName: "Petrov", email: "lachezar.petrov@palmsbet.com", title: "CEO", companyId: palmsBet.id, category: "vip", leadTier: "qualified", leadScore: 92 } }),
    prisma.contact.create({ data: { firstName: "Desislava", lastName: "Zaharieva", email: "desislava.zaharieva@palmsbet.com", title: "Chief Marketing Officer", companyId: palmsBet.id, category: "sponsor", leadTier: "hot", leadScore: 78 } }),
    // Winbet
    prisma.contact.create({ data: { firstName: "Dejan", lastName: "Isakovic", email: "dejan.isakovic@winbet.bg", title: "CEO", companyId: winbet.id, category: "vip", leadTier: "qualified", leadScore: 93 } }),
    // Betano BG
    prisma.contact.create({ data: { firstName: "Tsvetin", lastName: "Yordanov", email: "tsvetin.yordanov@betano.bg", title: "Country Manager Bulgaria", companyId: betanoBG.id, category: "vip", leadTier: "hot", leadScore: 80 } }),
    // Eurobet
    prisma.contact.create({ data: { firstName: "Millen", lastName: "Stamatov", email: "millen.stamatov@eurobet.bg", title: "CEO", companyId: eurobet.id, category: "vip", leadTier: "hot", leadScore: 75 } }),
    // Inbet
    prisma.contact.create({ data: { firstName: "Mihail", lastName: "Hadzhiev", email: "mihail.hadzhiev@inbet.com", title: "CEO", companyId: inbet.id, category: "member", leadTier: "warm", leadScore: 65 } }),
    // 8888
    prisma.contact.create({ data: { firstName: "Dencho", lastName: "Ganev", email: "dencho.ganev@8888.bg", title: "Majority Owner", companyId: topBet.id, category: "vip", leadTier: "hot", leadScore: 82 } }),
    prisma.contact.create({ data: { firstName: "Alexander", lastName: "Lichev", email: "alexander.lichev@8888.bg", title: "Chief Marketing Officer", companyId: topBet.id, category: "sponsor", leadTier: "warm", leadScore: 62 } }),
    // Sesame
    prisma.contact.create({ data: { firstName: "Ivan", lastName: "Nikolov", email: "ivan.nikolov@sesame.bg", title: "Managing Director", companyId: sesame.id, category: "member", leadTier: "warm", leadScore: 58 } }),

    // Tech companies
    // EGT
    prisma.contact.create({ data: { firstName: "Vladimir", lastName: "Dokov", email: "vladimir.dokov@egt.com", title: "CEO", companyId: egt.id, category: "vip", leadTier: "qualified", leadScore: 95 } }),
    prisma.contact.create({ data: { firstName: "Nadia", lastName: "Popova", email: "nadia.popova@egt.com", title: "Chief Revenue Officer & VP Sales", companyId: egt.id, category: "speaker", leadTier: "hot", leadScore: 82 } }),
    // Amusnet
    prisma.contact.create({ data: { firstName: "Ivo", lastName: "Georgiev", email: "ivo.georgiev@amusnet.com", title: "CEO", companyId: amusnet.id, category: "vip", leadTier: "qualified", leadScore: 90 } }),
    prisma.contact.create({ data: { firstName: "Irina", lastName: "Rusimova", email: "irina.rusimova@amusnet.com", title: "Chief Sales Officer", companyId: amusnet.id, category: "sponsor", leadTier: "hot", leadScore: 78 } }),
    prisma.contact.create({ data: { firstName: "Liliya", lastName: "Chatalbasheva", email: "liliya.chatalbasheva@amusnet.com", title: "Chief Marketing & Communications Officer", companyId: amusnet.id, category: "media", leadTier: "warm", leadScore: 60 } }),
    // CT Gaming
    prisma.contact.create({ data: { firstName: "Milo", lastName: "Borissov", email: "milo.borissov@ctgaming.com", title: "Founder, President & CEO", companyId: ctGaming.id, category: "vip", leadTier: "qualified", leadScore: 95 } }),
    prisma.contact.create({ data: { firstName: "Elena", lastName: "Shaterova", email: "elena.shaterova@ctgaming.com", title: "Chairman of the Board", companyId: ctGaming.id, category: "vip", leadTier: "hot", leadScore: 85 } }),
    // CT Interactive
    prisma.contact.create({ data: { firstName: "Lachezar", lastName: "Petrov", email: "lachezar.petrov@ct-interactive.com", title: "CEO", companyId: ctInteractive.id, category: "partner", leadTier: "hot", leadScore: 78 } }),
    // APEX
    prisma.contact.create({ data: { firstName: "Max", lastName: "Pessnegger", email: "max.pessnegger@apex-gaming.com", title: "CEO", companyId: apex.id, category: "partner", leadTier: "warm", leadScore: 68 } }),
    // Pragmatic Play
    prisma.contact.create({ data: { firstName: "Julian", lastName: "Jarvis", email: "julian.jarvis@pragmaticplay.com", title: "Co-Founder & CEO", companyId: pragmatic.id, category: "sponsor", leadTier: "hot", leadScore: 85 } }),
    prisma.contact.create({ data: { firstName: "Irina", lastName: "Cornides", email: "irina.cornides@pragmaticplay.com", title: "Chief Operating Officer", companyId: pragmatic.id, category: "partner", leadTier: "warm", leadScore: 65 } }),
    // Digitain
    prisma.contact.create({ data: { firstName: "Vardges", lastName: "Vardanyan", email: "vardges.vardanyan@digitain.com", title: "Founder & CEO", companyId: digitain.id, category: "sponsor", leadTier: "warm", leadScore: 70 } }),

    // Associations
    prisma.contact.create({ data: { firstName: "Rossi", lastName: "McKee", email: "rossi.mckee@agib.bg", title: "Honorary Chair", companyId: agib.id, category: "vip", leadTier: "qualified", leadScore: 88 } }),
    prisma.contact.create({ data: { firstName: "Milen", lastName: "Totev", email: "milen.totev@sohidb.bg", title: "Chairman", companyId: sohidb.id, category: "vip", leadTier: "qualified", leadScore: 90 } }),
    prisma.contact.create({ data: { firstName: "Gavril", lastName: "Chetrafilov", email: "gavril.chetrafilov@sohidb.bg", title: "Vice-Chairman", companyId: sohidb.id, category: "member", leadTier: "hot", leadScore: 75 } }),
  ])

  console.log(`Created ${contacts.length} contacts`)

  // ========== DEALS (Pipeline) ==========
  const deals = await Promise.all([
    // Closed Won
    prisma.deal.create({ data: { title: "EGT - Title Sponsor Gala 2026", companyId: egt.id, contactId: contacts[28].id, stage: "closed_won", dealType: "sponsorship", valueEur: 50000, probability: 100, expectedCloseDate: new Date("2026-06-15"), createdById: admin.id, notes: "EGT confirmed as title sponsor for the Нови хоризонти gala dinner." } }),
    prisma.deal.create({ data: { title: "Efbet - Magazine Full Page Ad", companyId: efbet.id, contactId: contacts[17].id, stage: "closed_won", dealType: "advertising", valueEur: 8000, probability: 100, expectedCloseDate: new Date("2026-04-01"), createdById: admin.id } }),
    prisma.deal.create({ data: { title: "Palms Bet - СОХИДБ Membership", companyId: palmsBet.id, contactId: contacts[19].id, stage: "closed_won", dealType: "membership", valueEur: 5000, probability: 100, expectedCloseDate: new Date("2026-02-15"), createdById: admin.id } }),
    // Negotiation
    prisma.deal.create({ data: { title: "Superbet - Gold Sponsor Gala", companyId: superbet.id, contactId: contacts[0].id, stage: "negotiation", dealType: "sponsorship", valueEur: 30000, probability: 70, expectedCloseDate: new Date("2026-08-01"), createdById: admin.id, notes: "Sacha interested. Discussing brand visibility package." } }),
    prisma.deal.create({ data: { title: "Amusnet - Magazine Ad Campaign", companyId: amusnet.id, contactId: contacts[30].id, stage: "negotiation", dealType: "advertising", valueEur: 12000, probability: 65, expectedCloseDate: new Date("2026-07-15"), createdById: admin.id } }),
    // Proposal
    prisma.deal.create({ data: { title: "CT Gaming - Silver Sponsor", companyId: ctGaming.id, contactId: contacts[33].id, stage: "proposal", dealType: "sponsorship", valueEur: 15000, probability: 50, expectedCloseDate: new Date("2026-09-01"), createdById: admin.id, notes: "Proposal sent to Milo. Awaiting board review." } }),
    prisma.deal.create({ data: { title: "Pragmatic Play - Partnership Deal", companyId: pragmatic.id, contactId: contacts[37].id, stage: "proposal", dealType: "partnership", valueEur: 25000, probability: 45, expectedCloseDate: new Date("2026-09-15"), createdById: admin.id } }),
    // Discovery
    prisma.deal.create({ data: { title: "Kaizen Gaming - Betano Brand Placement", companyId: kaizen.id, contactId: contacts[3].id, stage: "discovery", dealType: "advertising", valueEur: 20000, probability: 30, expectedCloseDate: new Date("2026-10-01"), createdById: admin.id } }),
    prisma.deal.create({ data: { title: "OPAP - Regional Partnership", companyId: opap.id, contactId: contacts[4].id, stage: "discovery", dealType: "partnership", valueEur: 35000, probability: 25, expectedCloseDate: new Date("2026-11-01"), createdById: admin.id } }),
    // Initial Contact
    prisma.deal.create({ data: { title: "Mozzart Bet - Magazine Feature", companyId: mozzart.id, contactId: contacts[8].id, stage: "initial_contact", dealType: "advertising", valueEur: 6000, probability: 15, expectedCloseDate: new Date("2026-12-01"), createdById: admin.id } }),
    prisma.deal.create({ data: { title: "Meridianbet - Event Sponsorship", companyId: meridian.id, contactId: contacts[9].id, stage: "initial_contact", dealType: "sponsorship", valueEur: 10000, probability: 10, expectedCloseDate: new Date("2026-12-15"), createdById: admin.id } }),
    prisma.deal.create({ data: { title: "Digitain - Tech Partner", companyId: digitain.id, contactId: contacts[39].id, stage: "initial_contact", dealType: "partnership", valueEur: 18000, probability: 10, expectedCloseDate: new Date("2027-01-15"), createdById: admin.id } }),
    // Closed Lost
    prisma.deal.create({ data: { title: "Winbet - Rejected Sponsorship", companyId: winbet.id, contactId: contacts[21].id, stage: "closed_lost", dealType: "sponsorship", valueEur: 20000, probability: 0, notes: "Budget allocated elsewhere for 2026." } }),
  ])

  // Create stage history for deals
  for (const deal of deals) {
    await prisma.dealStageHistory.create({
      data: { dealId: deal.id, fromStage: null, toStage: deal.stage, changedById: admin.id, notes: "Initial stage" }
    })
  }
  // Add extra history for deals further in pipeline
  await prisma.dealStageHistory.create({ data: { dealId: deals[3].id, fromStage: "initial_contact", toStage: "discovery", changedById: admin.id, changedAt: new Date("2026-02-10"), notes: "Good initial call with Sacha" } })
  await prisma.dealStageHistory.create({ data: { dealId: deals[3].id, fromStage: "discovery", toStage: "proposal", changedById: admin.id, changedAt: new Date("2026-02-25"), notes: "Sent sponsorship deck" } })
  await prisma.dealStageHistory.create({ data: { dealId: deals[3].id, fromStage: "proposal", toStage: "negotiation", changedById: admin.id, changedAt: new Date("2026-03-10"), notes: "Negotiating terms" } })

  console.log(`Created ${deals.length} deals with stage history`)

  // ========== INTERACTIONS ==========
  const now = new Date()
  const daysAgo = (d: number) => new Date(now.getTime() - d * 86400000)

  await Promise.all([
    prisma.interaction.create({ data: { contactId: contacts[0].id, companyId: superbet.id, dealId: deals[3].id, type: "meeting", direction: "outbound", subject: "Sponsorship pitch meeting", content: "Met with Sacha at ICE London. Discussed Gold Sponsor package for the gala. Very interested.", outcome: "Positive - moving to proposal", occurredAt: daysAgo(45), createdById: admin.id } }),
    prisma.interaction.create({ data: { contactId: contacts[0].id, companyId: superbet.id, dealId: deals[3].id, type: "email", direction: "outbound", subject: "Follow-up: Sponsorship Deck", content: "Sent the full sponsorship proposal with pricing tiers and visibility options.", occurredAt: daysAgo(40), createdById: admin.id } }),
    prisma.interaction.create({ data: { contactId: contacts[0].id, companyId: superbet.id, dealId: deals[3].id, type: "call", direction: "inbound", subject: "Sacha call - budget discussion", content: "Sacha called to discuss budget. Wants to negotiate down from 30k. Mentioned Blackstone oversight on spending.", outcome: "Negotiating price", occurredAt: daysAgo(8), createdById: admin.id } }),
    prisma.interaction.create({ data: { contactId: contacts[3].id, companyId: kaizen.id, type: "linkedin", direction: "outbound", subject: "Connected on LinkedIn", content: "Sent connection request with intro message about Golden Spades magazine.", outcome: "Connection accepted", occurredAt: daysAgo(30), createdById: admin.id } }),
    prisma.interaction.create({ data: { contactId: contacts[3].id, companyId: kaizen.id, dealId: deals[7].id, type: "email", direction: "outbound", subject: "Golden Spades Magazine - Betano Feature", content: "Proposed a feature article on Betano's Balkan expansion for the inaugural issue.", occurredAt: daysAgo(15), createdById: admin.id } }),
    prisma.interaction.create({ data: { contactId: contacts[17].id, companyId: efbet.id, type: "meeting", direction: "outbound", subject: "СОХИДБ board meeting", content: "Discussed Efbet's role in the association and upcoming events.", outcome: "Strong relationship", occurredAt: daysAgo(20), createdById: admin.id } }),
    prisma.interaction.create({ data: { contactId: contacts[28].id, companyId: egt.id, dealId: deals[0].id, type: "meeting", direction: "outbound", subject: "Title Sponsor Confirmation", content: "Vladimir confirmed EGT as title sponsor. Signing ceremony at BEGE Expo.", outcome: "Deal closed", occurredAt: daysAgo(60), createdById: admin.id } }),
    prisma.interaction.create({ data: { contactId: contacts[33].id, companyId: ctGaming.id, dealId: deals[5].id, type: "email", direction: "outbound", subject: "Silver Sponsor Proposal", content: "Sent Silver Sponsor package to Milo Borissov with event details and brand placement options.", occurredAt: daysAgo(12), createdById: admin.id } }),
    prisma.interaction.create({ data: { contactId: contacts[30].id, companyId: amusnet.id, dealId: deals[4].id, type: "call", direction: "outbound", subject: "Magazine ad campaign discussion", content: "Discussed multi-page spread for Amusnet's new slot portfolio in the summer issue.", outcome: "Interested, reviewing internally", occurredAt: daysAgo(5), createdById: admin.id } }),
    prisma.interaction.create({ data: { contactId: contacts[40].id, companyId: agib.id, type: "meeting", direction: "outbound", subject: "AGIB-СОХИДБ cooperation meeting", content: "Met with Rossi McKee to discuss joint initiatives between AGIB and СОХИДБ.", outcome: "Will co-sponsor industry report", occurredAt: daysAgo(25), createdById: admin.id } }),
    prisma.interaction.create({ data: { contactId: contacts[14].id, companyId: novomatic.id, type: "email", direction: "inbound", subject: "NOVOMATIC Romania - Interest in membership", content: "Valentin-Adrian reached out about potential СОХИДБ membership and magazine advertising.", outcome: "Follow up scheduled", occurredAt: daysAgo(3), createdById: admin.id } }),
    prisma.interaction.create({ data: { contactId: contacts[37].id, companyId: pragmatic.id, dealId: deals[6].id, type: "email", direction: "outbound", subject: "Partnership Proposal - Content Supply", content: "Sent partnership deck to Julian about Pragmatic Play content integration for member casinos.", occurredAt: daysAgo(10), createdById: admin.id } }),
  ])

  console.log("Created 12 interactions")

  // ========== FOLLOW-UPS ==========
  await Promise.all([
    prisma.followUp.create({ data: { contactId: contacts[0].id, title: "Follow up on Superbet sponsorship negotiation", dueDate: new Date("2026-03-22"), priority: "critical", status: "pending", assignedToId: admin.id } }),
    prisma.followUp.create({ data: { contactId: contacts[3].id, title: "Send George article draft for review", dueDate: new Date("2026-03-25"), priority: "high", status: "pending", assignedToId: admin.id } }),
    prisma.followUp.create({ data: { contactId: contacts[33].id, title: "Check with Milo on Silver Sponsor decision", dueDate: new Date("2026-03-28"), priority: "high", status: "pending", assignedToId: admin.id } }),
    prisma.followUp.create({ data: { contactId: contacts[14].id, title: "Schedule call with NOVOMATIC Romania", dueDate: new Date("2026-03-20"), priority: "medium", status: "overdue", assignedToId: admin.id } }),
    prisma.followUp.create({ data: { contactId: contacts[30].id, title: "Follow up on Amusnet ad campaign", dueDate: new Date("2026-03-30"), priority: "medium", status: "pending", assignedToId: admin.id } }),
    prisma.followUp.create({ data: { contactId: contacts[8].id, title: "Send Mozzart Bet magazine media kit", dueDate: new Date("2026-04-05"), priority: "low", status: "pending", assignedToId: admin.id } }),
    prisma.followUp.create({ data: { contactId: contacts[28].id, title: "Finalize EGT sponsor branding assets", dueDate: new Date("2026-03-15"), priority: "high", status: "completed", assignedToId: admin.id, completedAt: new Date("2026-03-14") } }),
    prisma.followUp.create({ data: { contactId: contacts[19].id, title: "Send Palms Bet membership invoice", dueDate: new Date("2026-02-20"), priority: "medium", status: "completed", assignedToId: admin.id, completedAt: new Date("2026-02-18") } }),
  ])

  console.log("Created 8 follow-ups")

  // ========== GALA DINNER EVENT ==========
  const gala = await prisma.event.create({
    data: {
      name: "Нови хоризонти (New Horizons) Gala Dinner 2026",
      eventType: "gala_dinner",
      venue: "Hyatt Regency Hotel, Sofia",
      description: "Annual gala dinner bringing together the leaders of Bulgaria's gaming industry. Hosted by СОХИДБ, sponsored by EGT. Featuring keynote speakers, awards ceremony, and networking dinner. Dress code: Black tie.",
      startsAt: new Date("2026-11-24T19:00:00"),
      endsAt: new Date("2026-11-25T01:00:00"),
      maxCapacity: 200,
      dressCode: "Black Tie",
      status: "active",
      createdById: admin.id,
    }
  })

  // Event sponsors
  await Promise.all([
    prisma.eventSponsor.create({ data: { eventId: gala.id, companyId: egt.id, sponsorTier: "title", amountEur: 50000, notes: "Title sponsor. Logo on all materials." } }),
    prisma.eventSponsor.create({ data: { eventId: gala.id, companyId: superbet.id, sponsorTier: "gold", amountEur: 30000, notes: "Pending final confirmation." } }),
    prisma.eventSponsor.create({ data: { eventId: gala.id, companyId: ctGaming.id, sponsorTier: "silver", amountEur: 15000, notes: "Proposal stage." } }),
    prisma.eventSponsor.create({ data: { eventId: gala.id, companyId: amusnet.id, sponsorTier: "bronze", amountEur: 8000 } }),
  ])

  // Guest list - Bulgarian VIPs
  const guestData = [
    { contactIdx: 17, tier: "vip", table: 1 },       // Tsvetomir Naydenov - Efbet CEO
    { contactIdx: 18, tier: "vip", table: 1 },       // Boyan Naydenov - Efbet MD
    { contactIdx: 19, tier: "vip", table: 2 },       // Lachezar Petrov - Palms Bet CEO
    { contactIdx: 20, tier: "sponsor", table: 2 },   // Desislava Zaharieva - Palms Bet CMO
    { contactIdx: 21, tier: "vip", table: 3 },       // Dejan Isakovic - Winbet CEO
    { contactIdx: 22, tier: "vip", table: 3 },       // Tsvetin Yordanov - Betano BG
    { contactIdx: 23, tier: "vip", table: 4 },       // Millen Stamatov - Eurobet CEO
    { contactIdx: 24, tier: "member", table: 4 },    // Mihail Hadzhiev - Inbet CEO
    { contactIdx: 25, tier: "vip", table: 5 },       // Dencho Ganev - 8888.bg Owner
    { contactIdx: 26, tier: "sponsor", table: 5 },   // Alexander Lichev - 8888 CMO
    { contactIdx: 27, tier: "member", table: 6 },    // Ivan Nikolov - Sesame MD
    { contactIdx: 28, tier: "vip", table: 1 },       // Vladimir Dokov - EGT CEO (title sponsor)
    { contactIdx: 29, tier: "speaker", table: 1 },   // Nadia Popova - EGT CRO
    { contactIdx: 30, tier: "vip", table: 7 },       // Ivo Georgiev - Amusnet CEO
    { contactIdx: 31, tier: "sponsor", table: 7 },   // Irina Rusimova - Amusnet CSO
    { contactIdx: 32, tier: "media", table: 8 },     // Liliya Chatalbasheva - Amusnet CMO
    { contactIdx: 33, tier: "vip", table: 2 },       // Milo Borissov - CT Gaming CEO
    { contactIdx: 34, tier: "vip", table: 2 },       // Elena Shaterova - CT Gaming Chair
    { contactIdx: 40, tier: "vip", table: 9 },       // Rossi McKee - AGIB Chair
    { contactIdx: 41, tier: "vip", table: 9 },       // Milen Totev - СОХИДБ Chairman
    { contactIdx: 42, tier: "partner", table: 9 },   // Gavril Chetrafilov - СОХИДБ Vice-Chair
  ]

  const rsvpStatuses = ["confirmed", "confirmed", "confirmed", "confirmed", "confirmed", "tentative", "confirmed", "confirmed", "pending", "pending", "confirmed", "confirmed", "confirmed", "confirmed", "tentative", "confirmed", "pending", "confirmed", "confirmed", "confirmed", "confirmed"]

  for (let i = 0; i < guestData.length; i++) {
    const g = guestData[i]
    const contact = contacts[g.contactIdx]
    await prisma.eventGuest.create({
      data: {
        eventId: gala.id,
        contactId: contact.id,
        guestName: `${contact.firstName} ${contact.lastName}`,
        guestEmail: contact.email,
        tier: g.tier,
        tableNumber: g.table,
        rsvpStatus: rsvpStatuses[i],
        rsvpRespondedAt: rsvpStatuses[i] !== "pending" ? daysAgo(Math.floor(Math.random() * 30) + 5) : null,
        plusOne: i < 5, // First 5 VIPs have plus ones
        plusOneName: i < 5 ? `Guest of ${contact.firstName}` : null,
        dietaryRequirements: i === 2 ? "Vegetarian" : i === 7 ? "No shellfish" : null,
      }
    })
  }

  console.log(`Created gala event with ${guestData.length} guests and 4 sponsors`)

  console.log("\n✅ Seed complete!")
  console.log("Login: admin@goldenspades.com / admin123")
}

main()
  .then(async () => { await prisma.$disconnect() })
  .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1) })
