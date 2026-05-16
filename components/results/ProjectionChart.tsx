'use client'

const fmtM = (n: number) =>
  n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(1)}M` : `$${(n / 1_000).toFixed(0)}K`

interface Props { projection: number[]; primaryColor: string }

export default function ProjectionChart({ projection, primaryColor }: Props) {
  const max = Math.max(...projection, 1)
  const years = projection.map((v, i) => ({ year: 2026 + i, value: v }))

  // SVG polyline points (normalized to 0–100 coords)
  const W = 400
  const H = 120
  const PAD = { top: 10, right: 10, bottom: 24, left: 8 }
  const innerW = W - PAD.left - PAD.right
  const innerH = H - PAD.top - PAD.bottom

  const pts = years.map((d, i) => {
    const x = PAD.left + (i / (years.length - 1)) * innerW
    const y = PAD.top + (1 - d.value / max) * innerH
    return { x, y, ...d }
  })

  const polyline = pts.map(p => `${p.x},${p.y}`).join(' ')
  const areaPath = `M${pts[0].x},${pts[0].y} ${pts.slice(1).map(p => `L${p.x},${p.y}`).join(' ')} L${pts[pts.length - 1].x},${PAD.top + innerH} L${pts[0].x},${PAD.top + innerH} Z`

  return (
    <div>
      <p className="text-xs uppercase tracking-widest font-semibold mb-4" style={{ color: 'var(--muted)' }}>5-Year Revenue Projection</p>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ overflow: 'visible' }}>
        <defs>
          <linearGradient id="proj-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={primaryColor} stopOpacity={0.25} />
            <stop offset="100%" stopColor={primaryColor} stopOpacity={0} />
          </linearGradient>
        </defs>
        {/* area fill */}
        <path d={areaPath} fill="url(#proj-fill)" />
        {/* line */}
        <polyline points={polyline} fill="none" stroke={primaryColor} strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />
        {/* dots + labels */}
        {pts.map(p => (
          <g key={p.year}>
            <circle cx={p.x} cy={p.y} r={4} fill={primaryColor} />
            <text x={p.x} y={p.y - 8} textAnchor="middle" fontSize={9} fill={primaryColor} fontWeight={700}>
              {fmtM(p.value)}
            </text>
            <text x={p.x} y={H - 4} textAnchor="middle" fontSize={10} fill="#94a3b8">
              {p.year}
            </text>
          </g>
        ))}
      </svg>
    </div>
  )
}
