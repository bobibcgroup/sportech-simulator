import dynamic from 'next/dynamic'
import type { WizardData, RevenueResults } from '@/lib/types'
import StreamCards from './StreamCards'

const RevenueBarChart = dynamic(() => import('./RevenueBarChart'), { ssr: false })
const ProjectionChart = dynamic(() => import('./ProjectionChart'), { ssr: false })

interface Props { data: WizardData; results: RevenueResults }

export default function DashboardView({ data, results }: Props) {
  return (
    <div className="space-y-8">
      <RevenueBarChart results={results} primaryColor={data.primaryColor} secondaryColor={data.secondaryColor} />
      <ProjectionChart projection={results.projection} primaryColor={data.primaryColor} />
      <StreamCards results={results} primaryColor={data.primaryColor} />
    </div>
  )
}
