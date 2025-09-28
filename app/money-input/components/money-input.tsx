'use client'
import { ChangeEventHandler, useEffect, useId, useMemo, useRef, useState } from 'react'
import { UsdCents, parseMoneyToCents, formatCentsToMoney } from '@/app/money-input/lib/money'
import { on } from 'events'

type MoneyInputProps = {
  id?: string
  label: string
  valueCents: UsdCents | null
  onChange: (value: UsdCents | null) => void
  description?: string
  required?: boolean
  stepCents?: number // default 1 (one cent)
  error?: string | null
}

export function MoneyInput({
  id,
  label,
  valueCents,
  onChange,
  description,
  required,
  stepCents = 1,
  error,
}: MoneyInputProps) {
  const inputId = useId()
  const descId = `${inputId}-desc`
  const errId = `${inputId}-err`
  const [text, setText] = useState<string>('')

  useEffect(() => {
    if (valueCents !== null) {
      setText(formatCentsToMoney(valueCents))
    }
  }, [valueCents])

  const liveMsg = useMemo(() => error ?? '', [error])
  const inputRef = useRef<HTMLInputElement>(null)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const next = e.target.value
    console.log('handleChange', { next })
    setText(next)
    console.log('handleChange setText', { text })
    const cents = parseMoneyToCents(next)
    onChange(cents) // may be null while typing → caller can validate/disable submit
  }

  function handleBlur() {
    const trimmed = text.trim()
    if (trimmed === '') {
      onChange(null)
      return
    }
    const cents = parseMoneyToCents(text)
    if (cents != null) {
      // snap to canonical formatting on blur
      setText(formatCentsToMoney(cents))
      onChange(cents)
    }
  }

  function bump(delta: number) {
    const base = valueCents ?? 0
    const stepped = (base as number) + delta
    const clamped = Math.max(-(10 ** 11), Math.min(10 ** 11, stepped)) // arbitrary guard
    onChange(clamped as UsdCents)
    // show formatted immediately
    setText(formatCentsToMoney(clamped as UsdCents))
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      bump(stepCents)
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      bump(-stepCents)
    }
  }

  const describedBy =
    [description ? descId : null, error ? errId : null].filter(Boolean).join(' ') || undefined

  return (
    <div>
      <label htmlFor={inputId} className="block font-medium mb-1">
        {label}
        {required ? ' *' : ''}
      </label>
      <input
        ref={inputRef}
        id={inputId}
        inputMode="decimal"
        autoComplete="off"
        value={text}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={onKeyDown}
        aria-invalid={!!error}
        aria-describedby={describedBy}
        className="w-full rounded-xl border px-3 py-2"
        placeholder="$0.00"
      />
      {description && (
        <div id={descId} className="text-sm text-gray-500 mt-1">
          {description}
        </div>
      )}
      <div id={errId} aria-live="polite" className="text-sm text-red-600 mt-1">
        {liveMsg}
      </div>
    </div>
  )
}
