'use client'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { calculate } from '@/lib/calculations'
import type { WizardData, RevenueResults } from '@/lib/types'
import KpiStrip from '@/components/results/KpiStrip'
import WinBadges from '@/components/results/WinBadges'
import ViewToggle from '@/components/results/ViewToggle'
import DashboardView from '@/components/results/DashboardView'
import ReportView from '@/components/results/ReportView'

const fmtUSD = (n: number) =>
  n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(2)}M`
  : n >= 1_000 ? `$${(n / 1_000).toFixed(0)}K`
  : `$${n.toFixed(0)}`

const fmt = (n: number) =>
  n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1)}M`
  : n >= 1_000 ? `${(n / 1_000).toFixed(0)}K`
  : String(Math.round(n))

export default function ResultsPage() {
  const router = useRouter()
  const [data, setData] = useState<WizardData | null>(null)
  const [results, setResults] = useState<RevenueResults | null>(null)
  const [view, setView] = useState<'dashboard' | 'report'>('dashboard')
  const [showBreakdown, setShowBreakdown] = useState(false)
  const loaded = useRef(false)

  useEffect(() => {
    if (loaded.current) return
    loaded.current = true

    try {
      const stored = localStorage.getItem('sportech_results')
      if (!stored) { router.push('/simulator'); return }
      const parsed = JSON.parse(stored)
      if (!parsed.data) { router.push('/simulator'); return }
      const resolvedResults: RevenueResults = parsed.results ?? calculate(parsed.data)
      setData(parsed.data)
      setResults(resolvedResults)
      document.documentElement.style.setProperty('--club-primary', parsed.data.primaryColor ?? 'var(--primary)')
      document.documentElement.style.setProperty('--club-secondary', parsed.data.secondaryColor ?? '#3b82f6')
    } catch {
      router.push('/simulator')
    }
  }, [router])

  if (!data || !results) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--canvas)' }}>
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--primary)', borderTopColor: 'transparent' }} />
        <p className="text-xs" style={{ color: 'var(--muted)' }}>Loading your report…</p>
      </div>
    </div>
  )

  const streams = [
    { label: 'Subscriptions', value: results.subscriptions, icon: '💳' },
    { label: 'Predictions', value: results.predictions, icon: '🎯' },
    { label: 'Virtual Gifts', value: results.virtualGifts, icon: '🎁' },
    { label: 'Merchandise', value: results.merchandise, icon: '👕' },
    { label: 'Token Fees', value: results.tokenFees, icon: '🪙' },
    { label: 'Digital Cards', value: results.digitalCards, icon: '🃏' },
  ]

  return (
    <div className="min-h-screen" style={{ background: 'var(--canvas)' }}>
      {/* Sticky header */}
      <header
        className="sticky top-0 z-40 px-4 py-3"
        style={{ background: 'rgba(10,10,10,0.9)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--hairline)' }}
      >
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            {data.logoDataUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={data.logoDataUrl} alt="logo" className="h-8 w-8 rounded-lg object-contain" />
            )}
            <div className="min-w-0">
              <p className="font-bold truncate text-sm sm:text-base" style={{ color: 'var(--ink)' }}>{data.clubName}</p>
              <p className="text-xs hidden sm:block" style={{ color: 'var(--muted)' }}>Revenue Simulation 2025–2030</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ViewToggle view={view} onChange={setView} />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">

        {/* KPI strip */}
        <KpiStrip year1={results.year1} cumulativeTotal={results.cumulativeTotal} valuation={results.valuation} />

        {/* Compliance disclaimer */}
        <div className="rounded-xl px-4 py-3" style={{ background: 'var(--surface-card)', border: '1px solid var(--hairline)' }}>
          <p className="text-xs" style={{ color: 'var(--muted)' }}>
            <span className="font-semibold" style={{ color: 'var(--body-strong)' }}>Disclaimer: </span>
            Revenue figures shown are illustrative estimates based on the inputs you provided. Actual returns depend on negotiated deal terms, platform adoption rates, fan engagement levels, market conditions, and regulatory requirements applicable in your jurisdiction. SporTech makes no guarantee of specific revenue outcomes.
          </p>
        </div>

        <WinBadges />

        {/* Revenue breakdown */}
        <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--hairline)' }}>
          <button
            type="button"
            onClick={() => setShowBreakdown(v => !v)}
            className="w-full flex items-center justify-between px-5 py-4"
            style={{ background: 'var(--surface-card)' }}
          >
            <div>
              <p className="text-sm font-bold text-left" style={{ color: 'var(--ink)' }}>Revenue breakdown</p>
              <p className="text-xs text-left" style={{ color: 'var(--muted)' }}>See how the numbers are built</p>
            </div>
            <span className="text-xs font-semibold" style={{ color: 'var(--primary)' }}>{showBreakdown ? '▲ Hide' : '▼ Show'}</span>
          </button>

          {showBreakdown && (
            <div className="px-5 pb-5 pt-4 space-y-6" style={{ background: 'var(--surface-soft)' }}>

              {/* Audience tiers */}
              <div>
                <p className="text-xs uppercase tracking-widest mb-3" style={{ color: 'var(--muted)' }}>Audience tiers</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { label: 'Free Fans', value: fmt(results.tiers.freeFans) },
                    { label: 'Stars (paid)', value: fmt(results.tiers.paidStars) },
                    { label: 'SuperStars', value: fmt(results.tiers.paidSuperStars) },
                    { label: 'Partners', value: fmt(results.tiers.paidPartners) },
                  ].map(t => (
                    <div key={t.label} className="rounded-lg p-3 text-center" style={{ background: 'var(--surface-card)' }}>
                      <p className="text-lg font-black" style={{ color: 'var(--primary)' }}>{t.value}</p>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>{t.label}</p>
                    </div>
                  ))}
                </div>
                <p className="text-[11px] mt-2" style={{ color: 'var(--muted-soft)' }}>
                  Based on {Math.round(data.fanBase / 1_000_000 * 10) / 10}M global fans × {Math.round(data.adoptionPct * 100)}% adoption × {Math.round(data.premiumMix * 100)}% premium
                </p>
              </div>

              {/* Revenue streams */}
              <div>
                <p className="text-xs uppercase tracking-widest mb-3" style={{ color: 'var(--muted)' }}>Revenue streams (Year 1 gross)</p>
                <div className="space-y-2">
                  {streams.map(s => {
                    const pct = results.grossRevenue > 0 ? (s.value / results.grossRevenue) * 100 : 0
                    return (
                      <div key={s.label}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs" style={{ color: 'var(--body)' }}>{s.icon} {s.label}</span>
                          <span className="text-xs font-bold" style={{ color: 'var(--ink)' }}>{fmtUSD(s.value)}</span>
                        </div>
                        <div className="h-1.5 rounded-full" style={{ background: 'var(--hairline)' }}>
                          <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: 'var(--primary)' }} />
                        </div>
                        <p className="text-[10px] mt-0.5 text-right" style={{ color: 'var(--muted)' }}>{pct.toFixed(1)}% of gross</p>
                      </div>
                    )
                  })}
                </div>

                <div className="mt-4 pt-4 space-y-1" style={{ borderTop: '1px solid var(--hairline)' }}>
                  <div className="flex justify-between text-sm font-bold">
                    <span style={{ color: 'var(--body-strong)' }}>Gross platform revenue</span>
                    <span style={{ color: 'var(--ink)' }}>{fmtUSD(results.grossRevenue)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span style={{ color: 'var(--muted)' }}>Club revenue share (up to)</span>
                    <span style={{ color: 'var(--primary)', fontWeight: 700 }}>{fmtUSD(results.year1)}</span>
                  </div>
                  <p className="text-[11px] pt-1" style={{ color: 'var(--muted-soft)' }}>
                    * The revenue split between the club and SporTech is determined by the specific deal and engagement terms agreed. The figure above is illustrative only.
                  </p>
                </div>
              </div>

              {/* 5-year projection */}
              <div>
                <p className="text-xs uppercase tracking-widest mb-3" style={{ color: 'var(--muted)' }}>5-Year projection</p>
                <div className="grid grid-cols-5 gap-1">
                  {results.projection.map((v, i) => {
                    const maxV = Math.max(...results.projection)
                    const barH = maxV > 0 ? (v / maxV) * 60 : 0
                    return (
                      <div key={i} className="flex flex-col items-center gap-1">
                        <span className="text-[10px] font-bold" style={{ color: 'var(--primary)' }}>{fmtUSD(v)}</span>
                        <div className="w-full rounded-sm" style={{ height: `${barH}px`, minHeight: 4, background: 'var(--primary)', opacity: 0.3 + (i / 5) * 0.7 }} />
                        <span className="text-[10px]" style={{ color: 'var(--muted)' }}>Yr {i + 1}</span>
                      </div>
                    )
                  })}
                </div>
                <p className="text-[11px] mt-2" style={{ color: 'var(--muted-soft)' }}>
                  Growth projections are indicative and assume consistent adoption, engagement, and agreed deal terms throughout the period.
                </p>
              </div>
            </div>
          )}
        </div>

        {view === 'dashboard' ? <DashboardView data={data} results={results} /> : <ReportView data={data} results={results} />}

        {/* CTA band */}
        <div className="rounded-xl p-8 text-center" style={{ background: 'var(--primary)' }}>
          <h2 className="text-2xl font-black mb-2" style={{ color: 'var(--on-primary)' }}>
            Ready to unlock this revenue?
          </h2>
          <p className="text-sm mb-6" style={{ color: 'rgba(10,10,10,0.65)' }}>
            SporTech builds and operates the platform. You bring the badge.
          </p>
          <a
            href="https://sportech.com.sa"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block font-bold rounded-lg py-3 px-8 text-sm transition-opacity hover:opacity-90"
            style={{ background: 'var(--canvas)', color: 'var(--primary)' }}
          >
            Book a Demo →
          </a>
          <p className="text-[11px] mt-4" style={{ color: 'rgba(10,10,10,0.5)' }}>
            Revenue estimates are for discussion purposes only and do not constitute a contractual commitment.
          </p>
        </div>
      </main>
    </div>
  )
}
