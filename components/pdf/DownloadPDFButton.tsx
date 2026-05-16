'use client'
import dynamic from 'next/dynamic'
import type { WizardData, RevenueResults } from '@/lib/types'

const PDFDownloadLink = dynamic(
  () => import('@react-pdf/renderer').then(mod => mod.PDFDownloadLink),
  { ssr: false, loading: () => <button className="text-xs text-slate-400 px-3 py-2">PDF...</button> }
)

const ReportPDF = dynamic(() => import('./ReportPDF'), { ssr: false })

interface Props { data: WizardData; results: RevenueResults }

export default function DownloadPDFButton({ data, results }: Props) {
  const filename = `${data.clubName.replace(/\s+/g, '-')}-SporTech-Report.pdf`

  return (
    <PDFDownloadLink
      document={<ReportPDF data={data} results={results} />}
      fileName={filename}
      className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
    >
      {({ loading }: { loading: boolean }) => loading ? 'Preparing PDF...' : '⬇ Download PDF'}
    </PDFDownloadLink>
  )
}
