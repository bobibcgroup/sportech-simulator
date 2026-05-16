interface KpiStripProps {
  year1: number
  cumulativeTotal: number
  valuation: number
  primaryColor: string
}

const fmtM = (n: number) =>
  n >= 1_000_000_000 ? `$${(n / 1_000_000_000).toFixed(1)}B` : `$${(n / 1_000_000).toFixed(1)}M`

export default function KpiStrip({ year1, cumulativeTotal, valuation, primaryColor }: KpiStripProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {[
        { label: 'Year 1 Revenue', value: fmtM(year1), sub: "Club's 50% share", highlight: true },
        { label: '5-Year Cumulative', value: fmtM(cumulativeTotal), sub: '2025–2030 total' },
        { label: 'Implied Valuation', value: fmtM(valuation), sub: 'At 14× earnings multiple' },
      ].map(k => (
        <div
          key={k.label}
          className={`rounded-2xl p-5 ${k.highlight ? 'text-white' : 'bg-slate-50 border border-slate-100'}`}
          style={k.highlight ? { background: primaryColor } : {}}
        >
          <p className={`text-xs uppercase tracking-wider font-medium mb-1 ${k.highlight ? 'text-white/60' : 'text-slate-400'}`}>
            {k.label}
          </p>
          <p className={`text-3xl font-black ${k.highlight ? 'text-white' : 'text-slate-900'}`}>{k.value}</p>
          <p className={`text-xs mt-1 ${k.highlight ? 'text-white/70' : 'text-slate-400'}`}>{k.sub}</p>
        </div>
      ))}
    </div>
  )
}
