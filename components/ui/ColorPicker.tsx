'use client'
import { HexColorPicker } from 'react-colorful'
import { useState } from 'react'

interface ColorPickerProps {
  label: string
  value: string
  onChange: (color: string) => void
}

export default function ColorPicker({ label, value, onChange }: ColorPickerProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <label className="block text-sm font-semibold text-slate-700 mb-2">{label}</label>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-3 border border-slate-200 rounded-xl px-4 py-3 w-full hover:border-slate-400 transition-colors"
      >
        <div className="w-6 h-6 rounded-full border border-white shadow-sm" style={{ background: value }} />
        <span className="text-sm font-mono text-slate-600 uppercase">{value}</span>
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute z-50 mt-2 p-3 bg-white rounded-2xl shadow-xl border border-slate-100">
            <HexColorPicker color={value} onChange={onChange} />
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="mt-2 w-full text-xs text-slate-500 hover:text-slate-900 py-1"
            >
              Done
            </button>
          </div>
        </>
      )}
    </div>
  )
}
