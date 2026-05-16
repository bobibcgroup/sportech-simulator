'use client'
import { useState, useEffect } from 'react'
import ProgressBar from '@/components/ui/ProgressBar'
import Step1ClubSearch from './Step1ClubSearch'
import Step3Numbers from './Step3Numbers'
import Step4BlurredPreview from './Step4BlurredPreview'
import Step5Contact from './Step5Contact'
import type { WizardData } from '@/lib/types'
import { WIZARD_DEFAULTS } from '@/lib/constants'

const STORAGE_KEY = 'sportech_wizard'

const emptyWizard: WizardData = {
  clubName: '', sport: '', region: '',
  logoDataUrl: null, primaryColor: WIZARD_DEFAULTS.primaryColor, secondaryColor: WIZARD_DEFAULTS.secondaryColor,
  fanBase: 2_000_000, adoptionPct: WIZARD_DEFAULTS.adoptionPct,
  premiumMix: WIZARD_DEFAULTS.premiumMix, gamesPerSeason: WIZARD_DEFAULTS.gamesPerSeason,
  spendLevel: WIZARD_DEFAULTS.spendLevel,
  contactName: '', contactEmail: '', contactRole: '', contactWebsite: '',
}

const STEP_INFO = [
  { title: 'Find Your Club', subtitle: 'Search for your club — we\'ll pre-fill your sport, region, and colours automatically' },
  { title: 'Set Your Numbers', subtitle: 'Adjust the sliders to model your specific scenario — results update in real time' },
  { title: 'Your Report Is Ready', subtitle: 'Unlock your full revenue simulation — it takes under 30 seconds' },
  { title: 'Almost There', subtitle: 'One final step — where should we send your complete revenue breakdown?' },
]

export default function WizardShell() {
  const [step, setStep] = useState(1)
  const [data, setData] = useState<WizardData>(emptyWizard)

  useEffect(() => {
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  const update = (partial: Partial<WizardData>) => {
    setData(prev => {
      const next = { ...prev, ...partial }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      document.documentElement.style.setProperty('--club-primary', next.primaryColor)
      document.documentElement.style.setProperty('--club-secondary', next.secondaryColor)
      return next
    })
  }

  const next = () => setStep(s => Math.min(s + 1, 4))
  const back = () => setStep(s => Math.max(s - 1, 1))

  const info = STEP_INFO[step - 1]

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--canvas)' }}>
      <header
        className="border-b px-4 py-3 flex items-center justify-between"
        style={{ borderColor: 'var(--hairline)', background: 'var(--canvas)' }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/sportech-logo.svg" alt="SporTech" className="h-7" onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
        <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: 'var(--muted)' }}>
          Revenue Simulator
        </span>
      </header>

      <ProgressBar currentStep={step} totalSteps={4} />

      <div className="px-4 pt-2 pb-4 max-w-lg mx-auto w-full">
        <div className="rounded-lg px-4 py-3" style={{ background: 'var(--surface-soft)', border: '1px solid var(--hairline)' }}>
          <p className="text-xs font-semibold uppercase tracking-widest mb-0.5" style={{ color: 'var(--primary)' }}>
            Step {step} of 4
          </p>
          <h2 className="text-base font-bold" style={{ color: 'var(--ink)' }}>{info.title}</h2>
          <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>{info.subtitle}</p>
        </div>
      </div>

      <main className="flex-1 flex flex-col items-center justify-start px-4 pb-10 max-w-lg mx-auto w-full">
        {step === 1 && <Step1ClubSearch data={data} update={update} onNext={next} />}
        {step === 2 && <Step3Numbers data={data} update={update} onNext={next} onBack={back} />}
        {step === 3 && <Step4BlurredPreview data={data} onNext={next} onBack={back} />}
        {step === 4 && <Step5Contact data={data} update={update} onBack={back} />}
      </main>
    </div>
  )
}
