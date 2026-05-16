import { NextRequest, NextResponse } from 'next/server'
import { isAdminAuthenticated } from '@/lib/adminAuth'
import { fetchAllParamRows, updateModelParam } from '@/lib/model-params'

export const dynamic = 'force-dynamic'

export async function GET() {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const rows = await fetchAllParamRows()
  return NextResponse.json(rows)
}

export async function PATCH(req: NextRequest) {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { key, value } = await req.json()
  if (!key || typeof value !== 'number' || isNaN(value)) {
    return NextResponse.json({ error: 'key (string) and value (number) required' }, { status: 400 })
  }
  await updateModelParam(key, value)
  return NextResponse.json({ ok: true })
}
