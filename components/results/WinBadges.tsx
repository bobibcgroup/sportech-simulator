const WINS = [
  { icon: '🛡️', title: 'Zero risk to club', desc: 'SporTech builds and operates everything at our cost' },
  { icon: '⚡', title: 'Live in weeks', desc: 'Not months — full platform deployed rapidly' },
  { icon: '💰', title: 'Revenue share yours', desc: 'Significant share of all streams, terms agreed per deal' },
  { icon: '⭐', title: 'Player incentives', desc: 'Clubs can choose to reward players from gifting revenue — keeping squad and fans engaged' },
]

export default function WinBadges() {
  return (
    <div className="grid grid-cols-2 gap-3">
      {WINS.map(w => (
        <div
          key={w.title}
          className="rounded-xl p-4"
          style={{ background: 'var(--surface-card)', border: '1px solid var(--hairline)' }}
        >
          <div className="text-2xl mb-2">{w.icon}</div>
          <h4 className="text-sm font-bold mb-1" style={{ color: 'var(--ink)' }}>{w.title}</h4>
          <p className="text-xs leading-relaxed" style={{ color: 'var(--muted)' }}>{w.desc}</p>
        </div>
      ))}
    </div>
  )
}
