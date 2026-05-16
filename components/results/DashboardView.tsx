'use client'
import type { WizardData, RevenueResults } from '@/lib/types'
import StreamCards from './StreamCards'

interface Props { data: WizardData; results: RevenueResults }

const fmtM = (n: number) =>
  n >= 1_000_000_000 ? `$${(n / 1_000_000_000).toFixed(2)}B`
  : n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(2)}M`
  : `$${(n / 1_000).toFixed(0)}K`

const pct = (n: number) => `${(n * 100).toFixed(1)}%`

const SPEND_LABELS: Record<string, string> = {
  low: 'Conservative (×0.5)',
  standard: 'Standard (×1.0)',
  high: 'High Engagement (×1.75)',
}

function Row({ label, value, highlight, indent, formula }: {
  label: string; value: string; highlight?: boolean; indent?: boolean; formula?: string
}) {
  return (
    <div
      className={`flex items-start justify-between gap-4 py-2.5 ${indent ? 'pl-4' : ''}`}
      style={{ borderBottom: '1px solid var(--hairline)' }}
    >
      <div className="min-w-0">
        <span className={`text-sm ${indent ? '' : 'font-medium'}`}
          style={{ color: indent ? 'var(--muted)' : 'var(--body-strong)' }}>
          {label}
        </span>
        {formula && <p className="text-[11px] mt-0.5 font-mono" style={{ color: 'var(--muted-soft)' }}>{formula}</p>}
      </div>
      <span
        className="text-sm font-bold shrink-0"
        style={{ color: highlight ? 'var(--primary)' : 'var(--ink)' }}
      >
        {value}
      </span>
    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs uppercase tracking-widest font-semibold pt-2 pb-1" style={{ color: 'var(--muted)' }}>
      {children}
    </p>
  )
}

export default function DashboardView({ data, results }: Props) {
  const { tiers, grossRevenue, year1, projection, cumulativeTotal, valuation } = results
  const clubSharePct = grossRevenue > 0 ? year1 / grossRevenue : 0
  const tierStarPct = tiers.totalPaid > 0 ? tiers.paidStars / tiers.totalPaid : 0
  const tierSuperPct = tiers.totalPaid > 0 ? tiers.paidSuperStars / tiers.totalPaid : 0

  const streams = [
    { label: 'Subscriptions',      value: results.subscriptions,    icon: '👑' },
    { label: 'Predictions',        value: results.predictions,      icon: '🎯' },
    { label: 'Live Gifting',       value: results.virtualGifts,     icon: '🎁' },
    { label: 'Merchandise',        value: results.merchandise,      icon: '👕' },
    { label: 'Digital Gift Cards', value: results.digitalCards,     icon: '🃏' },
    { label: 'Interactive Voting', value: results.voting,           icon: '🗳️' },
    { label: 'Tickets',            value: results.tickets,          icon: '🎟️' },
    { label: 'NFT & Collectibles', value: results.nftCollectibles,  icon: '✨' },
  ].sort((a, b) => b.value - a.value)

  return (
    <div className="space-y-10">

      {/* ── Stream cards ── */}
      <StreamCards results={results} />

      {/* ── Math Breakdown ── */}
      <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--hairline)' }}>
        <div className="px-5 py-4" style={{ background: 'var(--surface-card)', borderBottom: '1px solid var(--hairline)' }}>
          <p className="text-sm font-bold" style={{ color: 'var(--ink)' }}>How your revenue is calculated</p>
          <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>Full calculation trace — rates reflect current admin parameters</p>
        </div>

        <div className="px-5 pb-5 space-y-1" style={{ background: 'var(--surface-soft)' }}>

          {/* Step 1: Audience */}
          <SectionLabel>Step 1 — Audience</SectionLabel>
          <div className="rounded-lg overflow-hidden" style={{ border: '1px solid var(--hairline)' }}>
            <div className="px-4" style={{ background: 'var(--surface-card)' }}>
              <Row
                label="Fan Base"
                value={data.fanBase.toLocaleString()}
                formula="Wizard input"
              />
              <Row
                label="Platform Adoption"
                value={`${pct(data.adoptionPct)} → ${tiers.totalActive.toLocaleString()} active users`}
                formula={`${data.fanBase.toLocaleString()} × ${pct(data.adoptionPct)} = ${tiers.totalActive.toLocaleString()}`}
              />
              <Row
                label="Premium Mix"
                value={`${pct(data.premiumMix)} → ${tiers.totalPaid.toLocaleString()} paid users`}
                formula={`${tiers.totalActive.toLocaleString()} active × ${pct(data.premiumMix)} = ${tiers.totalPaid.toLocaleString()} paid`}
              />
            </div>
          </div>

          {/* Step 2: Tier split */}
          <SectionLabel>Step 2 — Tier Distribution (admin: tier_star_pct / tier_superstar_pct)</SectionLabel>
          <div className="rounded-lg overflow-hidden" style={{ border: '1px solid var(--hairline)' }}>
            <div className="px-4" style={{ background: 'var(--surface-card)' }}>
              <Row label="Free Fans"  value={tiers.freeFans.toLocaleString()}       indent formula={`${tiers.totalActive.toLocaleString()} active − ${tiers.totalPaid.toLocaleString()} paid`} />
              <Row label="Stars"      value={tiers.paidStars.toLocaleString()}      indent formula={`${tiers.totalPaid.toLocaleString()} paid × ${pct(tierStarPct)} (tier_star_pct)`} />
              <Row label="SuperStars" value={tiers.paidSuperStars.toLocaleString()} indent formula={`${tiers.totalPaid.toLocaleString()} paid × ${pct(tierSuperPct)} (tier_superstar_pct)`} />
              <Row label="Partners"   value={tiers.paidPartners.toLocaleString()}   indent formula={`${tiers.totalPaid.toLocaleString()} paid − Stars − SuperStars (remainder)`} />
            </div>
          </div>

          {/* Step 3: Revenue streams */}
          <SectionLabel>Step 3 — Revenue Streams (admin: sub_*, pred_*, gift_*, merch_*, tokens_*, voting_*, ticket_*, nft_*)</SectionLabel>
          <div className="rounded-lg overflow-hidden" style={{ border: '1px solid var(--hairline)' }}>
            <div className="px-4" style={{ background: 'var(--surface-card)' }}>
              {streams.map(s => (
                <Row
                  key={s.label}
                  label={`${s.icon} ${s.label}`}
                  value={fmtM(s.value)}
                  indent
                  formula={`${(s.value / grossRevenue * 100).toFixed(1)}% of gross  ·  per-tier rates × participation rate × 12 months`}
                />
              ))}
              <Row label="Gross Platform Revenue" value={fmtM(grossRevenue)} highlight
                formula={streams.map(s => fmtM(s.value)).join(' + ')} />
            </div>
          </div>

          {/* Step 4: Spend multiplier */}
          <SectionLabel>Step 4 — Spend Multiplier (admin: spend_low / spend_standard / spend_high)</SectionLabel>
          <div className="rounded-lg overflow-hidden" style={{ border: '1px solid var(--hairline)' }}>
            <div className="px-4" style={{ background: 'var(--surface-card)' }}>
              <Row
                label={`Spend Level: ${data.spendLevel}`}
                value={SPEND_LABELS[data.spendLevel] ?? data.spendLevel}
                formula="Already applied to stream calculations above"
              />
            </div>
          </div>

          {/* Step 5: Club share */}
          <SectionLabel>Step 5 — Club Revenue Share (admin: club_revenue_share)</SectionLabel>
          <div className="rounded-lg overflow-hidden" style={{ border: '1px solid var(--hairline)' }}>
            <div className="px-4" style={{ background: 'var(--surface-card)' }}>
              <Row
                label="Gross Revenue"
                value={fmtM(grossRevenue)}
                formula="From Step 3"
              />
              <Row
                label={`Club Share Rate (up to)`}
                value={pct(clubSharePct)}
                indent
                formula="admin → Platform Rates → club_revenue_share"
              />
              <Row
                label="Year 1 Club Revenue"
                value={fmtM(year1)}
                highlight
                formula={`${fmtM(grossRevenue)} × ${pct(clubSharePct)} = ${fmtM(year1)}`}
              />
            </div>
          </div>

          {/* Step 6: 5-year projection */}
          <SectionLabel>Step 6 — 5-Year Growth (admin: growth_yr2 … growth_yr5)</SectionLabel>
          <div className="rounded-lg overflow-hidden" style={{ border: '1px solid var(--hairline)' }}>
            <div className="px-4" style={{ background: 'var(--surface-card)' }}>
              {projection.map((v, i) => (
                <Row
                  key={i}
                  label={`Year ${i + 1}  (${2026 + i})`}
                  value={fmtM(v)}
                  highlight={i === 0}
                  indent={i > 0}
                  formula={
                    i === 0
                      ? 'Base year (from Step 5)'
                      : `${fmtM(projection[i - 1])} × ${(v / projection[i - 1]).toFixed(4)} (growth_yr${i + 1})`
                  }
                />
              ))}
              <Row
                label="5-Year Cumulative"
                value={fmtM(cumulativeTotal)}
                highlight
                formula={projection.map(v => fmtM(v)).join(' + ')}
              />
              <Row
                label="Implied Valuation"
                value={fmtM(valuation)}
                formula={`Year 5 ${fmtM(projection[4])} × 14× earnings multiple (admin: earnings_multiple)`}
              />
            </div>
          </div>

          <p className="text-[11px] pt-3" style={{ color: 'var(--muted-soft)' }}>
            All rates and multipliers are configurable in the Admin → Model Parameters panel. Figures are illustrative — actual club revenue depends on agreed deal terms.
          </p>
        </div>
      </div>

    </div>
  )
}
