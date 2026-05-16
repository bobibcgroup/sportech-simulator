'use client'
import { useState, useMemo, useRef } from 'react'
import ColorPicker from '@/components/ui/ColorPicker'
import type { WizardData } from '@/lib/types'
import { SPORTS, REGIONS } from '@/lib/constants'
import clubsData from '@/lib/clubs-db.json'

interface Club {
  id: string
  name: string
  country: string
  sport: string
  primaryColor: string
  secondaryColor: string
}

const clubs = clubsData as Club[]

function countryToRegion(country: string): string {
  const map: Record<string, string> = {
    England: 'Europe', Spain: 'Europe', Germany: 'Europe', Italy: 'Europe',
    France: 'Europe', Portugal: 'Europe', Netherlands: 'Europe', Scotland: 'Europe',
    Belgium: 'Europe', Turkey: 'Europe', Greece: 'Europe',
    'Saudi Arabia': 'Middle East', UAE: 'Middle East', Qatar: 'Middle East',
    Kuwait: 'Middle East', Bahrain: 'Middle East', Jordan: 'Middle East',
    Egypt: 'Africa', Nigeria: 'Africa', Morocco: 'Africa', 'South Africa': 'Africa',
    Japan: 'Asia', 'South Korea': 'Asia', China: 'Asia', India: 'Asia', Australia: 'Asia',
  }
  return map[country] ?? 'Other'
}

function sportToWizard(sport: string): string {
  if (sport === 'soccer') return 'Football'
  const match = SPORTS.find(s => s.toLowerCase() === sport.toLowerCase())
  return match ?? 'Football'
}

const btnBase = 'py-2.5 px-3 rounded-lg border text-sm font-medium transition-all'
const btnActive = { background: 'var(--primary)', color: 'var(--on-primary)', border: '1px solid var(--primary)' }
const btnIdle = { background: 'var(--surface-card)', color: 'var(--body)', border: '1px solid var(--hairline)' }

interface Props {
  data: WizardData
  update: (p: Partial<WizardData>) => void
  onNext: () => void
}

