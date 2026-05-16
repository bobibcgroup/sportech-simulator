import { getSupabaseAdmin } from './supabase'

export interface ModelParams {
  // Tier splits (applied to paid users)
  tier_star_pct: number
  tier_superstar_pct: number
  // Annual subscriptions (USD/yr)
  sub_star: number
  sub_superstar: number
  sub_partner: number
  // Predictions (USD/month)
  pred_fan: number
  pred_star: number
  pred_superstar: number
  pred_partner: number
  // Virtual gifts (USD/month per game)
  gift_fan: number
  gift_star: number
  gift_superstar: number
  gift_partner: number
  // Merchandise (USD/month)
  merch_fan: number
  merch_star: number
  merch_superstar: number
  merch_partner: number
  // Token economy (USD/month)
  tokens_fan: number
  tokens_star: number
  tokens_superstar: number
  tokens_partner: number
  // Platform rates
  token_fee_rate: number
  merch_margin: number
  participation_rate: number
  gift_games_rate: number
  club_revenue_share: number
  earnings_multiple: number
  // Spend multipliers
  spend_low: number
  spend_standard: number
  spend_high: number
  // Year-over-year growth multipliers
  growth_yr2: number
  growth_yr3: number
  growth_yr4: number
  growth_yr5: number
}

export const DEFAULT_PARAMS: ModelParams = {
  tier_star_pct: 0.75,
  tier_superstar_pct: 0.225,
  sub_star: 27,
  sub_superstar: 13.23,
  sub_partner: 53.73,
  pred_fan: 2.70,
  pred_star: 27.00,
  pred_superstar: 40.50,
  pred_partner: 81.00,
  gift_fan: 2.70,
  gift_star: 5.40,
  gift_superstar: 13.50,
  gift_partner: 27.00,
  merch_fan: 13.50,
  merch_star: 54.00,
  merch_superstar: 108.00,
  merch_partner: 162.00,
  tokens_fan: 100.44,
  tokens_star: 200.88,
  tokens_superstar: 401.76,
  tokens_partner: 502.20,
  token_fee_rate: 0.0078,
  merch_margin: 0.48,
  participation_rate: 0.50,
  gift_games_rate: 0.60,
  club_revenue_share: 0.50,
  earnings_multiple: 14,
  spend_low: 0.5,
  spend_standard: 1.0,
  spend_high: 1.75,
  growth_yr2: 1.15,
  growth_yr3: 1.18,
  growth_yr4: 1.20,
  growth_yr5: 1.25,
}

export interface ModelParamRow {
  key: string
  value: number
  label: string
  description: string
  category: string
  updated_at: string
}

type ParamKV = { key: string; value: number }

export async function fetchModelParams(): Promise<ModelParams> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (getSupabaseAdmin() as any)
      .from('model_params')
      .select('key, value') as { data: ParamKV[] | null; error: unknown }
    if (error || !data?.length) return DEFAULT_PARAMS
    const overrides = Object.fromEntries(data.map(r => [r.key, Number(r.value)]))
    return { ...DEFAULT_PARAMS, ...overrides }
  } catch {
    return DEFAULT_PARAMS
  }
}

export async function fetchAllParamRows(): Promise<ModelParamRow[]> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (getSupabaseAdmin() as any)
    .from('model_params')
    .select('*')
    .order('category')
    .order('key') as { data: ModelParamRow[] | null; error: unknown }
  if (error || !data) return []
  return data
}

export async function updateModelParam(key: string, value: number): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (getSupabaseAdmin() as any)
    .from('model_params')
    .update({ value, updated_at: new Date().toISOString() })
    .eq('key', key)
}
