'use client'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

const STEP_LABELS: Record<number, string> = {
  1: 'Identity',
  2: 'Branding',
  3: 'Numbers',
  4: 'Unlocked',
}

interface Props { funnel: { step: number; count: number }[]; submitted: number }

export default function FunnelChart({ funnel, submitted }: Props) {
  const data = [
    ...funnel.map(f => ({ name: STEP_LABELS[f.step] ?? `Step ${f.step}`, value: f.count })),
    { name: 'Submitted', value: submitted },
  ]

  return (
    <div>
      <h3 className="text-sm font-bold text-slate-900 mb-3">Conversion Funnel</h3>
      <ResponsiveContainer width="100%" height={160}>
        <BarChart data={data}>
          <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
          <YAxis hide />
          <Tooltip cursor={{ fill: '#f8fafc' }} />
          <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={48}>
            {data.map((_, i) => <Cell key={i} fill={i === data.length - 1 ? '#22c55e' : '#0f172a'} opacity={1 - i * 0.12} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
