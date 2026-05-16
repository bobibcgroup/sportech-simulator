'use client'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import type { RevenueResults } from '@/lib/types'

const fmtM = (n: number) => `$${(n / 1_000_000).toFixed(1)}M`

interface Props { results: RevenueResults; primaryColor: string; secondaryColor: string }

export default function RevenueBarChart({ results, primaryColor, secondaryColor }: Props) {
  const data = [
    { name: 'Subscriptions', value: results.subscriptions },
    { name: 'Predictions', value: results.predictions },
    { name: 'Virtual Gifts', value: results.virtualGifts },
    { name: 'Merchandise', value: results.merchandise },
    { name: 'Tokens', value: results.tokenFees },
    { name: 'Digital Cards', value: results.digitalCards },
  ].sort((a, b) => b.value - a.value)

  return (
    <div>
      <h3 className="text-base font-bold text-slate-900 mb-4">Revenue by Stream</h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} layout="vertical" margin={{ left: 80, right: 40 }}>
          <XAxis type="number" hide />
          <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} width={75} />
          <Tooltip formatter={(v) => typeof v === 'number' ? fmtM(v) : v} cursor={{ fill: '#f1f5f9' }} />
          <Bar dataKey="value" radius={[0, 6, 6, 0]} maxBarSize={28}>
            {data.map((_, i) => (
              <Cell key={i} fill={i === 0 ? primaryColor : i === 1 ? secondaryColor : '#e2e8f0'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
