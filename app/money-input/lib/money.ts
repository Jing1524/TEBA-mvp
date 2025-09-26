export type Brand<T, B> = T & { __brand: B }
export type UsdCents = Brand<number, 'USD_CENTS'>

const CURRENCY_SYMS = /[\$\u00A3\u20AC\u00A5]/g // $, £, €, ¥
const NON_DIGIT_EXCEPT_DOT_MINUS = /[^0-9\.\-]/g

// Heuristic: if string has a single comma and no dot, treat comma as decimal.
function normalizeDecimalSeparator(raw: string): string {
  const s = raw.trim()
  const hasDot = s.includes('.')
  const commaCount = (s.match(/,/g) ?? []).length
  if (!hasDot && commaCount === 1) {
    return s.replace(',', '.')
  }
  // otherwise remove all commas as thousand separators
  return s.replace(/,/g, '')
}

/**
 * Parse a user-facing money string to USD cents.
 * Returns null if invalid (NaN or >2 decimal digits).
 */
export function parseMoneyToCents(input: string): UsdCents | null {
  if (input == null) return null
  let s = input.replace(CURRENCY_SYMS, '')
  s = normalizeDecimalSeparator(s)
  s = s.replace(NON_DIGIT_EXCEPT_DOT_MINUS, '')

  // keep only the first minus and first dot
  const firstMinus = s.indexOf('-')
  if (firstMinus > 0)
    s = s.replace(/-/g, '') // minus must be at start
  else if (firstMinus === 0) s = '-' + s.slice(1).replace(/-/g, '')
  const firstDot = s.indexOf('.')
  if (firstDot !== -1) s = s.slice(0, firstDot + 1) + s.slice(firstDot + 1).replace(/\./g, '')

  if (s === '' || s === '-' || s === '.' || s === '-.') return null

  const [intPart, decPartRaw = ''] = s.split('.')
  if (decPartRaw.length > 2) return null // disallow 3+ decimals

  const decPart = (decPartRaw + '00').slice(0, 2) // pad to 2
  const sign = intPart.startsWith('-') ? -1 : 1
  const intAbs = intPart.replace('-', '') || '0'

  // Avoid FP: compose cents via strings
  const cents = sign * (Number(intAbs) * 100 + Number(decPart))
  if (!Number.isFinite(cents)) return null
  return cents as UsdCents
}

const USD_FORMATTER = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

/** Format cents → "$1,234.56" */
export function formatCentsToMoney(cents: UsdCents | number): string {
  const n = (cents ?? 0) as number
  return USD_FORMATTER.format(n / 100)
}
