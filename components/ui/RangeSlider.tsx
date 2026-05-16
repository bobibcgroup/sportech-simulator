interface RangeSliderProps {
  label: string
  value: number
  min: number
  max: number
  step?: number
  format: (v: number) => string
  onChange: (v: number) => void
  hint?: string
}

export default function RangeSlider({ label, value, min, max, step = 1, format, onChange, hint }: RangeSliderProps) {
  const pct = ((value - min) / (max - min)) * 100

  return (
    <div className="space-y-2 py-1">
      <div className="flex justify-between items-baseline">
        <label className="text-sm font-semibold" style={{ color: 'var(--body-strong)' }}>{label}</label>
        <span className="text-xl font-bold" style={{ color: 'var(--primary)' }}>{format(value)}</span>
      </div>

      <div className="relative">
        <div
          className="absolute top-1/2 left-0 h-[4px] rounded-full pointer-events-none"
          style={{
            width: `${pct}%`,
            background: 'var(--primary)',
            transform: 'translateY(-50%)',
            zIndex: 1,
          }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={e => onChange(Number(e.target.value))}
          className="w-full cursor-pointer relative"
          style={{ zIndex: 2, position: 'relative', background: 'transparent' }}
        />
      </div>

      <div className="flex justify-between text-[11px]" style={{ color: 'var(--muted)' }}>
        <span>{format(min)}</span>
        <span>{format(max)}</span>
      </div>
      {hint && <p className="text-[11px]" style={{ color: 'var(--muted)' }}>{hint}</p>}
    </div>
  )
}
