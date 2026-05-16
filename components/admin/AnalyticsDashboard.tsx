'use client'
import FunnelChart from './FunnelChart'
import type { AdminStats } from '@/lib/types'

const fmtM = (n: number) => `$${(n / 1_000_000).toFixed(1)}M`
const fmtK = (n: number) => n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1)}M` : `${(n / 1_000).toFixed(0)}K`

interface Props { stats: AdminStats }

function MiniBarChart({ data }: { data: { label: string; count: number }[] }) {
  const max = Math.max(...data.map(d => d.count), 1)
  return (
    <div className="space-y-2">
      {data.map(d => (
        <div key={d.label} className="flex items-center gap-2">
          <span className="text-xs text-slate-500 w-24 shrink-0 truncate">{d.label}</span>
          <div className="flex-1 h-4 rounded-sm bg-slate-100 overflow-hidden">
            <div className="h-full rounded-sm bg-slate-900" style={{ width: `${(d.count / max) * 100}%` }} />
          </div>
          <span className="text-xs font-bold text-slate-700 w-6 shrink-0 text-right">{d.count}</span>
        </div>
      ))}
    </div>
  )
}

function MiniAreaChart({ data }: { data: { date: string; total: number }[] }) {
  if (!data.length) return <p className="text-xs text-slate-400">No data yet</p>
  const max = Math.max(...data.map(d => d.total), 1)
  const W = 400
  const H = 80
  const pts = data.map((d, i) => ({
    x: (i / Math.max(data.length - 1, 1)) * W,
    y: H - (d.total / max) * H,
  }))
  const line = pts.map(p => `${p.x},${p.y}`).join(' ')
  const area = `M0,${H} ${pts.map(p => `L${p.x},${p.y}`).join(' ')} L${W},${H} Z`
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ overflow: 'visible' }}>
      <path d={area} fill="#f1f5f9" />
      <polyline points={line} fill="none" stroke="#0f172a" strokeWidth={2} strokeLinejoin="round" />
    </svg>
  )
}

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
        <MiniAreaChart data={stats.revenueOverTime} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white border border-slate-100 rounded-2xl p-5">
          <h3 className="text-sm font-bold text-slate-900 mb-3">Leads by Sport</h3>
          <MiniBarChart data={stats.leadsBySport.map(d => ({ label: d.sport, count: d.count }))} />
        </div>
        <div className="bg-white border border-slate-100 rounded-2xl p-5">
          <h3 className="text-sm font-bold text-slate-900 mb-3">Leads by Region</h3>
          <MiniBarChart data={stats.leadsByRegion.map(d => ({ label: d.region, count: d.count }))} />
        </div>
      </div>
    </div>
  )
}
