'use server'

import { prisma } from '@/lib/db'
import { RowSchema, normalizedRow, type RawRow, type NormalizedRow } from '@/lib/csv-contract'
import { Prisma } from '@prisma/client'

type ParsedRow = Record<string, string>

export const ingestCsvAction = async (rows: ParsedRow[]) => {
  // 1) Validate each CSV row (Zod transforms amount→number, posted_at→Date)
  const validated: RawRow[] = rows.map((r, idx) => {
    const parsed = RowSchema.safeParse(r)
    if (!parsed.success) {
      // surface all issues for that row
      throw new Error(
        `Row ${idx + 1} invalid: ${parsed.error.issues.map((i) => i.message).join(', ')}`
      )
    }
    return parsed.data
  })

  // 2) Normalize to our internal shape (direction → sign, cents, flags)
  const normalized: NormalizedRow[] = validated.map(normalizedRow)

  // 3) Resolve account codes → account IDs
  const accountCodeList = Array.from(new Set(normalized.map((n) => n.accountCode)))
  const accounts = await prisma.account.findMany({
    where: { code: { in: accountCodeList } },
    select: { id: true, code: true },
  })
  const codeToId: Map<string, string> = new Map(
    accounts.map((a: { code: string; id: string }) => [a.code, a.id])
  )

  // Reject unknown accounts (MVP policy)
  const missing = accountCodeList.filter((c) => !codeToId.has(c))
  if (missing.length) {
    throw new Error(`Unknown account codes: ${missing.join(', ')}`)
  }

  // 4) Build rows for insert
  const txRows: Prisma.TransactionCreateManyInput[] = normalized.map((n) => ({
    accountId: codeToId.get(n.accountCode)!,
    postedAt: n.postedAt, // Date (pairs with @db.Date)
    amountCents: n.amountCents, // signed via direction
    direction: n.direction, // no cast needed; string union matches Prisma enum
    rawDescription: n.rawDescription,
  }))

  // Optional: compute a quick inconsistency count for audit
  const inconsistentCount = normalized.reduce((acc, r) => acc + (r.isInconsistent ? 1 : 0), 0)

  // 5) Insert + Outbox in one DB transaction
  const ids = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    // a) bulk insert with idempotency (unique key + skipDuplicates)
    await tx.transaction.createMany({
      data: txRows,
      skipDuplicates: true,
    })

    // b) fetch the IDs for the whole set (both existing + newly inserted)
    //    NOTE: for very large batches, chunk this OR query.
    const found = await tx.transaction.findMany({
      where: {
        OR: txRows.map((t) => ({
          accountId: t.accountId,
          postedAt: t.postedAt,
          amountCents: t.amountCents,
          rawDescription: t.rawDescription,
        })),
      },
      select: { id: true },
    })
    const idsAll = found.map((x) => x.id)

    // c) write outbox event
    await tx.outboxEvent.create({
      data: {
        kind: 'tx.ingested',
        payload: {
          ids: idsAll,
          meta: {
            totalRows: normalized.length,
            inconsistentCount,
          },
        },
      },
    })

    return idsAll
  })

  return { count: ids.length, inconsistentCount }
}

// const const ingestCsvFromForm = async(formData: FormData) => {
//   const file = formData.get('file')
// }
