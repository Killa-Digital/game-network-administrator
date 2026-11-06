import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'
import { Resend } from 'resend'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const resend = new Resend(process.env.RESEND_API_KEY!)

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              )
            } catch (error) {}
          },
        },
      }
    )

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'No autorizado. Inicia sesión.' }, { status: 401 })
    }

    const body = await req.json()
    const { playerId, nickname, productCode, price } = body

    if (!playerId || !productCode || !price) {
      return NextResponse.json({ error: 'Faltan datos de la orden' }, { status: 400 })
    }

    const numPrice = Number(price)

    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('balance')
      .eq('id', user.id)
      .single()

    if (profileError || !profile)
      return NextResponse.json({ error: 'Error leyendo billetera' }, { status: 500 })

    if (profile.balance < numPrice)
      return NextResponse.json(
        { error: 'INSUFFICIENT_FUNDS', message: 'Saldo insuficiente' },
        { status: 402 }
      )

    const newBalance = profile.balance - numPrice
    await supabaseAdmin.from('profiles').update({ balance: newBalance }).eq('id', user.id)

    const isManual = productCode.startsWith('MANUAL_')
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert([
        {
          player_id: playerId,
          nickname: nickname,
          product_code: productCode,
          price: numPrice,
          status: isManual ? 'pending_manual' : 'processing',
          user_id: user.id,
          user_email: user.email,
        },
      ])
      .select()
      .single()

    if (orderError) throw orderError

    if (isManual) {
      console.log(`[MANUAL] Orden ${order.id} registrada. Enviando correo a administrador...`)

      try {
        await resend.emails.send({
          from: 'ordenes@mail.imshop.games',
          to: 'Mckenzey17@gmail.com',
          subject: `Nueva Orden Manual - ${productCode}`,
          html: `
            <div style="font-family: sans-serif; padding: 20px; background-color: #070609; color: #ffffff;">
              <h2 style="color: #00e5ff;">Nueva orden de entrega manual</h2>
              <p>El usuario ha pagado con su saldo virtual. Ingresa a Free Fire y envía este regalo al jugador:</p>
              <div style="background-color: #110f16; padding: 15px; border-left: 4px solid #ffb703; margin: 20px 0;">
                <p><strong>ID Orden:</strong> ${order.id}</p>
                <p><strong>Cliente:</strong> ${user.email}</p>
                <p><strong>ID Jugador (Destino):</strong> <span style="font-size: 18px; color: #ffb703;">${playerId}</span></p>
                <p><strong>Nickname (Destino):</strong> ${nickname}</p>
                <p><strong>Producto:</strong> ${productCode}</p>
                <p><strong>Ganancia:</strong> S/ ${numPrice.toFixed(2)}</p>
              </div>
              <p>Recuerda actualizar el estado de la orden en tu panel de administración al terminar.</p>
            </div>
          `,
        })
      } catch (emailError) {
        console.error('[MANUAL] Error enviando correo vía Resend:', emailError)
      }

      return NextResponse.json({
        success: true,
        message: '¡Compra exitosa! La entrega está en proceso.',
      })
    }

    const { data: config } = await supabaseAdmin
      .from('product_config')
      .select('*')
      .eq('product_code', productCode)
      .single()

    const isCombo = config?.is_combo || false
    const itemsToInject: string[] = isCombo ? config?.combo_items || [] : [productCode]

    let successCount = 0
    let lastErrorMsg = ''

    console.log(`\n===========================================`)
    console.log(
      `[CODESTORE] Iniciando orden de ${itemsToInject.length} inyecciones para el ID ${playerId}`
    )
    console.log(`===========================================`)

    for (let i = 0; i < itemsToInject.length; i++) {
      console.log(`[CODESTORE] Procesando inyección ${i + 1}/${itemsToInject.length}...`)

      const currentItem = itemsToInject[i]
      const [, productId, sku] = currentItem.split('___')
      const timestamp = Date.now().toString()

      const payloadObj = {
        productId: productId,
        sku: sku,
        quantity: 1,
        partnerOrderId: `${order.id}-${i}`,
        playerId: String(playerId),
        zoneId: '',
      }

      const stringifiedBody = JSON.stringify(payloadObj)
      const signaturePayload = `${timestamp}.POST./v1/orders/recharge.${stringifiedBody}`
      const signature = crypto
        .createHmac('sha256', process.env.CODESTORE_SECRET_KEY!)
        .update(signaturePayload)
        .digest('hex')

      const apiResponse = await fetch(`https://api.codestore.app/v1/orders/recharge`, {
        method: 'POST',
        headers: {
          'x-api-key': process.env.CODESTORE_API_KEY!,
          'x-timestamp': timestamp,
          'x-signature': signature,
          'Content-Type': 'application/json',
        },
        body: stringifiedBody,
      })

      const apiData = await apiResponse.json()

      if (apiResponse.ok && apiData.success === true) {
        successCount++
        console.log(`[CODESTORE] ✅ Inyección ${i + 1} exitosa!`)
      } else {
        lastErrorMsg = apiData.message || 'Desconocido'
        console.error(`[CODESTORE] ❌ Error en inyección ${i + 1}: ${lastErrorMsg}`)
      }

      if (i < itemsToInject.length - 1) {
        console.log(`[CODESTORE] ⏳ Esperando 4 segundos de seguridad anti-spam...`)
        await new Promise((resolve) => setTimeout(resolve, 4000))
      }
    }

    console.log(`[CODESTORE] Finalizado. Éxitos: ${successCount}/${itemsToInject.length}`)
    console.log(`===========================================\n`)

    if (successCount === itemsToInject.length) {
      await supabaseAdmin
        .from('orders')
        .update({
          status: 'completed',
          provider_status: isCombo
            ? `Codestore OK (Combo: ${successCount}/${itemsToInject.length})`
            : 'Codestore OK',
        })
        .eq('id', order.id)

      return NextResponse.json({ success: true, message: '¡Recarga exitosa!' })
    } else if (successCount > 0) {
      await supabaseAdmin
        .from('orders')
        .update({
          status: 'partial_injection',
          provider_status: `Parcial: ${successCount}/${itemsToInject.length} OK. Error: ${lastErrorMsg}`,
        })
        .eq('id', order.id)

      return NextResponse.json({
        success: true,
        message: '¡Recarga Parcial! Contáctate con soporte.',
      })
    } else {
      await supabaseAdmin.from('profiles').update({ balance: profile.balance }).eq('id', user.id)
      await supabaseAdmin
        .from('orders')
        .update({
          status: 'failed_injection',
          provider_status: `Reembolsado. Error: ${lastErrorMsg}`,
        })
        .eq('id', order.id)

      return NextResponse.json({ error: `Fallo en proveedor: ${lastErrorMsg}` }, { status: 500 })
    }
  } catch (error) {
    console.error('Error procesando compra:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
