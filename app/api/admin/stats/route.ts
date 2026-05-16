import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { isAdminAuthenticated } from '@/lib/adminAuth'
import type { AdminStats } from '@/lib/types'

export const dynamic = 'force-dynamic'

export async function GET() {
  if (!isAdminAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const [totals, bySport, byRegion, overTime, funnel] = await Promise.all([
    supabaseAdmin.from('leads').select('id, year1_rev, fan_base, created_at'),
    supabaseAdmin.from('leads').select('sport').order('sport'),
    supabaseAdmin.from('leads').select('region').order('region'),
    supabaseAdmin.from('leads').select('created_at, year1_rev').order('created_at'),
    supabaseAdmin.from('funnel_events').select('step, session_id'),
  ])

  const leads = (totals.data ?? []) as { id: string; year1_rev: number; fan_base: number; created_at: string }[]
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()

  const sportCounts = ((bySport.data ?? []) as { sport: string }[]).reduce<Record<string, number>>((acc, r) => {
    acc[r.sport] = (acc[r.sport] ?? 0) + 1
    return acc
  }, {})

  const regionCounts = ((byRegion.data ?? []) as { region: string }[]).reduce<Record<string, number>>((acc, r) => {
    acc[r.region] = (acc[r.region] ?? 0) + 1
    return acc
  }, {})

  const dateTotals = ((overTime.data ?? []) as { created_at: string; year1_rev: number }[]).reduce<Record<string, number>>((acc, r) => {
    const date = r.created_at.slice(0, 10)
    acc[date] = (acc[date] ?? 0) + r.year1_rev
    return acc
  }, {})

  const funnelCounts = ((funnel.data ?? []) as { step: number; session_id: string }[]).reduce<Record<number, Set<string>>>((acc, r) => {
    if (!acc[r.step]) acc[r.step] = new Set()
    acc[r.step].add(r.session_id)
    return acc
  }, {})

  const stats: AdminStats = {
    totalLeads: leads.length,
    recentLeads: leads.filter(l => l.created_at > thirtyDaysAgo).length,
    avgFanBase: leads.length ? leads.reduce((s, l) => s + l.fan_base, 0) / leads.length : 0,
    avgYear1Rev: leads.length ? leads.reduce((s, l) => s + l.year1_rev, 0) / leads.length : 0,
    leadsBySport: Object.entries(sportCounts).map(([sport, count]) => ({ sport, count })).sort((a, b) => b.count - a.count),
    leadsByRegion: Object.entries(regionCounts).map(([region, count]) => ({ region, count })).sort((a, b) => b.count - a.count),
    revenueOverTime: Object.entries(dateTotals).map(([date, total]) => ({ date, total })).sort((a, b) => a.date.localeCompare(b.date)),
    funnel: [1, 2, 3, 4].map(step => ({ step, count: funnelCounts[step]?.size ?? 0 })),
  }

  return NextResponse.json(stats)
}
