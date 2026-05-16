'use client'
import type { RevenueResults } from '@/lib/types'

const fmtM = (n: number) =>
  n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(1)}M` : `$${(n / 1_000).toFixed(0)}K`

interface Props { results: RevenueResults; primaryColor: string; secondaryColor: string }

export default function RevenueBarChart({ results, primaryColor, secondaryColor }: Props) {
  const rows = [
    { name: 'Subscriptions', value: results.subscriptions },
    { name: 'Predictions', value: results.predictions },
    { name: 'Virtual Gifts', value: results.virtualGifts },
    { name: 'Merchandise', value: results.merchandise },
    { name: 'Tokens', value: results.tokenFees },
    { name: 'Digital Cards', value: results.digitalCards },
  ].sort((a, b) => b.value - a.value)

  const max = rows[0]?.value || 1

  return (
    <div>
      <p className="text-xs uppercase tracking-widest font-semibold mb-4" style={{ color: 'var(--muted)' }}>Revenue by Stream</p>
      <div className="space-y-3">
        {rows.map((row, i) => {
          const pct = (row.value / max) * 100
          const color = i === 0 ? primaryColor : i === 1 ? secondaryColor : 'var(--hairline-strong)'
          return (
            <div key={row.name} className="flex items-center gap-3">
              <span className="text-xs w-24 shrink-0 text-right" style={{ color: 'var(--muted)' }}>{row.name}</span>
              <div className="flex-1 h-6 rounded-md overflow-hidden" style={{ background: 'var(--surface-soft)' }}>
                <div
                  className="h-full rounded-md transition-all"
                  style={{ width: `${pct}%`, background: color, minWidth: 4 }}
                />
              </div>
              <span className="text-xs font-bold w-16 shrink-0" style={{ color: 'var(--ink)' }}>{fmtM(row.value)}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
