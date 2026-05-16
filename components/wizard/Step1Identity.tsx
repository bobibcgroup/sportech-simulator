import { SPORTS, REGIONS } from '@/lib/constants'
import type { WizardData } from '@/lib/types'

interface Props { data: WizardData; update: (p: Partial<WizardData>) => void; onNext: () => void }

export default function Step1Identity({ data, update, onNext }: Props) {
  const valid = data.clubName.trim().length > 0 && data.sport && data.region

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Tell us about your club</h1>
        <p className="text-slate-500 mt-1 text-sm">We&apos;ll personalise your revenue report based on your market</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Club Name</label>
          <input
            type="text"
            placeholder="e.g. Al Nasser FC"
            value={data.clubName}
            onChange={e => update({ clubName: e.target.value })}
            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent text-base"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Sport</label>
          <div className="grid grid-cols-3 gap-2">
            {SPORTS.map(s => (
              <button
                key={s}
                type="button"
                onClick={() => update({ sport: s })}
                className={`py-2.5 px-3 rounded-xl border text-sm font-medium transition-all
                  ${data.sport === s
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Region</label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {REGIONS.map(r => (
              <button
                key={r}
                type="button"
                onClick={() => update({ region: r })}
                className={`py-2.5 px-3 rounded-xl border text-sm font-medium transition-all
                  ${data.region === r
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'}`}
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
        className="w-full py-4 rounded-xl bg-slate-900 text-white font-semibold text-base disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-800 transition-colors"
      >
        Continue →
      </button>
    </div>
  )
}
