'use client'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { calculate } from '@/lib/calculations'
import type { WizardData, RevenueResults } from '@/lib/types'
import KpiStrip from '@/components/results/KpiStrip'
import WinBadges from '@/components/results/WinBadges'
import DashboardView from '@/components/results/DashboardView'

export default function ResultsPage() {
  const router = useRouter()
  const [data, setData] = useState<WizardData | null>(null)
  const [results, setResults] = useState<RevenueResults | null>(null)
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
          <div className="flex items-center gap-3" />
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

        <DashboardView data={data} results={results} />

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
