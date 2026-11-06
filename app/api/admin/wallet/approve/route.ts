import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { requestId, userId, amount, action } = body

    if (!requestId || !userId || !amount) {
      return NextResponse.json({ error: 'Faltan datos' }, { status: 400 })
    }

    if (action === 'reject') {
      await supabaseAdmin.from('wallet_requests').update({ status: 'rejected' }).eq('id', requestId)
      return NextResponse.json({ success: true, message: 'Rechazado' })
    }

    const { data: request, error: reqError } = await supabaseAdmin
      .from('wallet_requests')
      .select('status')
      .eq('id', requestId)
      .single()

    if (reqError || request.status !== 'pending') {
      return NextResponse.json({ error: 'La solicitud ya fue procesada' }, { status: 400 })
    }

    await supabaseAdmin.from('wallet_requests').update({ status: 'approved' }).eq('id', requestId)

    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('balance')
      .eq('id', userId)
      .single()

    const currentBalance = profile?.balance || 0

    const { error: updateError } = await supabaseAdmin
      .from('profiles')
      .update({ balance: currentBalance + Number(amount) })
      .eq('id', userId)

    if (updateError) throw updateError

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error procesando recarga:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
