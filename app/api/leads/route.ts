import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'
import { isAdminAuthenticated } from '@/lib/adminAuth'
import { fetchModelParams } from '@/lib/model-params'
import { calculate } from '@/lib/calculations'
import type { WizardData } from '@/lib/types'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const body = await req.json()

  const wizardData: WizardData = {
    clubName: body.club_name,
    sport: body.sport,
    region: body.region,
    logoDataUrl: null,
    primaryColor: body.primary_color ?? '#faff69',
    secondaryColor: body.secondary_color ?? '#3b82f6',
    fanBase: body.fan_base,
    adoptionPct: body.adoption,
    premiumMix: body.premium_mix,
    gamesPerSeason: body.games,
    spendLevel: body.spend_level,
    contactName: body.name,
    contactEmail: body.email,
    contactRole: body.role,
    contactWebsite: body.website ?? '',
  }

  const params = await fetchModelParams()
  const results = calculate(wizardData, params)

  const leadRow = {
    club_name:   body.club_name,
    sport:       body.sport,
    region:      body.region,
    fan_base:    body.fan_base,
    adoption:    body.adoption,
    premium_mix: body.premium_mix,
    games:       body.games,
    spend_level: body.spend_level,
    name:        body.name,
    email:       body.email,
    role:        body.role,
    website:     body.website,
    year1_rev:   results.year1,
    year5_total: results.cumulativeTotal,
    valuation:   results.valuation,
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await getSupabaseAdmin().from('leads').insert(leadRow as any)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ ok: true, results })
}

export async function GET() {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { data, error } = await getSupabaseAdmin()
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
