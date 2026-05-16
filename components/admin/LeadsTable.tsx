'use client'
import { useState } from 'react'
import type { Lead } from '@/lib/types'

const fmtM = (n: number) => `$${(n / 1_000_000).toFixed(1)}M`
const fmtDate = (s: string) => new Date(s).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })

interface Props { leads: Lead[] }

export default function LeadsTable({ leads }: Props) {
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState<keyof Lead>('created_at')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')

  const filtered = leads
    .filter(l => `${l.club_name} ${l.name} ${l.email} ${l.sport}`.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      const av = a[sortKey] ?? ''
      const bv = b[sortKey] ?? ''
      return sortDir === 'asc' ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1)
    })

  const toggleSort = (key: keyof Lead) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('desc') }
  }

  const exportCSV = () => {
    const headers = 'Date,Club,Sport,Region,Fan Base,Email,Name,Role,Year1 Rev,5yr Total,Valuation'
    const rows = leads.map(l =>
      [l.created_at.slice(0, 10), l.club_name, l.sport, l.region, l.fan_base, l.email, l.name, l.role, l.year1_rev.toFixed(0), l.year5_total.toFixed(0), l.valuation.toFixed(0)].join(',')
    )
    const blob = new Blob([[headers, ...rows].join('\n')], { type: 'text/csv' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `sportech-leads-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <input
          type="text"
          placeholder="Search clubs, names, emails..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
        />
        <button
          type="button"
          onClick={exportCSV}
          className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 whitespace-nowrap"
        >
          Export CSV
        </button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-100">
        <table className="w-full text-sm min-w-[700px]">
          <thead className="bg-slate-50">
            <tr>
              {[
                { key: 'created_at', label: 'Date' },
                { key: 'club_name', label: 'Club' },
                { key: 'sport', label: 'Sport' },
                { key: 'name', label: 'Contact' },
                { key: 'year1_rev', label: 'Year 1 Rev' },
                { key: 'year5_total', label: '5-Year Total' },
              ].map(col => (
                <th
                  key={col.key}
                  onClick={() => toggleSort(col.key as keyof Lead)}
                  className="text-left px-4 py-3 text-slate-500 font-semibold text-xs uppercase tracking-wide cursor-pointer hover:text-slate-900 select-none"
                >
                  {col.label} {sortKey === col.key ? (sortDir === 'desc' ? '↓' : '↑') : ''}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-400 text-sm">No leads yet</td></tr>
            )}
            {filtered.map(l => (
              <tr key={l.id} className="border-t border-slate-50 hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3 text-slate-500 text-xs">{fmtDate(l.created_at)}</td>
                <td className="px-4 py-3 font-semibold text-slate-900">{l.club_name}</td>
                <td className="px-4 py-3 text-slate-500">{l.sport}</td>
                <td className="px-4 py-3">
                  <div className="font-medium text-slate-900">{l.name}</div>
                  <div className="text-xs text-slate-400">{l.email}</div>
                </td>
                <td className="px-4 py-3 font-bold text-slate-900">{fmtM(l.year1_rev)}</td>
                <td className="px-4 py-3 text-slate-600">{fmtM(l.year5_total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-slate-400 mt-2">{filtered.length} of {leads.length} leads</p>
    </div>
  )
}
