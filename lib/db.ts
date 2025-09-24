import { PrismaClient } from '@prisma/client'

//In dev, Next.js reloads on every file change. Without the globalThis guard, each reload spawns a new PrismaClient, which can quickly exhaust DB connections.
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['query', 'error', 'warn'], // optional, remove in production to reduce noice
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
