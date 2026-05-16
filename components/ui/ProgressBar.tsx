interface ProgressBarProps {
  currentStep: number  // 1-5
  totalSteps: number
}

export default function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  const labels = ['Identity', 'Branding', 'Numbers', 'Preview', 'Contact']

  return (
    <div className="w-full px-4 pt-6 pb-2">
      <div className="flex items-center justify-between max-w-lg mx-auto">
        {Array.from({ length: totalSteps }).map((_, i) => {
          const step = i + 1
          const done = step < currentStep
          const active = step === currentStep
          return (
            <div key={step} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all
                    ${done ? 'bg-slate-900 text-white' : active ? 'bg-slate-900 text-white ring-4 ring-slate-200' : 'bg-slate-100 text-slate-400'}`}
                >
                  {done ? '✓' : step}
                </div>
                <span className={`mt-1 text-[10px] hidden sm:block ${active ? 'text-slate-900 font-semibold' : 'text-slate-400'}`}>
                  {labels[i]}
                </span>
              </div>
              {step < totalSteps && (
                <div className="flex-1 h-[2px] mx-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className={`h-full rounded-full bg-slate-900 transition-all ${done ? 'w-full' : 'w-0'}`} />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
