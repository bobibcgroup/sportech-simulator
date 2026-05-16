'use client'
import { useState, useMemo, useRef } from 'react'
import ColorPicker from '@/components/ui/ColorPicker'
import type { WizardData } from '@/lib/types'
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

interface Props { data: WizardData; update: (p: Partial<WizardData>) => void; onNext: () => void; onBack: () => void }

export default function Step2Branding({ data, update, onNext, onBack }: Props) {
  const [query, setQuery] = useState('')
  const [selectedClub, setSelectedClub] = useState<Club | null>(null)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [showManual, setShowManual] = useState(false)
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
    setShowManual(false)
    update({ primaryColor: club.primaryColor, secondaryColor: club.secondaryColor })
  }

  const clearClub = () => {
    setSelectedClub(null)
    setQuery('')
    setShowManual(false)
    setTimeout(() => inputRef.current?.focus(), 50)
  }

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => update({ logoDataUrl: ev.target?.result as string })
    reader.readAsDataURL(file)
  }

  return (
    <div className="w-full space-y-6 animate-in">

      {/* ── Club Colours ── */}
      <div>
        <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--body-strong)' }}>
          Club Colours
        </label>

        {selectedClub ? (
          <div
            className="rounded-xl px-4 py-3 flex items-center justify-between"
            style={{ background: 'var(--surface-card)', border: '1px solid var(--hairline)' }}
          >
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="w-6 h-6 rounded-full shadow-sm" style={{ background: selectedClub.primaryColor, border: '2px solid rgba(255,255,255,0.15)' }} />
                <div className="w-6 h-6 rounded-full shadow-sm" style={{ background: selectedClub.secondaryColor, border: '2px solid rgba(255,255,255,0.15)' }} />
              </div>
              <div>
                <p className="text-sm font-semibold leading-none mb-0.5" style={{ color: 'var(--ink)' }}>{selectedClub.name}</p>
                <p className="text-xs" style={{ color: 'var(--muted)' }}>{selectedClub.country}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={clearClub}
              className="text-xs px-3 py-1.5 rounded-lg transition-colors"
              style={{ color: 'var(--muted)', background: 'var(--surface-soft)', border: '1px solid var(--hairline)' }}
            >
              Change
            </button>
          </div>
        ) : (
          <div className="relative">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base select-none" style={{ color: 'var(--muted)' }}>🔍</span>
              <input
                ref={inputRef}
                type="text"
                placeholder="Search for your club…"
                value={query}
                onChange={e => { setQuery(e.target.value); setDropdownOpen(true) }}
                onFocus={() => setDropdownOpen(true)}
                className="w-full rounded-lg pl-9 pr-4 py-3 text-base outline-none transition-all"
                style={{ background: 'var(--surface-card)', color: 'var(--ink)', border: '1px solid var(--hairline)' }}
                onFocusCapture={e => { e.currentTarget.style.borderColor = 'var(--primary)' }}
                onBlur={e => { e.currentTarget.style.borderColor = 'var(--hairline)' }}
              />
            </div>

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
                      className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors hover:opacity-80"
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
        )}

        {!selectedClub && (
          <button
            type="button"
            onClick={() => setShowManual(v => !v)}
            className="mt-2 text-xs transition-colors"
            style={{ color: 'var(--muted)' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--primary)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--muted)' }}
          >
            {showManual ? '↑ Hide colour pickers' : "Can't find your club? Pick colours manually →"}
          </button>
        )}
      </div>

      {/* ── Manual colour pickers (fallback) ── */}
      {showManual && !selectedClub && (
        <>
          <ColorPicker label="Primary Colour" value={data.primaryColor} onChange={v => update({ primaryColor: v })} />
          <ColorPicker label="Secondary Colour" value={data.secondaryColor} onChange={v => update({ secondaryColor: v })} />
        </>
      )}

      {/* ── Logo upload (unchanged) ── */}
      <div>
        <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--body-strong)' }}>Club Logo</label>
        <label
          className="flex flex-col items-center justify-center w-full h-32 rounded-xl cursor-pointer transition-all"
          style={{ border: '2px dashed var(--hairline-strong)', background: 'var(--surface-card)' }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--primary)' }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--hairline-strong)' }}
        >
          {data.logoDataUrl
            // eslint-disable-next-line @next/next/no-img-element
            ? <img src={data.logoDataUrl} alt="logo" className="h-20 w-20 object-contain" />
            : <>
                <span className="text-3xl mb-2">🏟</span>
                <span className="text-sm" style={{ color: 'var(--body)' }}>Upload PNG, SVG, or JPG</span>
                <span className="text-xs mt-1" style={{ color: 'var(--muted)' }}>Click to browse</span>
              </>
          }
          <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
        </label>
        {data.logoDataUrl && (
          <button
            type="button"
            onClick={() => update({ logoDataUrl: null })}
            className="mt-1 text-xs transition-colors"
            style={{ color: 'var(--muted)' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--accent-rose)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--muted)' }}
          >
            Remove
          </button>
        )}
      </div>

      {/* ── Preview ── */}
      <div className="rounded-xl p-4" style={{ background: 'var(--surface-card)', border: '1px solid var(--hairline)' }}>
        <p className="text-xs uppercase tracking-widest mb-3" style={{ color: 'var(--muted)' }}>Preview</p>
        <div className="flex items-center gap-3">
          {data.logoDataUrl
            // eslint-disable-next-line @next/next/no-img-element
            ? <img src={data.logoDataUrl} alt="logo" className="w-10 h-10 rounded-lg object-contain" style={{ border: '1px solid var(--hairline)' }} />
            : <div className="w-10 h-10 rounded-lg" style={{ border: '2px dashed var(--hairline-strong)' }} />
          }
          <div>
            <div className="font-bold text-sm" style={{ color: data.primaryColor }}>{data.clubName || 'Your Club'}</div>
            <div className="text-xs" style={{ color: data.secondaryColor }}>Revenue Simulation 2025–2030</div>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="py-4 px-6 rounded-lg font-medium transition-all"
          style={{ background: 'var(--surface-card)', color: 'var(--body)', border: '1px solid var(--hairline)' }}
        >
          ← Back
        </button>
        <button
          type="button"
          onClick={onNext}
          className="flex-1 py-4 rounded-lg font-semibold text-base"
          style={{ background: 'var(--primary)', color: 'var(--on-primary)' }}
        >
          Continue →
        </button>
      </div>
    </div>
  )
}
