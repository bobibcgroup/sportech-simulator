import type { WizardData, RevenueResults } from '@/lib/types'
import StreamCards from './StreamCards'
import ProjectionChart from './ProjectionChart'

const fmtM = (n: number) => `$${(n / 1_000_000).toFixed(1)}M`

interface Props { data: WizardData; results: RevenueResults }

export default function ReportView({ data, results }: Props) {
  const yr = (i: number) => 2026 + i

  return (
    <div className="space-y-10">
      <div className="text-center py-8 border-b border-slate-100">
        {data.logoDataUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={data.logoDataUrl} alt="logo" className="h-16 w-16 rounded-2xl object-contain mx-auto mb-4 border border-slate-100" />
        )}
        <h2 className="text-4xl font-black text-slate-900">{fmtM(results.year1)}</h2>
        <p className="text-slate-500 mt-2 text-sm">Estimated Year 1 Revenue — {data.clubName}</p>
      </div>

      <div>
        <h3 className="text-lg font-bold text-slate-900 mb-3">Executive Summary</h3>
        <p className="text-slate-600 leading-relaxed text-sm">
          Based on a fan base of {(data.fanBase / 1_000_000).toFixed(1)}M fans with {(data.adoptionPct * 100).toFixed(0)}% platform adoption,
          {' '}{data.clubName} could generate <strong>{fmtM(results.year1)}</strong> in Year 1 through the SporTech platform —
          growing to <strong>{fmtM(results.cumulativeTotal)}</strong> cumulatively over five years.
          At a {(data.premiumMix * 100).toFixed(0)}% premium tier conversion across {results.tiers.totalActive.toLocaleString()} active users,
          the platform unlocks six distinct revenue streams at zero operational cost to the club.
          SporTech builds, deploys, and operates the entire platform in exchange for a 50% revenue share.
        </p>
      </div>

      <div>
        <h3 className="text-lg font-bold text-slate-900 mb-3">5-Year P&amp;L Projection</h3>
        <div className="overflow-x-auto rounded-2xl border border-slate-100">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left px-4 py-3 text-slate-500 font-semibold text-xs uppercase tracking-wide">Year</th>
                {results.projection.map((_, i) => (
                  <th key={i} className="text-right px-4 py-3 text-slate-500 font-semibold text-xs uppercase tracking-wide">{yr(i)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-slate-100">
                <td className="px-4 py-3 text-slate-600 font-medium">Club Revenue</td>
                {results.projection.map((v, i) => (
                  <td key={i} className="px-4 py-3 text-right font-bold text-slate-900">{fmtM(v)}</td>
                ))}
              </tr>
              <tr className="border-t border-slate-100 bg-slate-50">
                <td className="px-4 py-3 text-slate-600 font-medium">YoY Growth</td>
                {results.projection.map((v, i) => (
                  <td key={i} className="px-4 py-3 text-right text-green-600 font-semibold text-xs">
                    {i === 0 ? '—' : `+${(((v / results.projection[i - 1]) - 1) * 100).toFixed(0)}%`}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <ProjectionChart projection={results.projection} primaryColor={data.primaryColor} />
      <StreamCards results={results} primaryColor={data.primaryColor} />
    </div>
  )
}
