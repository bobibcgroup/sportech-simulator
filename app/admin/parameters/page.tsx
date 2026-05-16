import { redirect } from 'next/navigation'
import { isAdminAuthenticated } from '@/lib/adminAuth'
import { fetchAllParamRows } from '@/lib/model-params'
import ModelParamsEditor from '@/components/admin/ModelParamsEditor'

export const dynamic = 'force-dynamic'

export default async function ParametersPage() {
  if (!isAdminAuthenticated()) redirect('/admin')

  const rows = await fetchAllParamRows()

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <a href="/admin/dashboard" className="text-sm text-slate-400 hover:text-slate-600 transition-colors">
              ← Dashboard
            </a>
            <span className="text-slate-200">|</span>
            <h1 className="text-lg font-bold text-slate-900">Model Parameters</h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Edit the financial assumptions used in all revenue calculations. Changes apply immediately to new submissions.
          </p>
        </div>
        <form action="/api/admin/logout" method="POST">
          <button type="submit" className="text-sm text-slate-400 hover:text-slate-600">Sign out</button>
        </form>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-6 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
          <strong>Note:</strong> These values are used server-side when calculating revenue for every new lead submission.
          The wizard preview uses compiled defaults — only final submitted results reflect live parameter changes.
        </div>
        <ModelParamsEditor initialRows={rows} />
      </main>
    </div>
  )
}
