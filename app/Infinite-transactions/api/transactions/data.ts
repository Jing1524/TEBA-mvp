// Server-only in-memory store for the interview challenge
export type Tx = {
  id: string
  merchant: string
  amountCents: number
  date: string // ISO
  reviewed: boolean
}

const MERCHANTS = [
  'Ramp',
  'OpenSea',
  'Stripe',
  'Snowflake',
  'Figma',
  'GitHub',
  'Vercel',
  'Notion',
  'Datadog',
  'Cloudflare',
  'Okta',
  'Atlassian',
  'Slack',
  'Twilio',
]

let STORE: Tx[] | null = null

function init() {
  if (STORE) return
  const out: Tx[] = []
  const now = Date.now()
  for (let i = 0; i < 10_000; i++) {
    const amt = (Math.floor(Math.random() * 100_000) + 50) * (Math.random() < 0.1 ? -1 : 1)
    const d = new Date(now - (i * 86_400_000) / 5)
    out.push({
      id: `tx_${i}`,
      merchant: MERCHANTS[i % MERCHANTS.length],
      amountCents: amt,
      date: d.toISOString(),
      reviewed: Math.random() < 0.2,
    })
  }
  STORE = out
}
init()

export type Page = { items: Tx[]; nextCursor: number | null }

export function getPage(cursor = 0, limit = 30): Page {
  init()
  const start = cursor
  const end = Math.min(start + limit, STORE!.length)
  const items = STORE!.slice(start, end)
  const nextCursor = end < STORE!.length ? end : null
  return { items, nextCursor }
}

export function markReviewed(id: string) {
  init()
  const tx = STORE!.find((t) => t.id === id)
  if (tx) tx.reviewed = true
  return !!tx
}
