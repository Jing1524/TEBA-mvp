import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const categories = [
    { code: 'groceries', name: 'Groceries' },
    { code: 'rent', name: 'Rent' },
    { code: 'dining', name: 'Dining' },
    { code: 'transport', name: 'Transport' },
    { code: 'utilities', name: 'Utilities' },
    { code: 'shopping', name: 'Shopping' },
    { code: 'health', name: 'Health' },
    { code: 'travel', name: 'Travel' },
    { code: 'income', name: 'Income' },
    { code: 'other', name: 'Other' },
  ]

  for (const c of categories) {
    await prisma.category.upsert({
      where: { code: c.code },
      update: {},
      create: c,
    })
  }

  console.log('Seeded categories ✅')
}

main().finally(async () => prisma.$disconnect())
