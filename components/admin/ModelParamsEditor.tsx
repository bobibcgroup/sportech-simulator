'use client'
import { useState } from 'react'
import type { ModelParamRow } from '@/lib/model-params'
import { DEFAULT_PARAMS } from '@/lib/model-params'

interface Props { initialRows: ModelParamRow[] }

export default function ModelParamsEditor({ initialRows }: Props) {
  const [rows, setRows] = useState(initialRows)
  const [editing, setEditing] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState<Record<string, boolean>>({})
  const [saved, setSaved] = useState<Record<string, boolean>>({})
  const [error, setError] = useState<Record<string, string>>({})

  const categories = Array.from(new Set(rows.map(r => r.category)))

  const startEdit = (key: string, current: number) => {
    setEditing(e => ({ ...e, [key]: String(current) }))
    setSaved(s => ({ ...s, [key]: false }))
    setError(e => ({ ...e, [key]: '' }))
  }

  const cancelEdit = (key: string) => {
    setEditing(e => { const n = { ...e }; delete n[key]; return n })
  }

  const save = async (key: string) => {
    const raw = editing[key]
    const value = parseFloat(raw)
    if (isNaN(value)) {
      setError(e => ({ ...e, [key]: 'Enter a valid number' }))
      return
    }
    setSaving(s => ({ ...s, [key]: true }))
    setError(e => ({ ...e, [key]: '' }))
    try {
      const res = await fetch('/api/admin/params', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, value }),
      })
      if (!res.ok) throw new Error('Save failed')
      setRows(r => r.map(row => row.key === key ? { ...row, value } : row))
      setEditing(e => { const n = { ...e }; delete n[key]; return n })
      setSaved(s => ({ ...s, [key]: true }))
      setTimeout(() => setSaved(s => ({ ...s, [key]: false })), 2500)
    } catch {
      setError(e => ({ ...e, [key]: 'Save failed — try again' }))
    } finally {
      setSaving(s => ({ ...s, [key]: false }))
    }
  }

  const defaultFor = (key: string): number =>
    (DEFAULT_PARAMS as unknown as Record<string, number>)[key] ?? 0

  const isModified = (row: ModelParamRow) => row.value !== defaultFor(row.key)

  return (
    <div className="space-y-8">
      {categories.map(cat => (
        <section key={cat}>
          <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-3 pb-2 border-b border-slate-100">
            {cat}
          </h2>
          <div className="rounded-xl border border-slate-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide w-64">Parameter</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Description</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide w-40">Value</th>
                  <th className="px-4 py-3 w-28" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.filter(r => r.category === cat).map(row => (
                  <tr key={row.key} className="bg-white hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-slate-900">{row.label}</span>
                        {isModified(row) && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-50 text-amber-600 border border-amber-200 font-semibold">
                            modified
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400 font-mono">{row.key}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-xs leading-relaxed max-w-xs">
                      {row.description}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {editing[row.key] !== undefined ? (
                        <div className="flex flex-col items-end gap-1">
                          <input
                            type="number"
                            step="any"
                            value={editing[row.key]}
                            onChange={e => setEditing(ed => ({ ...ed, [row.key]: e.target.value }))}
                            onKeyDown={e => { if (e.key === 'Enter') save(row.key); if (e.key === 'Escape') cancelEdit(row.key) }}
                            className="w-28 text-right border border-indigo-400 rounded-lg px-2 py-1 text-sm font-mono outline-none ring-2 ring-indigo-100"
                            autoFocus
                          />
                          {error[row.key] && (
                            <span className="text-[11px] text-red-500">{error[row.key]}</span>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center justify-end gap-2">
                          {saved[row.key] && (
                            <span className="text-[11px] text-green-600 font-semibold">✓ saved</span>
                          )}
                          <span className="font-mono font-semibold text-slate-900">
                            {row.value}
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1.5">
                        {editing[row.key] !== undefined ? (
                          <>
                            <button
                              onClick={() => cancelEdit(row.key)}
                              className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 transition-colors"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => save(row.key)}
                              disabled={saving[row.key]}
                              className="text-xs px-2.5 py-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors disabled:opacity-50"
                            >
                              {saving[row.key] ? '…' : 'Save'}
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => startEdit(row.key, row.value)}
                            className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors"
                          >
                            Edit
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}
    </div>
  )
}
