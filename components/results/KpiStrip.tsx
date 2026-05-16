interface KpiStripProps {
  year1: number
  cumulativeTotal: number
  valuation: number
}

const fmtM = (n: number) =>
  n >= 1_000_000_000 ? `$${(n / 1_000_000_000).toFixed(1)}B` : `$${(n / 1_000_000).toFixed(1)}M`

export default function KpiStrip({ year1, cumulativeTotal, valuation }: KpiStripProps) {
  const stats = [
    { label: 'Year 1 Revenue', value: fmtM(year1), sub: 'Estimated club share', featured: true },
    { label: '5-Year Cumulative', value: fmtM(cumulativeTotal), sub: '2026–2030 total', featured: false },
    { label: 'Implied Valuation', value: fmtM(valuation), sub: 'At 14× earnings multiple', featured: false },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {stats.map(k => (
        <div
          key={k.label}
          className="rounded-xl p-5"
          style={{
            background: k.featured ? 'var(--primary)' : 'var(--surface-card)',
            border: k.featured ? 'none' : '1px solid var(--hairline)',
          }}
        >
          <p className="text-xs uppercase tracking-widest font-semibold mb-2"
            style={{ color: k.featured ? 'rgba(10,10,10,0.55)' : 'var(--muted)' }}>
            {k.label}
          </p>
          <p className="text-4xl font-black tracking-tight leading-none mb-1"
            style={{ color: k.featured ? '#0a0a0a' : 'var(--primary)', letterSpacing: '-1.5px' }}>
            {k.value}
          </p>
          <p className="text-xs" style={{ color: k.featured ? 'rgba(10,10,10,0.6)' : 'var(--muted)' }}>
            {k.sub}
          </p>
        </div>
      ))}
    </div>
  )
}
