'use client'

const STEP_LABELS: Record<number, string> = {
  1: 'Identity',
  2: 'Numbers',
  3: 'Unlocked',
  4: 'Submitted',
}

interface Props { funnel: { step: number; count: number }[]; submitted: number }

export default function FunnelChart({ funnel, submitted }: Props) {
  const data = [
    ...funnel.map(f => ({ name: STEP_LABELS[f.step] ?? `Step ${f.step}`, value: f.count, final: false })),
    { name: 'Submitted', value: submitted, final: true },
  ]
  const max = Math.max(...data.map(d => d.value), 1)

  return (
    <div>
      <h3 className="text-sm font-bold text-slate-900 mb-3">Conversion Funnel</h3>
      <div className="flex items-end gap-2 h-36">
        {data.map((d, i) => {
          const pct = (d.value / max) * 100
          return (
            <div key={d.name} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-[10px] font-bold text-slate-700">{d.value}</span>
              <div className="w-full rounded-t-md" style={{ height: `${Math.max(pct, 4)}%`, background: d.final ? '#22c55e' : '#0f172a', opacity: 1 - i * 0.1 }} />
              <span className="text-[9px] text-slate-400 text-center leading-tight">{d.name}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
