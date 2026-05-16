interface ProgressBarProps {
  currentStep: number
  totalSteps: number
}

const STEP_META = [
  { label: 'Club', desc: 'Identity' },
  { label: 'Brand', desc: 'Branding' },
  { label: 'Numbers', desc: 'Your Inputs' },
  { label: 'Preview', desc: 'Report Preview' },
  { label: 'Unlock', desc: 'Get Report' },
]

export default function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  return (
    <div className="w-full px-4 pt-6 pb-4" style={{ background: 'var(--canvas)' }}>
      <div className="flex items-center max-w-lg mx-auto">
        {Array.from({ length: totalSteps }).map((_, i) => {
          const step = i + 1
          const done = step < currentStep
          const active = step === currentStep
          return (
            <div key={step} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all"
                  style={{
                    background: done || active ? 'var(--primary)' : 'var(--surface-elevated)',
                    color: done || active ? 'var(--on-primary)' : 'var(--muted)',
                    boxShadow: active ? '0 0 0 3px rgba(250,255,105,0.25)' : 'none',
                  }}
                >
                  {done ? '✓' : step}
                </div>
                <span
                  className="mt-1 text-[10px] hidden sm:block font-medium"
                  style={{ color: active ? 'var(--primary)' : 'var(--muted)' }}
                >
                  {STEP_META[i]?.label}
                </span>
              </div>
              {step < totalSteps && (
                <div className="flex-1 h-[2px] mx-2 rounded-full" style={{ background: 'var(--hairline)' }}>
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: done ? '100%' : '0%', background: 'var(--primary)' }}
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="max-w-lg mx-auto mt-2 text-center">
        <p className="text-xs" style={{ color: 'var(--muted)' }}>
          Step {currentStep} of {totalSteps} — {STEP_META[currentStep - 1]?.desc}
        </p>
      </div>
    </div>
  )
}
