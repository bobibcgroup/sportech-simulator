'use client'
import RangeSlider from '@/components/ui/RangeSlider'

interface Props {
  icon: string
  label: string
  hint: string
  context?: string
  value: number
  min: number
  max: number
  step?: number
  format: (v: number) => string
  onChange: (v: number) => void
  onNext: () => void
  onBack: () => void
}

export default function SliderStep({
  icon, label, hint, context,
  value, min, max, step, format,
  onChange, onNext, onBack,
}: Props) {
  return (
    <div className="w-full space-y-5 animate-in">

      <div className="text-center pt-2 pb-1">
        <div className="text-5xl mb-4">{icon}</div>
      </div>

      {context && (
        <div className="rounded-xl px-4 py-3 text-center" style={{ background: 'var(--surface-card)', border: '1px solid var(--hairline)' }}>
          <p className="text-xs uppercase tracking-widest mb-0.5" style={{ color: 'var(--muted)' }}>Based on your inputs</p>
          <p className="text-sm font-semibold" style={{ color: 'var(--ink)' }}>{context}</p>
        </div>
      )}

      <div className="rounded-xl p-5" style={{ background: 'var(--surface-card)', border: '1px solid var(--hairline)' }}>
        <RangeSlider
          label={label}
          value={value}
          min={min}
          max={max}
          step={step}
          format={format}
          onChange={onChange}
          hint={hint}
        />
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
