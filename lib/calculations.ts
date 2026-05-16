import type { WizardData, TierUsers, RevenueResults } from './types'
import type { ModelParams } from './model-params'
import { DEFAULT_PARAMS } from './model-params'

export function computeTiers(
  fanBase: number,
  adoptionPct: number,
  premiumMix: number,
  params: ModelParams = DEFAULT_PARAMS
): TierUsers {
  const totalActive = Math.round(fanBase * adoptionPct)
  const totalPaid = Math.round(totalActive * premiumMix)
  const paidStars = Math.round(totalPaid * params.tier_star_pct)
  const paidSuperStars = Math.round(totalPaid * params.tier_superstar_pct)
  const paidPartners = totalPaid - paidStars - paidSuperStars
  const freeFans = totalActive - totalPaid
  return { freeFans, paidStars, paidSuperStars, paidPartners, totalActive, totalPaid }
}

export function computeRevenue(
  tiers: TierUsers,
  games: number,
  sm: number,
  params: ModelParams = DEFAULT_PARAMS
) {
  const { freeFans, paidStars, paidSuperStars, paidPartners } = tiers
  const p = params

  const subscriptions = (
    paidStars * p.sub_star +
    paidSuperStars * p.sub_superstar +
    paidPartners * p.sub_partner
  ) * sm

  const predictions = (
    freeFans       * p.participation_rate * p.pred_fan       * 12 +
    paidStars      * p.participation_rate * p.pred_star      * 12 +
    paidSuperStars * p.participation_rate * p.pred_superstar * 12 +
    paidPartners   * p.participation_rate * p.pred_partner   * 12
  ) * sm

  const virtualGifts = (
    freeFans       * p.gift_games_rate * p.participation_rate * p.gift_fan       * 12 * games +
    paidStars      * p.gift_games_rate * p.participation_rate * p.gift_star      * 12 * games +
    paidSuperStars * p.gift_games_rate * p.participation_rate * p.gift_superstar * 12 * games +
    paidPartners   * p.gift_games_rate * p.participation_rate * p.gift_partner   * 12 * games
  ) * sm

  const merchandise = (
    freeFans       * p.participation_rate * p.merch_fan       * 12 * p.merch_margin +
    paidStars      * p.participation_rate * p.merch_star      * 12 * p.merch_margin +
    paidSuperStars * p.participation_rate * p.merch_superstar * 12 * p.merch_margin +
    paidPartners   * p.participation_rate * p.merch_partner   * 12 * p.merch_margin
  ) * sm

  const digitalCards = (
    freeFans       * p.participation_rate * p.tokens_fan       * 12 * p.token_fee_rate +
    paidStars      * p.participation_rate * p.tokens_star      * 12 * p.token_fee_rate +
    paidSuperStars * p.participation_rate * p.tokens_superstar * 12 * p.token_fee_rate +
    paidPartners   * p.participation_rate * p.tokens_partner   * 12 * p.token_fee_rate
  ) * sm

  const voting = (
    freeFans       * p.participation_rate * p.voting_fan       * 12 +
    paidStars      * p.participation_rate * p.voting_star      * 12 +
    paidSuperStars * p.participation_rate * p.voting_superstar * 12 +
    paidPartners   * p.participation_rate * p.voting_partner   * 12
  ) * sm

  const tickets = (
    freeFans       * p.participation_rate * p.ticket_fan       * 12 +
    paidStars      * p.participation_rate * p.ticket_star      * 12 +
    paidSuperStars * p.participation_rate * p.ticket_superstar * 12 +
    paidPartners   * p.participation_rate * p.ticket_partner   * 12
  ) * sm

  const nftCollectibles = (
    freeFans       * p.participation_rate * p.nft_fan          * 12 +
    paidStars      * p.participation_rate * p.nft_star         * 12 +
    paidSuperStars * p.participation_rate * p.nft_superstar    * 12 +
    paidPartners   * p.participation_rate * p.nft_partner      * 12
  ) * sm

  return { subscriptions, predictions, virtualGifts, merchandise, digitalCards, voting, tickets, nftCollectibles }
}

export function calculate(data: WizardData, params: ModelParams = DEFAULT_PARAMS): RevenueResults {
  const spendMap: Record<string, number> = {
    low: params.spend_low,
    standard: params.spend_standard,
    high: params.spend_high,
  }
  const sm = spendMap[data.spendLevel] ?? params.spend_standard

  const tiers = computeTiers(data.fanBase, data.adoptionPct, data.premiumMix, params)
  const streams = computeRevenue(tiers, data.gamesPerSeason, sm, params)

  const grossRevenue = Object.values(streams).reduce((a, b) => a + b, 0)
  const clubRevenue = grossRevenue * params.club_revenue_share
  const year1 = clubRevenue

  const yr2 = year1 * params.growth_yr2
  const yr3 = yr2   * params.growth_yr3
  const yr4 = yr3   * params.growth_yr4
  const yr5 = yr4   * params.growth_yr5
  const projection = [year1, yr2, yr3, yr4, yr5]

  const cumulativeTotal = projection.reduce((a, b) => a + b, 0)
  const valuation = yr5 * params.earnings_multiple

  return { tiers, ...streams, grossRevenue, clubRevenue, year1, projection, cumulativeTotal, valuation }
}
