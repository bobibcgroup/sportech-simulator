'use client'
import { useEffect } from 'react'
import { calculate } from '@/lib/calculations'
import type { WizardData } from '@/lib/types'

interface Props { data: WizardData; onNext: () => void; onBack: () => void }

const fmtM = (n: number) => `$${(n / 1_000_000).toFixed(1)}M`

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

  return (
    <div className="w-full animate-in fade-in duration-300">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Your report is ready</h1>
        <p className="text-slate-500 mt-1 text-sm">Enter your details to unlock the full simulation</p>
      </div>

      <div className="relative rounded-2xl border border-slate-100 overflow-hidden mb-6">
        <div className="p-5 space-y-4 select-none pointer-events-none" style={{ filter: 'blur(6px)' }}>
          <div className="text-center">
            <p className="text-xs text-slate-400 uppercase tracking-wider">Annual Revenue Potential</p>
            <p className="text-4xl font-black text-slate-900 mt-1">{fmtM(r.year1)}</p>
            <p className="text-sm text-green-600 font-medium mt-1">5-Year Total: {fmtM(r.cumulativeTotal)}</p>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'Subscriptions', value: r.subscriptions },
              { label: 'Predictions', value: r.predictions },
              { label: 'Virtual Gifts', value: r.virtualGifts },
              { label: 'Merchandise', value: r.merchandise },
              { label: 'Tokens', value: r.tokenFees },
              { label: 'Digital Cards', value: r.digitalCards },
            ].map(s => (
              <div key={s.label} className="bg-slate-50 rounded-xl p-3 text-center">
                <p className="text-sm font-bold text-slate-900">{fmtM(s.value)}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute inset-0 blur-overlay bg-white/60 flex flex-col items-center justify-center p-6 text-center">
          <div className="text-4xl mb-3">🔒</div>
          <h2 className="text-xl font-bold text-slate-900 mb-1">Unlock your full report</h2>
          <p className="text-sm text-slate-500 mb-5">Free — takes 30 seconds</p>
          <button
            type="button"
            onClick={onNext}
            className="w-full py-4 rounded-xl bg-slate-900 text-white font-bold text-base hover:bg-slate-800 transition-colors shadow-lg"
          >
            Get My Revenue Report →
          </button>
        </div>
      </div>

      <button type="button" onClick={onBack} className="w-full py-3 text-sm text-slate-400 hover:text-slate-600">
        ← Go back and adjust
      </button>
    </div>
  )
}
