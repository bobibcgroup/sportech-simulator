'use client'
import RangeSlider from '@/components/ui/RangeSlider'
import type { WizardData } from '@/lib/types'
import { calculate } from '@/lib/calculations'

const fmt = (n: number) => n >= 1_000_000
  ? `${(n / 1_000_000).toFixed(1)}M`
  : n >= 1_000 ? `${(n / 1_000).toFixed(0)}K` : String(n)

const fmtPct = (n: number) => `${(n * 100).toFixed(0)}%`

interface Props { data: WizardData; update: (p: Partial<WizardData>) => void; onNext: () => void; onBack: () => void }

export default function Step3Numbers({ data, update, onNext, onBack }: Props) {
  const results = calculate(data)

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Your numbers</h1>
        <p className="text-slate-500 mt-1 text-sm">Adjust the sliders to model different scenarios — your report updates live</p>
      </div>

      <div className="rounded-2xl bg-slate-900 p-4 text-white text-center">
        <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Estimated Annual Revenue (Your 50%)</p>
        <p className="text-3xl font-black">
          ${(results.year1 / 1_000_000).toFixed(1)}M
        </p>
        <p className="text-xs text-slate-400 mt-1">{fmt(results.tiers.totalActive)} active fans · {fmt(results.tiers.totalPaid)} paid</p>
      </div>

      <RangeSlider
        label="Global Fan Base"
        value={data.fanBase}
        min={1_000_000} max={200_000_000} step={500_000}
        format={fmt}
        onChange={v => update({ fanBase: v })}
        hint="Total worldwide fans for your club"
      />

      <RangeSlider
        label="Platform Adoption"
        value={data.adoptionPct}
        min={0.01} max={0.20} step={0.01}
        format={fmtPct}
        onChange={v => update({ adoptionPct: v })}
        hint="% of fans who download and use the app"
      />

      <RangeSlider
        label="Premium Tier Mix"
        value={data.premiumMix}
        min={0.05} max={0.40} step={0.01}
        format={fmtPct}
        onChange={v => update({ premiumMix: v })}
        hint="% of active users on a paid subscription"
      />

      <RangeSlider
        label="Games Per Season"
        value={data.gamesPerSeason}
        min={20} max={80} step={1}
        format={v => `${v} games`}
        onChange={v => update({ gamesPerSeason: v })}
        hint="Total home + away matches per season"
      />

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">Average Fan Spending</label>
        <p className="text-xs text-slate-400 mb-3">Reflects purchasing power in your market</p>
        <div className="grid grid-cols-3 gap-2">
          {(['low', 'standard', 'high'] as const).map(level => (
            <button
              key={level}
              type="button"
              onClick={() => update({ spendLevel: level })}
              className={`py-3 rounded-xl border text-sm font-medium capitalize transition-all
                ${data.spendLevel === level
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'}`}
            >
              {level === 'low' ? '🌍 Low' : level === 'standard' ? '⚖️ Standard' : '💎 High'}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <button type="button" onClick={onBack} className="py-4 px-6 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50">
          ← Back
        </button>
        <button type="button" onClick={onNext} className="flex-1 py-4 rounded-xl bg-slate-900 text-white font-semibold text-base hover:bg-slate-800 transition-colors">
          See My Results →
        </button>
      </div>
    </div>
  )
}
