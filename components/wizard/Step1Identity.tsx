import { SPORTS, REGIONS } from '@/lib/constants'
import type { WizardData } from '@/lib/types'

interface Props { data: WizardData; update: (p: Partial<WizardData>) => void; onNext: () => void }

const btnBase = 'py-2.5 px-3 rounded-lg border text-sm font-medium transition-all'
const btnActive = { background: 'var(--primary)', color: 'var(--on-primary)', border: '1px solid var(--primary)' }
const btnIdle = { background: 'var(--surface-card)', color: 'var(--body)', border: '1px solid var(--hairline)' }

export default function Step1Identity({ data, update, onNext }: Props) {
  const valid = data.clubName.trim().length > 0 && data.sport && data.region

  return (
    <div className="w-full space-y-6 animate-in">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--body-strong)' }}>
            Club / Organisation Name
          </label>
          <input
            type="text"
            placeholder="e.g. Al Nasser FC"
            value={data.clubName}
            onChange={e => update({ clubName: e.target.value })}
            className="w-full rounded-lg px-4 py-3 text-base outline-none transition-all"
            style={{
              background: 'var(--surface-card)',
              color: 'var(--ink)',
              border: '1px solid var(--hairline)',
            }}
            onFocus={e => { e.currentTarget.style.borderColor = 'var(--primary)' }}
            onBlur={e => { e.currentTarget.style.borderColor = 'var(--hairline)' }}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--body-strong)' }}>Sport</label>
          <div className="grid grid-cols-3 gap-2">
            {SPORTS.map(s => (
              <button
                key={s}
                type="button"
                onClick={() => update({ sport: s })}
                className={btnBase}
                style={data.sport === s ? btnActive : btnIdle}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--body-strong)' }}>Region</label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {REGIONS.map(r => (
              <button
                key={r}
                type="button"
                onClick={() => update({ region: r })}
                className={btnBase}
                style={data.region === r ? btnActive : btnIdle}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={onNext}
        disabled={!valid}
        className="w-full py-4 rounded-lg font-semibold text-base transition-all"
        style={{
          background: valid ? 'var(--primary)' : 'var(--primary-disabled)',
          color: valid ? 'var(--on-primary)' : 'var(--muted)',
          cursor: valid ? 'pointer' : 'not-allowed',
        }}
      >
        Continue →
      </button>
    </div>
  )
}
