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
    <div className="w-full space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Brand your report</h1>
        <p className="text-slate-500 mt-1 text-sm">Your logo and colours will appear throughout your personalised report</p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">Club Logo</label>
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer hover:border-slate-400 transition-colors bg-slate-50">
          {data.logoDataUrl
            // eslint-disable-next-line @next/next/no-img-element
            ? <img src={data.logoDataUrl} alt="logo" className="h-20 w-20 object-contain" />
            : <>
                <span className="text-3xl mb-2">🏟</span>
                <span className="text-sm text-slate-500">Upload PNG, SVG, or JPG</span>
                <span className="text-xs text-slate-400 mt-1">Click to browse</span>
              </>
          }
          <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
        </label>
        {data.logoDataUrl && (
          <button type="button" onClick={() => update({ logoDataUrl: null })} className="mt-1 text-xs text-slate-400 hover:text-slate-600">
            Remove
          </button>
        )}
      </div>

      <ColorPicker label="Primary Colour" value={data.primaryColor} onChange={v => update({ primaryColor: v })} />
      <ColorPicker label="Secondary Colour" value={data.secondaryColor} onChange={v => update({ secondaryColor: v })} />

      <div className="rounded-2xl border border-slate-100 p-4 bg-slate-50">
        <p className="text-xs text-slate-400 mb-3 uppercase tracking-wide">Preview</p>
        <div className="flex items-center gap-3">
          {data.logoDataUrl
            // eslint-disable-next-line @next/next/no-img-element
            ? <img src={data.logoDataUrl} alt="logo" className="w-10 h-10 rounded-lg object-contain bg-white border border-slate-100" />
            : <div className="w-10 h-10 rounded-lg border-2 border-dashed border-slate-300" />
          }
          <div>
            <div className="font-bold text-sm" style={{ color: data.primaryColor }}>{data.clubName || 'Your Club'}</div>
            <div className="text-xs" style={{ color: data.secondaryColor }}>Revenue Simulation 2025–2030</div>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button type="button" onClick={onBack} className="py-4 px-6 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-colors">
          ← Back
        </button>
        <button type="button" onClick={onNext} className="flex-1 py-4 rounded-xl bg-slate-900 text-white font-semibold text-base hover:bg-slate-800 transition-colors">
          Continue →
        </button>
      </div>
    </div>
  )
}
