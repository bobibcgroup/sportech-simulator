import type { RevenueResults } from '@/lib/types'

const fmtM = (n: number) =>
  n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(2)}M` : `$${(n / 1_000).toFixed(0)}K`

const STREAM_META = [
  { key: 'subscriptions', icon: '👑', label: 'Subscriptions', desc: 'Monthly and annual tiers from Star to Elite Partner' },
  { key: 'predictions', icon: '🎯', label: 'Predictions', desc: 'Fans pay to enter match outcome prediction contests each game' },
  { key: 'virtualGifts', icon: '🎁', label: 'Virtual Gifts', desc: 'TikTok-style gifting during live match streams — players earn 30%' },
  { key: 'merchandise', icon: '👕', label: 'Merchandise', desc: 'Official club gear with platform margin per sale' },
  { key: 'tokenFees', icon: '🪙', label: 'Token Economy', desc: '0.78% fee on all in-app token transactions across streams' },
  { key: 'digitalCards', icon: '🃏', label: 'Digital Cards', desc: 'Club-branded collectible cards redeemable via earned tokens' },
] as const

interface Props { results: RevenueResults }

export default function StreamCards({ results }: Props) {
  const sorted = [...STREAM_META].sort((a, b) =>
    (results[b.key as keyof RevenueResults] as number) - (results[a.key as keyof RevenueResults] as number)
  )

  return (
    <div>
      <p className="text-xs uppercase tracking-widest font-semibold mb-4" style={{ color: 'var(--muted)' }}>
        Revenue Streams
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {sorted.map((s, i) => {
          const value = results[s.key as keyof RevenueResults] as number
          const pct = results.grossRevenue > 0 ? value / results.grossRevenue : 0
          return (
            <div
              key={s.key}
              className="rounded-xl p-4"
              style={{ background: 'var(--surface-card)', border: '1px solid var(--hairline)' }}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{s.icon}</span>
                  <span className="text-sm font-semibold" style={{ color: 'var(--body-strong)' }}>{s.label}</span>
                </div>
                <span className="text-base font-black" style={{ color: i === 0 ? 'var(--primary)' : 'var(--ink)' }}>
                  {fmtM(value)}
                </span>
              </div>
              <p className="text-xs leading-relaxed mb-3" style={{ color: 'var(--muted)' }}>{s.desc}</p>
              <div className="h-1 rounded-full" style={{ background: 'var(--hairline-strong)' }}>
                <div
                  className="h-full rounded-full"
                  style={{ width: `${pct * 100}%`, background: i === 0 ? 'var(--primary)' : 'var(--hairline-strong)', opacity: i === 0 ? 1 : 0.6 }}
                />
              </div>
              <p className="text-[10px] mt-1" style={{ color: 'var(--muted-soft)' }}>{(pct * 100).toFixed(0)}% of gross</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
