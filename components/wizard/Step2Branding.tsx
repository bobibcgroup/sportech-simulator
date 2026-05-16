'use client'
import ColorPicker from '@/components/ui/ColorPicker'
import type { WizardData } from '@/lib/types'

interface Props { data: WizardData; update: (p: Partial<WizardData>) => void; onNext: () => void; onBack: () => void }

export default function Step2Branding({ data, update, onNext, onBack }: Props) {
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => update({ logoDataUrl: ev.target?.result as string })
    reader.readAsDataURL(file)
  }

  return (
    <div className="w-full space-y-6 animate-in">
      <div>
        <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--body-strong)' }}>Club Logo</label>
        <label
          className="flex flex-col items-center justify-center w-full h-32 rounded-xl cursor-pointer transition-all"
          style={{
            border: '2px dashed var(--hairline-strong)',
            background: 'var(--surface-card)',
          }}
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

      <ColorPicker label="Primary Colour" value={data.primaryColor} onChange={v => update({ primaryColor: v })} />
      <ColorPicker label="Secondary Colour" value={data.secondaryColor} onChange={v => update({ secondaryColor: v })} />

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
