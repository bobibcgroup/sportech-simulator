import type { WizardData, TierUsers, RevenueResults } from './types'
import {
  SPEND_MULTIPLIERS, SUB_ANNUAL_USD, PRED_MONTHLY_USD,
  GIFT_MONTHLY_USD, MERCH_MONTHLY_USD, TOKENS_MONTHLY_USD,
  TOKEN_FEE_RATE, MERCH_MARGIN, PARTICIPATION_RATE,
  GIFT_GAMES_RATE, CLUB_REVENUE_SHARE, EARNINGS_MULTIPLE, GROWTH_RATES,
} from './constants'

export function computeTiers(
  fanBase: number,
  adoptionPct: number,
  premiumMix: number
): TierUsers {
  const totalActive = Math.round(fanBase * adoptionPct)
  const totalPaid = Math.round(totalActive * premiumMix)
  const paidStars = Math.round(totalPaid * 0.75)
  const paidSuperStars = Math.round(totalPaid * 0.225)
  const paidPartners = totalPaid - paidStars - paidSuperStars
  const freeFans = totalActive - totalPaid
  return { freeFans, paidStars, paidSuperStars, paidPartners, totalActive, totalPaid }
}

export function computeRevenue(tiers: TierUsers, games: number, sm: number) {
  const { freeFans, paidStars, paidSuperStars, paidPartners } = tiers

  const subscriptions = (
    paidStars * SUB_ANNUAL_USD.star +
    paidSuperStars * SUB_ANNUAL_USD.superStar +
    paidPartners * SUB_ANNUAL_USD.partner
  ) * sm

  const predictions = (
    freeFans * PARTICIPATION_RATE * PRED_MONTHLY_USD.fan * 12 +
    paidStars * PARTICIPATION_RATE * PRED_MONTHLY_USD.star * 12 +
    paidSuperStars * PARTICIPATION_RATE * PRED_MONTHLY_USD.superStar * 12 +
    paidPartners * PARTICIPATION_RATE * PRED_MONTHLY_USD.partner * 12
  ) * sm

  const virtualGifts = (
    freeFans * GIFT_GAMES_RATE * PARTICIPATION_RATE * GIFT_MONTHLY_USD.fan * 12 * games +
    paidStars * GIFT_GAMES_RATE * PARTICIPATION_RATE * GIFT_MONTHLY_USD.star * 12 * games +
    paidSuperStars * GIFT_GAMES_RATE * PARTICIPATION_RATE * GIFT_MONTHLY_USD.superStar * 12 * games +
    paidPartners * GIFT_GAMES_RATE * PARTICIPATION_RATE * GIFT_MONTHLY_USD.partner * 12 * games
  ) * sm

  const tokenFees = (predictions + virtualGifts) * TOKEN_FEE_RATE

  const merchandise = (
    freeFans * PARTICIPATION_RATE * MERCH_MONTHLY_USD.fan * 12 * MERCH_MARGIN +
    paidStars * PARTICIPATION_RATE * MERCH_MONTHLY_USD.star * 12 * MERCH_MARGIN +
    paidSuperStars * PARTICIPATION_RATE * MERCH_MONTHLY_USD.superStar * 12 * MERCH_MARGIN +
    paidPartners * PARTICIPATION_RATE * MERCH_MONTHLY_USD.partner * 12 * MERCH_MARGIN
  ) * sm

  const digitalCards = (
    freeFans * PARTICIPATION_RATE * TOKENS_MONTHLY_USD.fan * 12 * TOKEN_FEE_RATE +
    paidStars * PARTICIPATION_RATE * TOKENS_MONTHLY_USD.star * 12 * TOKEN_FEE_RATE +
    paidSuperStars * PARTICIPATION_RATE * TOKENS_MONTHLY_USD.superStar * 12 * TOKEN_FEE_RATE +
    paidPartners * PARTICIPATION_RATE * TOKENS_MONTHLY_USD.partner * 12 * TOKEN_FEE_RATE
  ) * sm

  return { subscriptions, predictions, virtualGifts, tokenFees, merchandise, digitalCards }
}

export function calculate(data: WizardData): RevenueResults {
  const sm = SPEND_MULTIPLIERS[data.spendLevel]
  const tiers = computeTiers(data.fanBase, data.adoptionPct, data.premiumMix)
  const streams = computeRevenue(tiers, data.gamesPerSeason, sm)

  const grossRevenue = Object.values(streams).reduce((a, b) => a + b, 0)
  const clubRevenue = grossRevenue * CLUB_REVENUE_SHARE
  const year1 = clubRevenue

  const projection = GROWTH_RATES.map(r => year1 * r)
  const cumulativeTotal = projection.reduce((a, b) => a + b, 0)
  const valuation = projection[4] * EARNINGS_MULTIPLE

  return { tiers, ...streams, grossRevenue, clubRevenue, year1, projection, cumulativeTotal, valuation }
}
