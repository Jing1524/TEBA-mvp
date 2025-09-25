// lib/csv-contract.ts
import { z } from 'zod'

/** Make a Date at midnight UTC for a YYYY-MM-DD string. */
function toUtcDateOnly(yyyyMmDd: string): Date {
  return new Date(`${yyyyMmDd}T00:00:00Z`)
}

/**
 * RowSchema:
 * - trims strings
 * - validates YYYY-MM-DD
 * - parses amount (handles commas, spaces, leading '+')
 * - converts posted_at -> Date (midnight UTC)
 * - converts amount    -> number
 */
export const RowSchema = z.object({
  account: z
    .string()
    .transform((s) => s.trim())
    .pipe(z.string().min(1, 'account is required')),

  posted_at: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'YYYY-MM-DD required')
    .transform((s) => toUtcDateOnly(s)),

  amount: z.string().transform((val, ctx) => {
    const cleaned = val.replace(/,/g, '').trim() // "1,234.56" => "1234.56"
    const n = Number.parseFloat(cleaned) // handles "+12.3", "-54.12"
    if (Number.isNaN(n)) {
      ctx.addIssue({ code: 'custom', message: 'amount not a number' })
      return z.NEVER
    }
    return n
  }),

  direction: z.enum(['debit', 'credit']),

  description: z
    .string()
    .transform((s) => s.trim())
    .pipe(z.string().min(1, 'description is required')),
})

/** Parsed/validated row after Zod: note posted_at is Date, amount is number. */
export type RawRow = z.infer<typeof RowSchema>

/** What the app uses post-normalization (MVP convention + auditing flags). */
export type NormalizedRow = {
  accountCode: string
  postedAt: Date // date-only (midnight UTC)
  amountCents: number // signed via direction rule
  direction: 'debit' | 'credit'
  rawDescription: string
  isInconsistent: boolean // CSV numeric sign vs direction
  originalAmountCents: number // before we enforced direction sign
}

/**
 * normalizedRow:
 * - direction drives the sign (debit => -, credit => +)
 * - rounds to integer cents
 * - flags inconsistencies between CSV sign and direction
 */
export const normalizedRow = (row: RawRow): NormalizedRow => {
  const csvAmountCents = Math.round(row.amount * 100) // keep original sign for audit
  const absCents = Math.abs(csvAmountCents)

  const amountCents = row.direction === 'debit' ? -absCents : +absCents

  const csvWasNegative = csvAmountCents < 0
  const expectedNegative = row.direction === 'debit'
  const isInconsistent = csvWasNegative !== expectedNegative

  return {
    accountCode: row.account,
    postedAt: row.posted_at, // already a Date (midnight UTC) from Zod transform
    amountCents,
    direction: row.direction,
    rawDescription: row.description,
    isInconsistent,
    originalAmountCents: csvAmountCents,
  }
}
