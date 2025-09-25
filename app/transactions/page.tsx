import { prisma } from '@/lib/db'

export default async function TransactionsPage() {
  const txs = await prisma.transaction.findMany({
    orderBy: [{ postedAt: 'desc' }, { id: 'desc' }],
    take: 20,
  })

  return (
    <div style={{ padding: 16 }}>
      <p>Found {txs.length} transactions</p>
      {txs.length === 0 ? (
        <p>No transactions yet. Try POST /api/tx-test or run your CSV ingest.</p>
      ) : (
        <ul>
          {txs.map((t) => (
            <li key={t.id}>
              {t.postedAt.toISOString().slice(0, 10)} — {t.rawDescription} — {t.amountCents / 100}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
