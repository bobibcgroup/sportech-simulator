'use client'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'
import FunnelChart from './FunnelChart'
import type { AdminStats } from '@/lib/types'

const fmtM = (n: number) => `$${(n / 1_000_000).toFixed(1)}M`
const fmtK = (n: number) => n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1)}M` : `${(n / 1_000).toFixed(0)}K`
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const revenueFormatter = (v: any) => typeof v === 'number' ? fmtM(v) : String(v ?? '')

interface Props { stats: AdminStats }

export default function AnalyticsDashboard({ stats }: Props) {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Leads', value: stats.totalLeads.toString() },
          { label: 'Last 30 Days', value: stats.recentLeads.toString() },
          { label: 'Avg Fan Base', value: fmtK(stats.avgFanBase) },
          { label: 'Avg Year 1 Rev', value: fmtM(stats.avgYear1Rev) },
        ].map(k => (
          <div key={k.label} className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
            <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">{k.label}</p>
            <p className="text-2xl font-black text-slate-900">{k.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white border border-slate-100 rounded-2xl p-5">
        <FunnelChart funnel={stats.funnel} submitted={stats.totalLeads} />
      </div>

      <div className="bg-white border border-slate-100 rounded-2xl p-5">
        <h3 className="text-sm font-bold text-slate-900 mb-3">Simulated Revenue Over Time</h3>
        <ResponsiveContainer width="100%" height={160}>
          <AreaChart data={stats.revenueOverTime}>
            <XAxis dataKey="date" tick={{ fontSize: 9, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <YAxis tickFormatter={fmtM} tick={{ fontSize: 9, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={48} />
            <Tooltip formatter={revenueFormatter} />
            <Area type="monotone" dataKey="total" stroke="#0f172a" strokeWidth={2} fill="#f1f5f9" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {([
          { title: 'Leads by Sport', data: stats.leadsBySport.map(d => ({ label: d.sport, count: d.count })) },
          { title: 'Leads by Region', data: stats.leadsByRegion.map(d => ({ label: d.region, count: d.count })) },
        ] as const).map(chart => (
          <div key={chart.title} className="bg-white border border-slate-100 rounded-2xl p-5">
            <h3 className="text-sm font-bold text-slate-900 mb-3">{chart.title}</h3>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={chart.data} layout="vertical" margin={{ left: 60, right: 20 }}>
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="label" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} width={55} />
                <Tooltip cursor={{ fill: '#f8fafc' }} />
                <Bar dataKey="count" fill="#0f172a" radius={[0, 4, 4, 0]} maxBarSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ))}
      </div>
    </div>
  )
}
