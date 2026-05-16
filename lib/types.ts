export interface WizardData {
  // Step 1
  clubName: string
  sport: string
  region: string
  // Step 2
  logoDataUrl: string | null
  primaryColor: string
  secondaryColor: string
  // Step 3
  fanBase: number
  adoptionPct: number      // 0.01–1.00
  premiumMix: number       // 0.01–1.00
  gamesPerSeason: number   // 1–80
  spendLevel: 'low' | 'standard' | 'high'
  // Step 5
  contactName: string
  contactEmail: string
  contactRole: string
  contactWebsite: string
}

export interface TierUsers {
  freeFans: number
  paidStars: number
  paidSuperStars: number
  paidPartners: number
  totalActive: number
  totalPaid: number
}

export interface RevenueResults {
  tiers: TierUsers
  subscriptions: number
  predictions: number
  virtualGifts: number
  tokenFees: number
  merchandise: number
  digitalCards: number
  grossRevenue: number
  clubRevenue: number
  year1: number
  projection: number[]     // [yr1, yr2, yr3, yr4, yr5]
  cumulativeTotal: number
  valuation: number
}

export interface Lead {
  id: string
  created_at: string
  club_name: string
  sport: string
  region: string
  fan_base: number
  adoption: number
  premium_mix: number
  games: number
  spend_level: string
  name: string
  email: string
  role: string
  website: string
  year1_rev: number
  year5_total: number
  valuation: number
}

export interface FunnelEvent {
  session_id: string
  step: number
}

export interface AdminStats {
  totalLeads: number
  recentLeads: number
  avgFanBase: number
  avgYear1Rev: number
  leadsBySport: { sport: string; count: number }[]
  leadsByRegion: { region: string; count: number }[]
  revenueOverTime: { date: string; total: number }[]
  funnel: { step: number; count: number }[]
}
