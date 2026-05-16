import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer'
import type { WizardData, RevenueResults } from '@/lib/types'

const fmtM = (n: number) => `$${(n / 1_000_000).toFixed(1)}M`

const s = StyleSheet.create({
  page: { fontFamily: 'Helvetica', padding: 40, backgroundColor: '#ffffff', color: '#0f172a' },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 32, borderBottomWidth: 1, borderBottomColor: '#f1f5f9', paddingBottom: 16 },
  logo: { width: 40, height: 40, borderRadius: 8, marginRight: 12 },
  clubName: { fontSize: 18, fontFamily: 'Helvetica-Bold' },
  subtitle: { fontSize: 10, color: '#94a3b8', marginTop: 2 },
  heroBox: { borderRadius: 12, padding: 24, marginBottom: 24, alignItems: 'center' },
  heroLabel: { fontSize: 10, color: 'rgba(255,255,255,0.7)', marginBottom: 4 },
  heroValue: { fontSize: 36, fontFamily: 'Helvetica-Bold', color: '#ffffff' },
  kpiRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  kpiCard: { flex: 1, backgroundColor: '#f8fafc', borderRadius: 10, padding: 14 },
  kpiLabel: { fontSize: 8, color: '#94a3b8', marginBottom: 4, textTransform: 'uppercase' },
  kpiValue: { fontSize: 18, fontFamily: 'Helvetica-Bold', color: '#0f172a' },
  sectionTitle: { fontSize: 12, fontFamily: 'Helvetica-Bold', marginBottom: 10, marginTop: 20 },
  streamRow: { flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: '#f1f5f9', paddingVertical: 8 },
  streamName: { fontSize: 10, color: '#475569' },
  streamValue: { fontSize: 10, fontFamily: 'Helvetica-Bold', color: '#0f172a' },
  tableHeader: { flexDirection: 'row', backgroundColor: '#f8fafc', borderRadius: 4, paddingVertical: 6, paddingHorizontal: 8, marginBottom: 4 },
  tableRow: { flexDirection: 'row', paddingVertical: 6, paddingHorizontal: 8, borderBottomWidth: 1, borderBottomColor: '#f8fafc' },
  tableCell: { flex: 1, fontSize: 9, color: '#475569' },
  tableCellBold: { flex: 1, fontSize: 9, fontFamily: 'Helvetica-Bold', color: '#0f172a', textAlign: 'right' },
  footer: { position: 'absolute', bottom: 20, left: 40, right: 40, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  footerText: { fontSize: 8, color: '#94a3b8' },
})

const STREAMS = [
  { key: 'subscriptions', label: 'Subscriptions' },
  { key: 'predictions', label: 'Predictions & Voting' },
  { key: 'virtualGifts', label: 'Virtual Gifts' },
  { key: 'merchandise', label: 'Merchandise Store' },
  { key: 'tokenFees', label: 'Token Economy' },
  { key: 'digitalCards', label: 'Digital Cards' },
]

interface Props { data: WizardData; results: RevenueResults }

export default function ReportPDF({ data, results }: Props) {
  return (
    <Document>
      <Page size="A4" style={s.page}>
        <View style={s.header}>
          {/* eslint-disable-next-line jsx-a11y/alt-text */}
          {data.logoDataUrl && <Image src={data.logoDataUrl} style={s.logo} />}
          <View>
            <Text style={s.clubName}>{data.clubName}</Text>
            <Text style={s.subtitle}>Revenue Simulation · 2025–2030 · Powered by SporTech</Text>
          </View>
        </View>

        <View style={[s.heroBox, { backgroundColor: data.primaryColor }]}>
          <Text style={s.heroLabel}>Estimated Year 1 Revenue (Club Share)</Text>
          <Text style={s.heroValue}>{fmtM(results.year1)}</Text>
        </View>

        <View style={s.kpiRow}>
          <View style={s.kpiCard}>
            <Text style={s.kpiLabel}>5-Year Total</Text>
            <Text style={s.kpiValue}>{fmtM(results.cumulativeTotal)}</Text>
          </View>
          <View style={s.kpiCard}>
            <Text style={s.kpiLabel}>Implied Valuation</Text>
            <Text style={s.kpiValue}>{fmtM(results.valuation)}</Text>
          </View>
          <View style={s.kpiCard}>
            <Text style={s.kpiLabel}>Active Fans</Text>
            <Text style={s.kpiValue}>{(results.tiers.totalActive / 1_000).toFixed(0)}K</Text>
          </View>
        </View>

        <Text style={s.sectionTitle}>Revenue by Stream (Year 1)</Text>
        {STREAMS.map(st => (
          <View key={st.key} style={s.streamRow}>
            <Text style={s.streamName}>{st.label}</Text>
            <Text style={s.streamValue}>{fmtM(results[st.key as keyof RevenueResults] as number)}</Text>
          </View>
        ))}

        <Text style={s.sectionTitle}>5-Year Projection</Text>
        <View style={s.tableHeader}>
          <Text style={[s.tableCell, { fontFamily: 'Helvetica-Bold' }]}>Year</Text>
          {results.projection.map((_, i) => (
            <Text key={i} style={[s.tableCellBold, { color: '#64748b' }]}>{2026 + i}</Text>
          ))}
        </View>
        <View style={s.tableRow}>
          <Text style={s.tableCell}>Club Revenue</Text>
          {results.projection.map((v, i) => <Text key={i} style={s.tableCellBold}>{fmtM(v)}</Text>)}
        </View>

        <View style={s.footer}>
          <Text style={s.footerText}>Confidential — {data.clubName} Revenue Simulation</Text>
          <Text style={s.footerText}>sportech.com.sa</Text>
        </View>
      </Page>
    </Document>
  )
}
