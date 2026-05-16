'use client'
import { useState, useEffect } from 'react'
import ProgressBar from '@/components/ui/ProgressBar'
import Step1ClubSearch from './Step1ClubSearch'
import SliderStep from './SliderStep'
import SpendLevelStep from './SpendLevelStep'
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
  { title: 'Find Your Club',          subtitle: 'Search for your club — we\'ll pre-fill your sport, region, and colours automatically' },
  { title: 'Your Global Fan Base',    subtitle: 'How large is your total worldwide fanbase across all markets and regions?' },
  { title: 'Platform Adoption',       subtitle: 'What percentage of your fans do you expect to download and actively use the app?' },
  { title: 'Premium Subscribers',     subtitle: 'Of those using the app, what percentage will choose a paid subscription tier?' },
  { title: 'Season Schedule',         subtitle: 'How many matches do you play across all competitions per season?' },
  { title: 'Fan Spending Power',      subtitle: 'Where are most of your fans based? This shapes average digital spending per fan.' },
  { title: 'Your Report Is Ready',    subtitle: 'Unlock your full revenue simulation — it takes under 30 seconds' },
  { title: 'Almost There',            subtitle: 'Where should we send your complete revenue breakdown?' },
]

const fmt = (n: number) =>
  n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1)}M`
  : n >= 1_000 ? `${(n / 1_000).toFixed(0)}K`
  : String(n)

const fmtPct = (n: number) => `${Math.round(n * 100)}%`

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

  const next = () => setStep(s => Math.min(s + 1, 8))
  const back = () => setStep(s => Math.max(s - 1, 1))

  const info = STEP_INFO[step - 1]

  const totalActive = Math.round(data.fanBase * data.adoptionPct)
  const totalPaid   = Math.round(totalActive * data.premiumMix)

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

      <ProgressBar currentStep={step} totalSteps={8} />

      <div className="px-4 pt-2 pb-4 max-w-lg mx-auto w-full">
        <div className="rounded-lg px-4 py-3" style={{ background: 'var(--surface-soft)', border: '1px solid var(--hairline)' }}>
          <p className="text-xs font-semibold uppercase tracking-widest mb-0.5" style={{ color: 'var(--primary)' }}>
            Step {step} of 8
          </p>
          <h2 className="text-base font-bold" style={{ color: 'var(--ink)' }}>{info.title}</h2>
          <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>{info.subtitle}</p>
        </div>
      </div>

      <main className="flex-1 flex flex-col items-center justify-start px-4 pb-10 max-w-lg mx-auto w-full">

        {step === 1 && (
          <Step1ClubSearch data={data} update={update} onNext={next} />
        )}

        {step === 2 && (
          <SliderStep
            icon="🌍"
            label="Global Fan Base"
            hint="Total worldwide fans — social media followers, match-goers, and global supporters"
            value={data.fanBase}
            min={50_000} max={200_000_000} step={50_000}
            format={fmt}
            onChange={v => update({ fanBase: v })}
            onNext={next} onBack={back}
          />
        )}

        {step === 3 && (
          <SliderStep
            icon="📱"
            label="Platform Adoption"
            hint="Percentage of fans who download and actively use the app — varies by region and campaign"
            context={`${fmt(data.fanBase)} fans × ${fmtPct(data.adoptionPct)} adoption = ${fmt(totalActive)} active users`}
            value={data.adoptionPct}
            min={0.01} max={1.0} step={0.01}
            format={fmtPct}
            onChange={v => update({ adoptionPct: v })}
            onNext={next} onBack={back}
          />
        )}

        {step === 4 && (
          <SliderStep
            icon="👑"
            label="Premium Tier Mix"
            hint="Percentage of active users who choose a paid subscription — depends on pricing and content value"
            context={`${fmt(totalActive)} active users × ${fmtPct(data.premiumMix)} premium = ${fmt(totalPaid)} paid subscribers`}
            value={data.premiumMix}
            min={0.01} max={1.0} step={0.01}
            format={fmtPct}
            onChange={v => update({ premiumMix: v })}
            onNext={next} onBack={back}
          />
        )}

        {step === 5 && (
          <SliderStep
            icon="⚽"
            label="Games Per Season"
            hint="Total home and away matches per season across all competitions"
            value={data.gamesPerSeason}
            min={1} max={80} step={1}
            format={v => `${v} game${v === 1 ? '' : 's'}`}
            onChange={v => update({ gamesPerSeason: v })}
            onNext={next} onBack={back}
          />
        )}

        {step === 6 && (
          <SpendLevelStep data={data} update={update} onNext={next} onBack={back} />
        )}

        {step === 7 && (
          <Step4BlurredPreview data={data} onNext={next} onBack={back} />
        )}

        {step === 8 && (
          <Step5Contact data={data} update={update} onBack={back} />
        )}

      </main>
    </div>
  )
}
