interface ViewToggleProps {
  view: 'dashboard' | 'report'
  onChange: (v: 'dashboard' | 'report') => void
}

export default function ViewToggle({ view, onChange }: ViewToggleProps) {
  return (
    <div className="inline-flex rounded-xl border border-slate-200 p-1 bg-slate-50">
      {(['dashboard', 'report'] as const).map(v => (
        <button
          key={v}
          type="button"
          onClick={() => onChange(v)}
          className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all capitalize
            ${view === v ? 'bg-white text-slate-900 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-700'}`}
        >
          {v === 'dashboard' ? '📊 Dashboard' : '📄 Report'}
        </button>
      ))}
    </div>
  )
}
