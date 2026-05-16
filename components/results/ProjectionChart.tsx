'use client'
import { XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts'

const fmtM = (n: number) => `$${(n / 1_000_000).toFixed(1)}M`

interface Props { projection: number[]; primaryColor: string }

export default function ProjectionChart({ projection, primaryColor }: Props) {
  const data = projection.map((value, i) => ({ year: `${2026 + i}`, revenue: value }))

  return (
    <div>
      <h3 className="text-base font-bold text-slate-900 mb-4">5-Year Revenue Projection</h3>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={primaryColor} stopOpacity={0.15} />
              <stop offset="95%" stopColor={primaryColor} stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="year" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
          <YAxis tickFormatter={fmtM} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={55} />
          <Tooltip formatter={(v) => typeof v === 'number' ? fmtM(v) : v} labelStyle={{ color: '#0f172a', fontWeight: 700 }} />
          <Area type="monotone" dataKey="revenue" stroke={primaryColor} strokeWidth={2.5} fill="url(#colorRevenue)" dot={{ fill: primaryColor, r: 4 }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
