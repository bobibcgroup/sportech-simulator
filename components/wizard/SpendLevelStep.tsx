'use client'
import type { WizardData } from '@/lib/types'

const SPEND_OPTIONS = [
  {
    level: 'low' as const,
    icon: '🌍',
    label: 'Emerging',
    range: '$5–20 avg/active fan/yr',
    desc: 'Developing digital markets with growing app adoption',
  },
  {
    level: 'standard' as const,
    icon: '⚖️',
    label: 'Established',
    range: '$10–40 avg/active fan/yr',
    desc: 'Mid-tier markets with strong digital spending habits',
  },
  {
    level: 'high' as const,
    icon: '💎',
    label: 'Premium',
    range: '$17–70 avg/active fan/yr',
    desc: 'High-income markets with high willingness to pay',
  },
]

interface Props {
  data: WizardData
  update: (p: Partial<WizardData>) => void
  onNext: () => void
  onBack: () => void
}

export default function SpendLevelStep({ data, update, onNext, onBack }: Props) {
  return (
    <div className="w-full space-y-5 animate-in">

      <div className="text-center pt-2 pb-1">
        <div className="text-5xl mb-4">💳</div>
      </div>

      <div className="space-y-3">
        {SPEND_OPTIONS.map(opt => {
          const active = data.spendLevel === opt.level
          return (
            <button
              key={opt.level}
              type="button"
              onClick={() => update({ spendLevel: opt.level })}
              className="w-full rounded-xl p-4 text-left transition-all"
              style={{
                background: active ? 'var(--primary)' : 'var(--surface-card)',
                color: active ? 'var(--on-primary)' : 'var(--body)',
                border: active ? '1px solid var(--primary)' : '1px solid var(--hairline)',
              }}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{opt.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm">{opt.label}</p>
                  <p className="text-xs mt-0.5 opacity-80">{opt.range}</p>
                  <p className="text-xs mt-0.5 opacity-60">{opt.desc}</p>
                </div>
                {active && (
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                    style={{ background: 'var(--on-primary)', color: 'var(--primary)' }}
                  >
                    ✓
                  </div>
                )}
              </div>
            </button>
          )
        })}
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
          Next →
        </button>
      </div>
    </div>
  )
}
