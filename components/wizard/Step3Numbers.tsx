'use client'
import { useState } from 'react'
import RangeSlider from '@/components/ui/RangeSlider'
import type { WizardData } from '@/lib/types'
import { calculate } from '@/lib/calculations'

const fmt = (n: number) =>
  n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1)}M`
  : n >= 1_000 ? `${(n / 1_000).toFixed(0)}K`
  : String(n)

const fmtPct = (n: number) => `${Math.round(n * 100)}%`
const fmtUSD = (n: number) =>
  n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(2)}M`
  : n >= 1_000 ? `$${(n / 1_000).toFixed(0)}K`
  : `$${n.toFixed(0)}`

const SPEND_OPTIONS = [
  {
    level: 'low' as const,
    icon: '🌍',
    label: 'Low',
    range: '$5–20 avg/active fan/yr',
    desc: 'Emerging markets',
  },
  {
    level: 'standard' as const,
    icon: '⚖️',
    label: 'Standard',
    range: '$10–40 avg/active fan/yr',
    desc: 'Established markets',
  },
  {
    level: 'high' as const,
    icon: '💎',
    label: 'High',
    range: '$17–70 avg/active fan/yr',
    desc: 'Premium markets',
  },
]

interface Props { data: WizardData; update: (p: Partial<WizardData>) => void; onNext: () => void; onBack: () => void }

