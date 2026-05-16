import type { RevenueResults } from '@/lib/types'

const fmtM = (n: number) =>
  n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(2)}M` : `$${(n / 1_000).toFixed(0)}K`

const STREAM_META = [
  { key: 'subscriptions',    icon: '👑', label: 'Subscriptions',       desc: 'Recurring fan tiers from free to Elite Partner' },
  { key: 'predictions',      icon: '🎯', label: 'Predictions',          desc: 'Sharia-compliant match outcome contests using platform tokens' },
  { key: 'virtualGifts',    icon: '🎁', label: 'Live Gifting',          desc: 'TikTok-style fan gifting during live match streams' },
  { key: 'merchandise',     icon: '👕', label: 'Merchandise',           desc: 'Official club gear — jerseys, editions, accessories' },
  { key: 'digitalCards',    icon: '🃏', label: 'Digital Gift Cards',    desc: 'Club-branded cards accepted at 150,000+ stores globally' },
  { key: 'voting',          icon: '🗳️', label: 'Interactive Voting',    desc: 'Fans vote on tactics and substitutions — premium tiers carry more voting weight' },
  { key: 'tickets',         icon: '🎟️', label: 'Tickets',               desc: 'In-app ticket sales and peer-to-peer resale, platform earns commission' },
  { key: 'nftCollectibles', icon: '✨', label: 'NFT & Collectibles',    desc: 'Digital trading cards, rare player tokens, and seasonal drops' },
] as const

const STREAM_COLORS = [
  '#f0c040', '#4ade80', '#60a5fa', '#fb923c',
  '#a78bfa', '#f87171', '#34d399', '#e879f9',
]

interface Props { results: RevenueResults }

export default function StreamCards({ results }: Props) {
  const sorted = [...STREAM_META].sort((a, b) =>
    (results[b.key as keyof RevenueResults] as number) - (results[a.key as keyof RevenueResults] as number)
  )
  const gross = results.grossRevenue || 1

  return (
    <div>
      <p className="text-xs uppercase tracking-widest font-semibold mb-4" style={{ color: 'var(--muted)' }}>
        Revenue Streams
      </p>

      {/* Stacked allocation bar */}
      <div className="flex h-3 rounded-lg overflow-hidden mb-3">
        {sorted.map((s, i) => {
          const value = results[s.key as keyof RevenueResults] as number
          const pct = (value / gross) * 100
          return (
            <div
              key={s.key}
              style={{ width: `${pct}%`, background: STREAM_COLORS[i], minWidth: pct > 0.3 ? 2 : 0 }}
            />
          )
        })}
      </div>

      {/* Color legend */}
      <div className="flex flex-wrap gap-x-4 gap-y-1.5 mb-5">
        {sorted.map((s, i) => (
          <div key={s.key} className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full shrink-0" style={{ background: STREAM_COLORS[i] }} />
            <span className="text-[10px]" style={{ color: 'var(--muted)' }}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Ranked list */}
      <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--hairline)' }}>
        {sorted.map((s, i) => {
          const value = results[s.key as keyof RevenueResults] as number
          const pct = value / gross
          return (
            <div
              key={s.key}
              className="flex items-center gap-3 px-4 py-3"
              style={{
                borderBottom: i < sorted.length - 1 ? '1px solid var(--hairline)' : undefined,
                background: 'var(--surface-card)',
              }}
            >
              <div className="w-1 self-stretch rounded-full shrink-0" style={{ background: STREAM_COLORS[i] }} />
              <span className="text-base w-5 shrink-0">{s.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold" style={{ color: 'var(--body-strong)' }}>{s.label}</p>
                <p className="text-[11px] leading-tight mt-0.5" style={{ color: 'var(--muted)' }}>{s.desc}</p>
              </div>
              <div className="text-right shrink-0 pl-2">
                <p className="text-sm font-black" style={{ color: i === 0 ? 'var(--primary)' : 'var(--ink)' }}>
                  {fmtM(value)}
                </p>
                <p className="text-[10px]" style={{ color: 'var(--muted-soft)' }}>
                  {(pct * 100).toFixed(0)}% of gross
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
