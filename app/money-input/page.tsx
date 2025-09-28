// app/money-demo/MoneyDemo.tsx
'use client'
import { useState } from 'react'
import { MoneyInput } from '@/app/money-input/components/money-input'
import { UsdCents } from '@/app/money-input/lib/money'

export default function MoneyInputDemo() {
  const [value, setValue] = useState<UsdCents | null>(null)
  const error = value === null ? 'Enter a valid amount with at most 2 decimals.' : null
  console.log('MoneyInputDemo render', { value })
  return (
    <div className="max-w-md p-6">
      <MoneyInput
        label="Amount"
        description="Type $ or commas as you like. Use ↑/↓ to adjust by 1¢."
        valueCents={value}
        onChange={setValue}
        error={error}
      />

      <div className="mt-4 text-sm opacity-80">Internal cents: {value ?? '(null)'}</div>
    </div>
  )
}
