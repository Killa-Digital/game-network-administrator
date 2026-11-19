import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const revalidate = 300

const admin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const TOP_SIZE = 5

const EXCLUDED_USER_IDS = new Set(['12ae1230-f9a6-44f8-9cdb-eb6881a7402d'])

const maskName = (fullName?: string | null, email?: string | null) => {
  const base = (fullName || '').trim() || (email || '').split('@')[0] || 'Cliente'
  const parts = base.split(/\s+/)
  if (parts.length === 1) return parts[0]
  return `${parts[0]} ${parts[parts.length - 1][0].toUpperCase()}.`
}

export async function GET() {
  const { data: reqs, error } = await admin
    .from('wallet_requests')
    .select('user_id, amount')
    .eq('status', 'approved')

  if (error) {
    return NextResponse.json({ success: false, error: 'No se pudo cargar el top' }, { status: 500 })
  }

  const totals: Record<string, number> = {}
  for (const r of reqs || []) {
    if (EXCLUDED_USER_IDS.has(r.user_id)) continue
    totals[r.user_id] = (totals[r.user_id] || 0) + Number(r.amount || 0)
  }

  const top = Object.entries(totals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, TOP_SIZE)

  if (top.length === 0) return NextResponse.json({ success: true, top: [] })

  const { data: profiles } = await admin
    .from('profiles')
    .select('id, full_name, email')
    .in(
      'id',
      top.map(([id]) => id)
    )

  const result = top.map(([id, total], idx) => {
    const p = profiles?.find((x) => x.id === id)
    return {
      rank: idx + 1,
      name: maskName(p?.full_name, p?.email),
      total: Number(total.toFixed(2)),
    }
  })

  return NextResponse.json({ success: true, top: result })
}