export default function Step3Numbers({ data, update, onNext, onBack }: Props) {
  const [showBreakdown, setShowBreakdown] = useState(false)
  const results = calculate(data)

  const streams = [
    { label: 'Subscriptions',      value: results.subscriptions },
    { label: 'Predictions',        value: results.predictions },
    { label: 'Live Gifting',       value: results.virtualGifts },
    { label: 'Merchandise',        value: results.merchandise },
    { label: 'Gift Cards',         value: results.digitalCards },
    { label: 'Voting',             value: results.voting },
    { label: 'Tickets',            value: results.tickets },
    { label: 'NFTs',               value: results.nftCollectibles },
  ]

  return (
    <div className="w-full space-y-5 animate-in">

      {/* Live revenue callout */}
      <div className="rounded-xl p-4 text-center" style={{ background: 'var(--surface-card)', border: '1px solid var(--hairline)' }}>
        <p className="text-xs uppercase tracking-widest mb-1" style={{ color: 'var(--muted)' }}>
          Estimated Revenue Potential (Up to)
        </p>
        <p className="text-4xl font-black" style={{ color: 'var(--primary)' }}>
          {fmtUSD(results.year1)}
          <span className="text-sm font-normal ml-1" style={{ color: 'var(--muted)' }}>/yr</span>
        </p>
        <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>
          {fmt(results.tiers.totalActive)} active users · {fmt(results.tiers.totalPaid)} paid subscribers
        </p>
        <p className="text-[11px] mt-2 px-2" style={{ color: 'var(--muted-soft)' }}>
          * Illustrative estimate. Actual revenue depends on deal terms, platform adoption, fan engagement, and market conditions.
        </p>
      </div>

      {/* Sliders */}
      <RangeSlider
        label="Global Fan Base"
        value={data.fanBase}
        min={50_000} max={200_000_000} step={50_000}
        format={fmt}
        onChange={v => update({ fanBase: v })}
        hint="Total worldwide fans for your club or organisation"
      />

      <RangeSlider
        label="Platform Adoption"
        value={data.adoptionPct}
        min={0.01} max={1.0} step={0.01}
        format={fmtPct}
        onChange={v => update({ adoptionPct: v })}
        hint="% of fans who download and actively use the app — varies by region and engagement strategy"
      />

      <RangeSlider
        label="Premium Tier Mix"
        value={data.premiumMix}
        min={0.01} max={1.0} step={0.01}
        format={fmtPct}
        onChange={v => update({ premiumMix: v })}
        hint="% of active users on a paid subscription — depends on pricing, content, and market"
      />

      <RangeSlider
        label="Games Per Season"
        value={data.gamesPerSeason}
        min={1} max={80} step={1}
        format={v => `${v} game${v === 1 ? '' : 's'}`}
        onChange={v => update({ gamesPerSeason: v })}
        hint="Total home + away matches per season (all competitions)"
      />

      {/* Spending level */}
      <div>
        <label className="block text-sm font-semibold mb-1" style={{ color: 'var(--body-strong)' }}>
          Average Fan Spending Power
        </label>
        <p className="text-xs mb-3" style={{ color: 'var(--muted)' }}>
          Reflects digital purchasing behaviour in your market
        </p>
        <div className="grid grid-cols-3 gap-2">
          {SPEND_OPTIONS.map(opt => {
            const active = data.spendLevel === opt.level
            return (
              <button
                key={opt.level}
                type="button"
                onClick={() => update({ spendLevel: opt.level })}
                className="py-3 px-2 rounded-lg text-left transition-all"
                style={{
                  background: active ? 'var(--primary)' : 'var(--surface-card)',
                  color: active ? 'var(--on-primary)' : 'var(--body)',
                  border: active ? '1px solid var(--primary)' : '1px solid var(--hairline)',
                }}
              >
                <div className="text-base mb-1">{opt.icon}</div>
                <div className="text-xs font-bold">{opt.label}</div>
                <div className="text-[10px] mt-0.5 opacity-80">{opt.range}</div>
                <div className="text-[10px] opacity-60">{opt.desc}</div>
              </button>
            )
          })}
        </div>
        <p className="text-[11px] mt-2" style={{ color: 'var(--muted-soft)' }}>
          * Revenue share and per-fan figures are subject to agreed deal terms and actual user behaviour.
        </p>
      </div>

      {/* Numbers breakdown toggle */}
      <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--hairline)' }}>
        <button
          type="button"
          onClick={() => setShowBreakdown(v => !v)}
          className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold transition-all"
          style={{ background: 'var(--surface-card)', color: 'var(--body-strong)' }}
        >
          <span>Revenue breakdown</span>
          <span style={{ color: 'var(--primary)' }}>{showBreakdown ? '▲ Hide' : '▼ Show'}</span>
        </button>

        {showBreakdown && (
          <div className="px-4 pb-4 pt-3 space-y-3" style={{ background: 'var(--surface-soft)' }}>
            {/* Tier users */}
            <div>
              <p className="text-xs uppercase tracking-widest mb-2" style={{ color: 'var(--muted)' }}>Audience tiers</p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Free Fans', value: fmt(results.tiers.freeFans) },
                  { label: 'Stars', value: fmt(results.tiers.paidStars) },
                  { label: 'SuperStars', value: fmt(results.tiers.paidSuperStars) },
                  { label: 'Partners', value: fmt(results.tiers.paidPartners) },
                ].map(t => (
                  <div key={t.label} className="rounded-lg p-3" style={{ background: 'var(--surface-card)' }}>
                    <p className="text-xs font-bold" style={{ color: 'var(--primary)' }}>{t.value}</p>
                    <p className="text-[11px]" style={{ color: 'var(--muted)' }}>{t.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Revenue streams */}
            <div>
              <p className="text-xs uppercase tracking-widest mb-2" style={{ color: 'var(--muted)' }}>Revenue streams (yr 1)</p>
              <div className="space-y-1">
                {streams.map(s => {
                  const pct = results.grossRevenue > 0 ? (s.value / results.grossRevenue) * 100 : 0
                  return (
                    <div key={s.label} className="flex items-center justify-between gap-3">
                      <span className="text-xs w-28 flex-shrink-0" style={{ color: 'var(--body)' }}>{s.label}</span>
                      <div className="flex-1 h-1.5 rounded-full" style={{ background: 'var(--hairline)' }}>
                        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: 'var(--primary)' }} />
                      </div>
                      <span className="text-xs font-bold w-16 text-right" style={{ color: 'var(--ink)' }}>
                        {fmtUSD(s.value)}
                      </span>
                    </div>
                  )
                })}
                <div className="border-t mt-2 pt-2" style={{ borderColor: 'var(--hairline)' }}>
                  <div className="flex justify-between text-sm font-bold">
                    <span style={{ color: 'var(--body-strong)' }}>Total gross revenue</span>
                    <span style={{ color: 'var(--primary)' }}>{fmtUSD(results.grossRevenue)}</span>
                  </div>
                  <p className="text-[11px] mt-1" style={{ color: 'var(--muted-soft)' }}>
                    Club revenue share is subject to negotiated deal terms and may differ from the gross figure above.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-3 pt-1">
        <button
          type="button"
          onClick={onBack}
          className="py-4 px-6 rounded-lg font-medium"
          style={{ background: 'var(--surface-card)', color: 'var(--body)', border: '1px solid var(--hairline)' }}
        >
          ← Back
        </button>
        <button
          type="button"
          onClick={onNext}
          className="flex-1 py-4 rounded-lg font-bold text-base"
          style={{ background: 'var(--primary)', color: 'var(--on-primary)' }}
        >
          See My Results →
        </button>
      </div>
    </div>
  )
}