export default function Step1ClubSearch({ data, update, onNext }: Props) {
  const [query, setQuery] = useState('')
  const [selectedClub, setSelectedClub] = useState<Club | null>(null)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [manualMode, setManualMode] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const results = useMemo(() => {
    if (query.trim().length < 2) return []
    const q = query.toLowerCase()
    return clubs
      .filter(c => c.name.toLowerCase().includes(q) || c.country.toLowerCase().includes(q))
      .slice(0, 8)
  }, [query])

  const selectClub = (club: Club) => {
    setSelectedClub(club)
    setDropdownOpen(false)
    setQuery('')
    setManualMode(false)
    update({
      clubName: club.name,
      sport: sportToWizard(club.sport),
      region: countryToRegion(club.country),
      primaryColor: club.primaryColor,
      secondaryColor: club.secondaryColor,
    })
  }

  const clearSelection = () => {
    setSelectedClub(null)
    setQuery('')
    setManualMode(false)
    update({ clubName: '', sport: '', region: '' })
    setTimeout(() => inputRef.current?.focus(), 50)
  }

  const enterManualMode = () => {
    setManualMode(true)
    setDropdownOpen(false)
    setQuery('')
    setSelectedClub(null)
  }

  const valid = selectedClub !== null
    || (manualMode && data.clubName.trim().length > 0 && !!data.sport && !!data.region)

  return (
    <div className="w-full space-y-6 animate-in">

      {!manualMode ? (
        /* ── Search mode ── */
        <>
          {selectedClub ? (
            /* Selected state */
            <div
              className="rounded-xl p-4"
              style={{ background: 'var(--surface-card)', border: '1px solid var(--hairline)' }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <div className="w-7 h-7 rounded-full shadow-sm" style={{ background: selectedClub.primaryColor, border: '2px solid rgba(255,255,255,0.12)' }} />
                    <div className="w-7 h-7 rounded-full shadow-sm" style={{ background: selectedClub.secondaryColor, border: '2px solid rgba(255,255,255,0.12)' }} />
                  </div>
                  <div>
                    <p className="font-bold text-sm" style={{ color: 'var(--ink)' }}>{selectedClub.name}</p>
                    <p className="text-xs" style={{ color: 'var(--muted)' }}>
                      {selectedClub.country} · {sportToWizard(selectedClub.sport)} · {countryToRegion(selectedClub.country)}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={clearSelection}
                  className="text-xs px-3 py-1.5 rounded-lg transition-colors"
                  style={{ color: 'var(--muted)', background: 'var(--surface-soft)', border: '1px solid var(--hairline)' }}
                >
                  Change
                </button>
              </div>
            </div>
          ) : (
            /* Search input + dropdown */
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--body-strong)' }}>
                Find Your Club
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base select-none" style={{ color: 'var(--muted)' }}>🔍</span>
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="e.g. Barcelona, Arsenal, Al Nasser…"
                  value={query}
                  onChange={e => { setQuery(e.target.value); setDropdownOpen(true) }}
                  onFocus={() => setDropdownOpen(true)}
                  className="w-full rounded-lg pl-9 pr-4 py-3 text-base outline-none transition-all"
                  style={{ background: 'var(--surface-card)', color: 'var(--ink)', border: '1px solid var(--hairline)' }}
                  onFocusCapture={e => { e.currentTarget.style.borderColor = 'var(--primary)' }}
                  onBlur={e => { e.currentTarget.style.borderColor = 'var(--hairline)' }}
                />

                {dropdownOpen && results.length > 0 && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
                    <div
                      className="absolute z-20 left-0 right-0 top-full mt-1 rounded-xl overflow-hidden shadow-2xl"
                      style={{ background: 'var(--surface-card)', border: '1px solid var(--hairline)' }}
                    >
                      {results.map((club, i) => (
                        <button
                          key={club.id}
                          type="button"
                          onMouseDown={e => { e.preventDefault(); selectClub(club) }}
                          className="w-full flex items-center gap-3 px-4 py-3 text-left hover:opacity-80 transition-opacity"
                          style={{ borderBottom: i < results.length - 1 ? '1px solid var(--hairline)' : 'none' }}
                        >
                          <div className="flex gap-1 shrink-0">
                            <div className="w-4 h-4 rounded-full" style={{ background: club.primaryColor, border: '1px solid rgba(255,255,255,0.1)' }} />
                            <div className="w-4 h-4 rounded-full" style={{ background: club.secondaryColor, border: '1px solid rgba(255,255,255,0.1)' }} />
                          </div>
                          <span className="text-sm font-medium truncate" style={{ color: 'var(--ink)' }}>{club.name}</span>
                          <span className="text-xs ml-auto shrink-0" style={{ color: 'var(--muted)' }}>{club.country}</span>
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              <button
                type="button"
                onClick={enterManualMode}
                className="mt-2 text-xs transition-colors"
                style={{ color: 'var(--muted)' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--primary)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--muted)' }}
              >
                My club isn&apos;t listed — enter details manually →
              </button>
            </div>
          )}
        </>
      ) : (
        /* ── Manual mode ── */
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold" style={{ color: 'var(--body-strong)' }}>Enter your club details</p>
            <button
              type="button"
              onClick={() => setManualMode(false)}
              className="text-xs transition-colors"
              style={{ color: 'var(--muted)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--primary)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--muted)' }}
            >
              ← Back to search
            </button>
          </div>

          {/* Club name */}
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--body-strong)' }}>Club / Organisation Name</label>
            <input
              type="text"
              placeholder="e.g. Al Nasser FC"
              value={data.clubName}
              onChange={e => update({ clubName: e.target.value })}
              className="w-full rounded-lg px-4 py-3 text-base outline-none transition-all"
              style={{ background: 'var(--surface-card)', color: 'var(--ink)', border: '1px solid var(--hairline)' }}
              onFocus={e => { e.currentTarget.style.borderColor = 'var(--primary)' }}
              onBlur={e => { e.currentTarget.style.borderColor = 'var(--hairline)' }}
            />
          </div>

          {/* Sport */}
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--body-strong)' }}>Sport</label>
            <div className="grid grid-cols-3 gap-2">
              {SPORTS.map(s => (
                <button key={s} type="button" onClick={() => update({ sport: s })}
                  className={btnBase} style={data.sport === s ? btnActive : btnIdle}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Region */}
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--body-strong)' }}>Region</label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {REGIONS.map(r => (
                <button key={r} type="button" onClick={() => update({ region: r })}
                  className={btnBase} style={data.region === r ? btnActive : btnIdle}>
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Colours */}
          <ColorPicker label="Primary Colour" value={data.primaryColor} onChange={v => update({ primaryColor: v })} />
          <ColorPicker label="Secondary Colour" value={data.secondaryColor} onChange={v => update({ secondaryColor: v })} />
        </div>
      )}

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
