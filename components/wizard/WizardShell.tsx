'use client'
import { useState, useEffect } from 'react'
import ProgressBar from '@/components/ui/ProgressBar'
import Step1Identity from './Step1Identity'
import Step2Branding from './Step2Branding'
import Step3Numbers from './Step3Numbers'
import Step4BlurredPreview from './Step4BlurredPreview'
import Step5Contact from './Step5Contact'
import type { WizardData } from '@/lib/types'
import { WIZARD_DEFAULTS } from '@/lib/constants'

const STORAGE_KEY = 'sportech_wizard'

const emptyWizard: WizardData = {
  clubName: '', sport: '', region: '',
  logoDataUrl: null, primaryColor: WIZARD_DEFAULTS.primaryColor, secondaryColor: WIZARD_DEFAULTS.secondaryColor,
  fanBase: 10_000_000, adoptionPct: WIZARD_DEFAULTS.adoptionPct,
  premiumMix: WIZARD_DEFAULTS.premiumMix, gamesPerSeason: WIZARD_DEFAULTS.gamesPerSeason,
  spendLevel: WIZARD_DEFAULTS.spendLevel,
  contactName: '', contactEmail: '', contactRole: '', contactWebsite: '',
}

export default function WizardShell() {
  const [step, setStep] = useState(1)
  const [data, setData] = useState<WizardData>(emptyWizard)

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) { try { setData(JSON.parse(saved)) } catch {} }
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

  const next = () => setStep(s => Math.min(s + 1, 5))
  const back = () => setStep(s => Math.max(s - 1, 1))

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="border-b border-slate-100 px-4 py-3 flex items-center justify-between">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/sportech-logo.svg" alt="SporTech" className="h-7" onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
        <span className="text-xs text-slate-400">Revenue Simulator</span>
      </header>

      <ProgressBar currentStep={step} totalSteps={5} />

      <main className="flex-1 flex flex-col items-center justify-start px-4 py-6 max-w-lg mx-auto w-full">
        {step === 1 && <Step1Identity data={data} update={update} onNext={next} />}
        {step === 2 && <Step2Branding data={data} update={update} onNext={next} onBack={back} />}
        {step === 3 && <Step3Numbers data={data} update={update} onNext={next} onBack={back} />}
        {step === 4 && <Step4BlurredPreview data={data} onNext={next} onBack={back} />}
        {step === 5 && <Step5Contact data={data} update={update} onBack={back} />}
      </main>
    </div>
  )
}
