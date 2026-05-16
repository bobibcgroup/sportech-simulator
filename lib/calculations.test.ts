import { describe, it, expect } from 'vitest'
import { computeTiers, computeRevenue, calculate } from './calculations'
import type { WizardData } from './types'

const baseData: WizardData = {
  clubName: 'Test FC',
  sport: 'Football',
  region: 'Middle East',
  logoDataUrl: null,
  primaryColor: '#000',
  secondaryColor: '#fff',
  fanBase: 10_000_000,
  adoptionPct: 0.04,
  premiumMix: 0.18,
  gamesPerSeason: 40,
  spendLevel: 'standard',
  contactName: '',
  contactEmail: '',
  contactRole: '',
  contactWebsite: '',
}

describe('computeTiers', () => {
  it('computes active users as fanBase × adoptionPct', () => {
    const t = computeTiers(10_000_000, 0.04, 0.18)
    expect(t.totalActive).toBe(400_000)
  })

  it('computes paid users as activeUsers × premiumMix', () => {
    const t = computeTiers(10_000_000, 0.04, 0.18)
    expect(t.totalPaid).toBe(72_000)
  })

  it('free fans = totalActive - totalPaid', () => {
    const t = computeTiers(10_000_000, 0.04, 0.18)
    expect(t.freeFans).toBe(328_000)
  })
})

describe('calculate', () => {
  it('returns positive year1 revenue', () => {
    const r = calculate(baseData)
    expect(r.year1).toBeGreaterThan(0)
  })

  it('club revenue is 50% of gross', () => {
    const r = calculate(baseData)
    expect(r.clubRevenue).toBeCloseTo(r.grossRevenue * 0.5, 0)
  })

  it('projection has 5 years', () => {
    const r = calculate(baseData)
    expect(r.projection.length).toBe(5)
  })

  it('projection year 1 equals year1', () => {
    const r = calculate(baseData)
    expect(r.projection[0]).toBeCloseTo(r.year1, 0)
  })

  it('projection grows year over year', () => {
    const r = calculate(baseData)
    expect(r.projection[1]).toBeGreaterThan(r.projection[0])
    expect(r.projection[4]).toBeGreaterThan(r.projection[3])
  })

  it('valuation is year5 × 14', () => {
    const r = calculate(baseData)
    expect(r.valuation).toBeCloseTo(r.projection[4] * 14, 0)
  })

  it('high spend multiplier produces more revenue than standard', () => {
    const high = calculate({ ...baseData, spendLevel: 'high' })
    const std = calculate({ ...baseData, spendLevel: 'standard' })
    expect(high.year1).toBeGreaterThan(std.year1)
  })

  it('more games increases virtual gifts', () => {
    const more = calculate({ ...baseData, gamesPerSeason: 60 })
    const less = calculate({ ...baseData, gamesPerSeason: 20 })
    expect(more.virtualGifts).toBeGreaterThan(less.virtualGifts)
  })
})
