import type { WizardData, RevenueResults } from '@/lib/types'
import StreamCards from './StreamCards'
import ProjectionChart from './ProjectionChart'

const fmtM = (n: number) => `$${(n / 1_000_000).toFixed(1)}M`

interface Props { data: WizardData; results: RevenueResults }

export default function ReportView({ data, results }: Props) {
  const yr = (i: number) => 2026 + i

  return (
    <div className="space-y-10">
      <div className="text-center py-8" style={{ borderBottom: '1px solid var(--hairline)' }}>
        {data.logoDataUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={data.logoDataUrl} alt="logo" className="h-16 w-16 rounded-2xl object-contain mx-auto mb-4" style={{ border: '1px solid var(--hairline)' }} />
        )}
        <p className="text-xs uppercase tracking-widest font-semibold mb-2" style={{ color: 'var(--muted)' }}>
          Estimated Club Share — Year 1
        </p>
        <h2 className="text-5xl font-black tracking-tight" style={{ color: 'var(--primary)', letterSpacing: '-1.5px' }}>
          {fmtM(results.year1)}
        </h2>
        <p className="text-sm mt-2" style={{ color: 'var(--muted)' }}>{data.clubName} · Revenue Simulation 2026–2030</p>
      </div>

      <div>
        <p className="text-xs uppercase tracking-widest font-semibold mb-3" style={{ color: 'var(--muted)' }}>Executive Summary</p>
        <p className="leading-relaxed text-sm" style={{ color: 'var(--body)' }}>
          Based on a fan base of {(data.fanBase / 1_000_000).toFixed(1)}M fans with {(data.adoptionPct * 100).toFixed(0)}% platform adoption,
          {' '}{data.clubName} could generate <strong style={{ color: 'var(--primary)' }}>{fmtM(results.year1)}</strong> in Year 1 through the SporTech platform —
          growing to <strong style={{ color: 'var(--ink)' }}>{fmtM(results.cumulativeTotal)}</strong> cumulatively over five years.
          At a {(data.premiumMix * 100).toFixed(0)}% premium tier conversion across {results.tiers.totalActive.toLocaleString()} active users,
          the platform unlocks six distinct revenue streams at zero operational cost to the club.
          SporTech builds, deploys, and operates the entire platform — revenue share and engagement terms are agreed per deal.
        </p>
      </div>

      <div>
        <p className="text-xs uppercase tracking-widest font-semibold mb-3" style={{ color: 'var(--muted)' }}>5-Year Projection</p>
        <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid var(--hairline)' }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: 'var(--surface-soft)' }}>
                <th className="text-left px-4 py-3 text-xs uppercase tracking-wide font-semibold" style={{ color: 'var(--muted)' }}>Year</th>
                {results.projection.map((_, i) => (
                  <th key={i} className="text-right px-4 py-3 text-xs uppercase tracking-wide font-semibold" style={{ color: 'var(--muted)' }}>{yr(i)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderTop: '1px solid var(--hairline)' }}>
                <td className="px-4 py-3 font-medium" style={{ color: 'var(--body)' }}>Club Revenue</td>
                {results.projection.map((v, i) => (
                  <td key={i} className="px-4 py-3 text-right font-black" style={{ color: 'var(--primary)' }}>{fmtM(v)}</td>
                ))}
              </tr>
              <tr style={{ borderTop: '1px solid var(--hairline)', background: 'var(--surface-soft)' }}>
                <td className="px-4 py-3 font-medium" style={{ color: 'var(--body)' }}>YoY Growth</td>
                {results.projection.map((v, i) => (
                  <td key={i} className="px-4 py-3 text-right font-semibold text-xs" style={{ color: '#22c55e' }}>
                    {i === 0 ? '—' : `+${(((v / results.projection[i - 1]) - 1) * 100).toFixed(0)}%`}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <ProjectionChart projection={results.projection} primaryColor={data.primaryColor} />
      <StreamCards results={results} />
    </div>
  )
}
