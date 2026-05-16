'use client'
import { useEffect } from 'react'
import { calculate } from '@/lib/calculations'
import type { WizardData } from '@/lib/types'

interface Props { data: WizardData; onNext: () => void; onBack: () => void }

const fmtM = (n: number) => `$${(n / 1_000_000).toFixed(1)}M`
const fmtUSD = (n: number) =>
  n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(2)}M`
  : n >= 1_000 ? `$${(n / 1_000).toFixed(0)}K`
  : `$${n.toFixed(0)}`

export default function Step4BlurredPreview({ data, onNext, onBack }: Props) {
  const r = calculate(data)

  useEffect(() => {
    const sessionId = localStorage.getItem('sportech_session') ?? crypto.randomUUID()
    localStorage.setItem('sportech_session', sessionId)
    fetch('/api/funnel', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session_id: sessionId, step: 4 }),
    }).catch(() => {})
  }, [])

  const streams = [
    { label: 'Subscriptions',  value: r.subscriptions },
    { label: 'Predictions',    value: r.predictions },
    { label: 'Live Gifting',   value: r.virtualGifts },
    { label: 'Merchandise',    value: r.merchandise },
    { label: 'Gift Cards',     value: r.digitalCards },
    { label: 'Voting',         value: r.voting },
    { label: 'Tickets',        value: r.tickets },
    { label: 'NFTs',           value: r.nftCollectibles },
  ]

  return (
    <div className="w-full animate-in">
      <div className="relative rounded-xl overflow-hidden mb-5" style={{ border: '1px solid var(--hairline)' }}>
        {/* Blurred content */}
        <div className="p-5 space-y-4 select-none pointer-events-none" style={{ filter: 'blur(5px)', background: 'var(--surface-card)' }}>
          <div className="text-center">
            <p className="text-xs uppercase tracking-widest" style={{ color: 'var(--muted)' }}>Annual Revenue Potential (Up to)</p>
            <p className="text-4xl font-black mt-1" style={{ color: 'var(--primary)' }}>{fmtM(r.year1)}</p>
            <p className="text-sm font-medium mt-1" style={{ color: 'var(--accent-emerald)' }}>
              5-Year Total: {fmtM(r.cumulativeTotal)}
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {streams.map(s => (
              <div key={s.label} className="rounded-lg p-3 text-center" style={{ background: 'var(--surface-elevated)' }}>
                <p className="text-sm font-bold" style={{ color: 'var(--primary)' }}>{fmtUSD(s.value)}</p>
                <p className="text-[10px] mt-0.5" style={{ color: 'var(--muted)' }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Overlay */}
        <div
          className="absolute inset-0 blur-overlay flex flex-col items-center justify-center p-6 text-center"
          style={{ background: 'rgba(10,10,10,0.75)' }}
        >
          <div className="text-4xl mb-3">🔒</div>
          <h2 className="text-xl font-bold mb-1" style={{ color: 'var(--ink)' }}>Unlock your full report</h2>
          <p className="text-sm mb-5" style={{ color: 'var(--muted)' }}>Free — takes under 30 seconds</p>
          <button
            type="button"
            onClick={onNext}
            className="w-full py-4 rounded-lg font-bold text-base transition-all"
            style={{ background: 'var(--primary)', color: 'var(--on-primary)' }}
          >
            Get My Revenue Report →
          </button>
        </div>
      </div>

      <button
        type="button"
        onClick={onBack}
        className="w-full py-3 text-sm transition-colors"
        style={{ color: 'var(--muted)' }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--body)' }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--muted)' }}
      >
        ← Go back and adjust
      </button>
    </div>
  )
}
