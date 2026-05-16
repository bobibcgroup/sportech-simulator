export const SPEND_MULTIPLIERS = {
  low: 0.5,
  standard: 1.0,
  high: 1.75,
} as const

export const TIER_SPLITS = {
  fan: 0.60,
  star: 0.30,
  superStar: 0.09,
  partner: 0.01,
} as const

export const SUB_ANNUAL_USD = {
  fan: 0,
  star: 27,
  superStar: 13.23,
  partner: 53.73,
} as const

export const PRED_MONTHLY_USD = {
  fan: 2.70,
  star: 27.00,
  superStar: 40.50,
  partner: 81.00,
} as const

export const GIFT_MONTHLY_USD = {
  fan: 2.70,
  star: 5.40,
  superStar: 13.50,
  partner: 27.00,
} as const

export const MERCH_MONTHLY_USD = {
  fan: 13.50,
  star: 54.00,
  superStar: 108.00,
  partner: 162.00,
} as const

export const TOKENS_MONTHLY_USD = {
  fan: 100.44,
  star: 200.88,
  superStar: 401.76,
  partner: 502.20,
} as const

export const TOKEN_FEE_RATE = 0.0078
export const MERCH_MARGIN = 0.48
export const PARTICIPATION_RATE = 0.50
export const GIFT_GAMES_RATE = 0.60
export const CLUB_REVENUE_SHARE = 0.50
export const EARNINGS_MULTIPLE = 14

export const GROWTH_RATES = [1, 1.15, 1.15 * 1.18, 1.15 * 1.18 * 1.20, 1.15 * 1.18 * 1.20 * 1.25] as const

export const WIZARD_DEFAULTS = {
  adoptionPct: 0.04,
  premiumMix: 0.18,
  gamesPerSeason: 38,
  spendLevel: 'standard' as const,
  primaryColor: '#faff69',
  secondaryColor: '#3b82f6',
}

export const SPORTS = ['Football', 'Basketball', 'Cricket', 'Tennis', 'Golf', 'Other'] as const
export const REGIONS = ['Middle East', 'Europe', 'Africa', 'Asia', 'Other'] as const
