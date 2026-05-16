'use client'
import type { RevenueResults } from '@/lib/types'

const fmtM = (n: number) =>
  n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(1)}M` : `$${(n / 1_000).toFixed(0)}K`

const STREAM_COLORS = [
  '#f0c040', '#4ade80', '#60a5fa', '#fb923c',
  '#a78bfa', '#f87171', '#34d399', '#e879f9',
]

interface Props { results: RevenueResults; primaryColor: string; secondaryColor: string }

export default function RevenueBarChart({ results }: Props) {
  const rows = [
    { name: 'Subscriptions',       value: results.subscriptions },
    { name: 'Predictions',         value: results.predictions },
    { name: 'Live Gifting',        value: results.virtualGifts },
    { name: 'Merchandise',         value: results.merchandise },
    { name: 'Digital Gift Cards',  value: results.digitalCards },
    { name: 'Interactive Voting',  value: results.voting },
    { name: 'Tickets',             value: results.tickets },
    { name: 'NFT & Collectibles',  value: results.nftCollectibles },
  ].sort((a, b) => b.value - a.value)

  const max = rows[0]?.value || 1

  return (
    <div>
      <p className="text-xs uppercase tracking-widest font-semibold mb-4" style={{ color: 'var(--muted)' }}>Revenue by Stream</p>
      <div className="space-y-2.5">
        {rows.map((row, i) => {
          const pct = (row.value / max) * 100
          return (
            <div key={row.name} className="flex items-center gap-3">
              <span className="text-xs w-28 shrink-0 text-right truncate" style={{ color: 'var(--muted)' }}>{row.name}</span>
              <div className="flex-1 h-5 rounded-md overflow-hidden" style={{ background: 'var(--surface-soft)' }}>
                <div
                  className="h-full rounded-md"
                  style={{ width: `${pct}%`, background: STREAM_COLORS[i], minWidth: 4 }}
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
