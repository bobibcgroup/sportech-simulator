interface ViewToggleProps {
  view: 'dashboard' | 'report'
  onChange: (v: 'dashboard' | 'report') => void
}

export default function ViewToggle({ view, onChange }: ViewToggleProps) {
  return (
    <div
      className="inline-flex rounded-lg p-1"
      style={{ background: 'var(--surface-card)', border: '1px solid var(--hairline)' }}
    >
      {(['dashboard', 'report'] as const).map(v => (
        <button
          key={v}
          type="button"
          onClick={() => onChange(v)}
          className="px-3 py-1.5 rounded-md text-sm font-medium transition-all capitalize"
          style={
            view === v
              ? { background: 'var(--primary)', color: 'var(--on-primary)' }
              : { color: 'var(--muted)' }
          }
        >
          {v === 'dashboard' ? '📊 Dashboard' : '📄 Report'}
        </button>
      ))}
    </div>
  )
}
