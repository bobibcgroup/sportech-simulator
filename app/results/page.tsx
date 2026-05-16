'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { calculate } from '@/lib/calculations'
import type { WizardData, RevenueResults } from '@/lib/types'
import KpiStrip from '@/components/results/KpiStrip'
import WinBadges from '@/components/results/WinBadges'
import ViewToggle from '@/components/results/ViewToggle'
import DashboardView from '@/components/results/DashboardView'
import ReportView from '@/components/results/ReportView'
import DownloadPDFButton from '@/components/pdf/DownloadPDFButton'

export default function ResultsPage() {
  const router = useRouter()
  const [data, setData] = useState<WizardData | null>(null)
  const [results, setResults] = useState<RevenueResults | null>(null)
  const [view, setView] = useState<'dashboard' | 'report'>('dashboard')

  useEffect(() => {
    const stored = localStorage.getItem('sportech_results')
    if (!stored) { router.push('/simulator'); return }
    const parsed = JSON.parse(stored)
    setData(parsed.data)
    setResults(parsed.results ?? calculate(parsed.data))
    document.documentElement.style.setProperty('--club-primary', parsed.data.primaryColor)
    document.documentElement.style.setProperty('--club-secondary', parsed.data.secondaryColor)
  }, [router])

  if (!data || !results) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-slate-100 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            {data.logoDataUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={data.logoDataUrl} alt="logo" className="h-8 w-8 rounded-lg object-contain" />
            )}
            <div className="min-w-0">
              <p className="font-bold text-slate-900 truncate text-sm sm:text-base">{data.clubName}</p>
              <p className="text-xs text-slate-400 hidden sm:block">Revenue Simulation 2025–2030</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ViewToggle view={view} onChange={setView} />
            <DownloadPDFButton data={data} results={results} />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        <KpiStrip year1={results.year1} cumulativeTotal={results.cumulativeTotal} valuation={results.valuation} primaryColor={data.primaryColor} />
        <WinBadges />
        {view === 'dashboard' ? <DashboardView data={data} results={results} /> : <ReportView data={data} results={results} />}

        <div className="rounded-2xl p-8 text-center" style={{ background: data.primaryColor }}>
          <h2 className="text-2xl font-black text-white mb-2">Ready to unlock this revenue?</h2>
          <p className="text-white/70 text-sm mb-6">SporTech builds and operates the platform. You bring the badge. Zero risk.</p>
          <a
            href="https://sportech.com.sa"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-white font-bold rounded-xl py-3 px-8 text-sm transition-opacity hover:opacity-90"
            style={{ color: data.primaryColor }}
          >
            Book a Demo →
          </a>
        </div>
      </main>
    </div>
  )
}
