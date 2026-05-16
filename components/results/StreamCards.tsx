import type { RevenueResults } from '@/lib/types'

const fmtM = (n: number) => `$${(n / 1_000_000).toFixed(2)}M`

const STREAM_META = [
  { key: 'subscriptions', icon: '👑', label: 'Subscriptions', desc: 'Monthly and annual tiers from Star to Elite Partner' },
  { key: 'predictions', icon: '🎯', label: 'Predictions', desc: 'Fans pay to enter match outcome prediction contests each game' },
  { key: 'virtualGifts', icon: '🎁', label: 'Virtual Gifts', desc: 'TikTok-style gifting during live match streams — players earn 30%' },
  { key: 'merchandise', icon: '👕', label: 'Merchandise', desc: 'Official club gear with 48% platform margin per sale' },
  { key: 'tokenFees', icon: '🪙', label: 'Token Economy', desc: '0.78% fee on all in-app token transactions across streams' },
  { key: 'digitalCards', icon: '🃏', label: 'Digital Cards', desc: 'Club-branded collectible cards redeemable via earned tokens' },
] as const

interface Props { results: RevenueResults; primaryColor: string }

export default function StreamCards({ results, primaryColor }: Props) {
  const sorted = [...STREAM_META].sort((a, b) =>
    (results[b.key as keyof RevenueResults] as number) - (results[a.key as keyof RevenueResults] as number)
  )

  return (
    <div>
      <h3 className="text-base font-bold text-slate-900 mb-4">Revenue Streams Breakdown</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {sorted.map((s, i) => {
          const value = results[s.key as keyof RevenueResults] as number
          const pct = value / results.grossRevenue
          return (
            <div key={s.key} className="border border-slate-100 rounded-2xl p-4 bg-white">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{s.icon}</span>
                  <span className="text-sm font-semibold text-slate-900">{s.label}</span>
                </div>
                <span className="text-base font-black text-slate-900">{fmtM(value)}</span>
              </div>
              <p className="text-xs text-slate-500 mb-3 leading-relaxed">{s.desc}</p>
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${pct * 100}%`, background: i === 0 ? primaryColor : '#e2e8f0' }}
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1">{(pct * 100).toFixed(0)}% of gross revenue</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
