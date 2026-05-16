'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { WizardData } from '@/lib/types'

interface Props { data: WizardData; update: (p: Partial<WizardData>) => void; onBack: () => void }

const FIELDS = [
  { label: 'Full Name', key: 'contactName', placeholder: 'Ahmed Al-Rashid', type: 'text' },
  { label: 'Work Email', key: 'contactEmail', placeholder: 'ahmed@clubname.com', type: 'email' },
  { label: 'Role / Title', key: 'contactRole', placeholder: 'CEO / Commercial Director', type: 'text' },
  { label: 'Club Website', key: 'contactWebsite', placeholder: 'https://clubname.com (optional)', type: 'url' },
]

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
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          club_name:       data.clubName,
          sport:           data.sport,
          region:          data.region,
          primary_color:   data.primaryColor,
          secondary_color: data.secondaryColor,
          fan_base:        data.fanBase,
          adoption:        data.adoptionPct,
          premium_mix:     data.premiumMix,
          games:           data.gamesPerSeason,
          spend_level:     data.spendLevel,
          name:            data.contactName,
          email:           data.contactEmail,
          role:            data.contactRole,
          website:         data.contactWebsite,
        }),
      })

      if (!res.ok) throw new Error('Failed to save')

      const { results } = await res.json()
      localStorage.setItem('sportech_results', JSON.stringify({ data, results }))
      router.push('/results')
    } catch {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="w-full space-y-5 animate-in">
      <div className="space-y-3">
        {FIELDS.map(f => (
          <div key={f.key}>
            <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--body-strong)' }}>{f.label}</label>
            <input
              type={f.type}
              placeholder={f.placeholder}
              value={(data as unknown as Record<string, string>)[f.key] || ''}
              onChange={e => update({ [f.key]: e.target.value } as Partial<WizardData>)}
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
        ))}
      </div>

      {error && (
        <p className="text-sm px-3 py-2 rounded-lg" style={{ color: 'var(--accent-rose)', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
          {error}
        </p>
      )}

      <p className="text-xs" style={{ color: 'var(--muted)' }}>
        By continuing you agree to be contacted by SporTech about your simulation results. No spam, ever.
      </p>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          disabled={loading}
          className="py-4 px-6 rounded-lg font-medium"
          style={{
            background: 'var(--surface-card)',
            color: 'var(--body)',
            border: '1px solid var(--hairline)',
            opacity: loading ? 0.4 : 1,
          }}
        >
          ← Back
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!valid || loading}
          className="flex-1 py-4 rounded-lg font-bold text-base transition-all"
          style={{
            background: valid && !loading ? 'var(--primary)' : 'var(--primary-disabled)',
            color: valid && !loading ? 'var(--on-primary)' : 'var(--muted)',
            cursor: valid && !loading ? 'pointer' : 'not-allowed',
          }}
        >
          {loading ? 'Generating report…' : 'Unlock My Report →'}
        </button>
      </div>
    </div>
  )
}
