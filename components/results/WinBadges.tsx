const WINS = [
  { icon: '🛡️', title: 'Zero risk to club', desc: 'SporTech builds and operates everything at our cost' },
  { icon: '⚡', title: 'Live in weeks', desc: 'Not months — full platform deployed rapidly' },
  { icon: '💰', title: '50% revenue is yours', desc: 'Significant share of all streams from day one' },
  { icon: '⭐', title: 'Players earn too', desc: 'Players get 30% of virtual gifts — they\'re motivated' },
]

export default function WinBadges() {
  return (
    <div className="grid grid-cols-2 gap-3">
      {WINS.map(w => (
        <div key={w.title} className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
          <div className="text-2xl mb-2">{w.icon}</div>
          <h4 className="text-sm font-bold text-slate-900">{w.title}</h4>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">{w.desc}</p>
        </div>
      ))}
    </div>
  )
}
