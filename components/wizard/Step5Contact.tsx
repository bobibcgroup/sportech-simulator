'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { calculate } from '@/lib/calculations'
import type { WizardData } from '@/lib/types'

interface Props { data: WizardData; update: (p: Partial<WizardData>) => void; onBack: () => void }

export default function Step5Contact({ data, update, onBack }: Props) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const valid = data.contactName.trim() && data.contactEmail.includes('@') && data.contactRole.trim()

  const handleSubmit = async () => {
    if (!valid) return
    setLoading(true)
    setError('')

    try {
      const results = calculate(data)
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          club_name: data.clubName,
          sport: data.sport,
          region: data.region,
          fan_base: data.fanBase,
          adoption: data.adoptionPct,
          premium_mix: data.premiumMix,
          games: data.gamesPerSeason,
          spend_level: data.spendLevel,
          name: data.contactName,
          email: data.contactEmail,
          role: data.contactRole,
          website: data.contactWebsite,
          year1_rev: results.year1,
          year5_total: results.cumulativeTotal,
          valuation: results.valuation,
        }),
      })

      if (!res.ok) throw new Error('Failed to save')

      localStorage.setItem('sportech_results', JSON.stringify({ data, results }))
      router.push('/results')
    } catch {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Almost there</h1>
        <p className="text-slate-500 mt-1 text-sm">Where should we send your full revenue breakdown?</p>
      </div>

      <div className="space-y-4">
        {[
          { label: 'Full Name', key: 'contactName', placeholder: 'Ahmed Al-Rashid', type: 'text' },
          { label: 'Work Email', key: 'contactEmail', placeholder: 'ahmed@clubname.com', type: 'email' },
          { label: 'Role / Title', key: 'contactRole', placeholder: 'CEO / Commercial Director', type: 'text' },
          { label: 'Club Website', key: 'contactWebsite', placeholder: 'https://clubname.com (optional)', type: 'url' },
        ].map(f => (
          <div key={f.key}>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">{f.label}</label>
            <input
              type={f.type}
              placeholder={f.placeholder}
              value={(data as unknown as Record<string, string>)[f.key] || ''}
              onChange={e => update({ [f.key]: e.target.value } as Partial<WizardData>)}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent text-base"
            />
          </div>
        ))}
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <p className="text-xs text-slate-400">
        By continuing you agree to be contacted by SporTech about your simulation results. No spam, ever.
      </p>

      <div className="flex gap-3">
        <button type="button" onClick={onBack} disabled={loading} className="py-4 px-6 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 disabled:opacity-40">
          ← Back
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!valid || loading}
          className="flex-1 py-4 rounded-xl bg-slate-900 text-white font-bold text-base disabled:opacity-40 hover:bg-slate-800 transition-colors"
        >
          {loading ? 'Loading...' : 'Unlock My Report 🚀'}
        </button>
      </div>
    </div>
  )
}
