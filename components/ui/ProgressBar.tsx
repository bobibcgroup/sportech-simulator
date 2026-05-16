interface ProgressBarProps {
  currentStep: number
  totalSteps: number
}

const STEP_LABELS: Record<number, string> = {
  1: 'Your Club',
  2: 'Fan Base',
  3: 'Adoption',
  4: 'Premium Mix',
  5: 'Season',
  6: 'Market',
  7: 'Preview',
  8: 'Details',
}

export default function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  const pct = Math.round(((currentStep - 1) / (totalSteps - 1)) * 100)

  return (
    <div className="w-full px-4 pt-4 pb-3" style={{ background: 'var(--canvas)' }}>
      <div className="max-w-lg mx-auto">
        <div className="flex justify-between items-center mb-2">
          <p className="text-xs font-semibold" style={{ color: 'var(--primary)' }}>
            Step {currentStep} of {totalSteps}
          </p>
          <p className="text-xs font-medium" style={{ color: 'var(--muted)' }}>
            {STEP_LABELS[currentStep] ?? `Step ${currentStep}`}
          </p>
        </div>
        <div className="h-1.5 rounded-full" style={{ background: 'var(--hairline)' }}>
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${pct}%`, background: 'var(--primary)' }}
          />
        </div>
      </div>
    </div>
  )
}
