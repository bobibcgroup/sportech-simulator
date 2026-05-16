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
  return (
    <div className="space-y-2 py-1">
      <div className="flex justify-between items-baseline">
        <label className="text-sm font-semibold text-slate-700">{label}</label>
        <span className="text-lg font-bold text-slate-900">{format(value)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full cursor-pointer touch-none"
        style={{ accentColor: 'var(--club-primary)', height: '6px' }}
      />
      <div className="flex justify-between text-[11px] text-slate-400">
        <span>{format(min)}</span>
        <span>{format(max)}</span>
      </div>
      {hint && <p className="text-[11px] text-slate-400">{hint}</p>}
    </div>
  )
}
