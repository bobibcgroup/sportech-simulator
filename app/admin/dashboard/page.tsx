import { redirect } from 'next/navigation'
import { isAdminAuthenticated } from '@/lib/adminAuth'
import { supabaseAdmin } from '@/lib/supabase'
import LeadsTable from '@/components/admin/LeadsTable'
import AnalyticsDashboard from '@/components/admin/AnalyticsDashboard'
import type { AdminStats } from '@/lib/types'

async function getStats(): Promise<AdminStats> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
  try {
    const res = await fetch(`${siteUrl}/api/admin/stats`, { cache: 'no-store' })
    if (!res.ok) throw new Error('stats fetch failed')
    return res.json()
  } catch {
    return { totalLeads: 0, recentLeads: 0, avgFanBase: 0, avgYear1Rev: 0, leadsBySport: [], leadsByRegion: [], revenueOverTime: [], funnel: [] }
  }
}

export default async function AdminDashboard() {
  if (!isAdminAuthenticated()) redirect('/admin')

  const [{ data: leads }, stats] = await Promise.all([
    supabaseAdmin.from('leads').select('*').order('created_at', { ascending: false }),
    getStats(),
  ])

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-slate-900">SporTech Admin</h1>
          <p className="text-xs text-slate-400">{stats.totalLeads} total leads</p>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="/admin/parameters"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            Model Parameters →
          </a>
        </div>
        <form action="/api/admin/logout" method="POST">
          <button type="submit" className="text-sm text-slate-400 hover:text-slate-600">Sign out</button>
        </form>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-10">
        <AnalyticsDashboard stats={stats} />
        <div>
          <h2 className="text-lg font-bold text-slate-900 mb-4">All Leads</h2>
          <LeadsTable leads={leads ?? []} />
        </div>
      </main>
    </div>
  )
}
