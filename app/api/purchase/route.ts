import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'
import { Resend } from 'resend'

export async function POST(req: NextRequest) {
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const resend = new Resend(process.env.RESEND_API_KEY!)

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

      let tipoManual = 'Producto Manual'
      if (productCode.includes('FRAGMENT')) tipoManual = 'Fragmentos'
      else if (productCode.includes('BOX')) tipoManual = 'Cajas Tokens'
      else if (productCode.includes('PASSE')) tipoManual = 'Pase Booyah'

      try {
        await resend.emails.send({
          from: 'ordenes@mail.imshop.games',
          to: 'mckenzey17@gmail.com',
          subject: `IMSHOP | Nueva Orden Manual - ${tipoManual}`,
          html: `
            <div style="font-family: Arial, sans-serif; padding: 40px 20px; background-color: #070609; color: #ffffff; max-width: 600px; margin: 0 auto; border: 1px solid #1f1a29;">
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 900; letter-spacing: 2px;">IM<span style="color: #ff2a1f;">SHOP</span></h1>
              </div>
              
              <h2 style="color: #ffb703; font-weight: 900; text-transform: uppercase; margin-bottom: 10px; font-size: 20px;">Orden de Entrega: ${tipoManual}</h2>
              <p style="color: #a1a1aa; font-size: 14px; line-height: 1.5;">El usuario ha pagado con su saldo virtual. Ingresa a Free Fire y envía este regalo al jugador:</p>
              
              <div style="background-color: #110f16; padding: 20px; border-left: 4px solid #ffb703; margin: 25px 0;">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding-bottom: 15px; color: #a1a1aa; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; font-weight: bold; width: 40%;">ID Orden</td>
                    <td style="padding-bottom: 15px; font-weight: bold; font-family: monospace; font-size: 14px;">${order.id}</td>
                  </tr>
                  <tr>
                    <td style="padding-bottom: 15px; color: #a1a1aa; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; font-weight: bold;">Cliente</td>
                    <td style="padding-bottom: 15px; font-weight: bold; font-size: 14px;">${user.email}</td>
                  </tr>
                  <tr>
                    <td style="padding-bottom: 15px; color: #a1a1aa; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; font-weight: bold;">ID Destino</td>
                    <td style="padding-bottom: 15px; font-weight: 900; font-size: 20px; color: #ffb703; font-family: monospace;">${playerId}</td>
                  </tr>
                  <tr>
                    <td style="padding-bottom: 15px; color: #a1a1aa; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; font-weight: bold;">Nickname</td>
                    <td style="padding-bottom: 15px; font-weight: bold; font-size: 14px;">${nickname}</td>
                  </tr>
                  <tr>
                    <td style="padding-bottom: 15px; color: #a1a1aa; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; font-weight: bold;">Cód. Producto</td>
                    <td style="padding-bottom: 15px; font-weight: bold; font-size: 11px; color: #a1a1aa;">${productCode}</td>
                  </tr>
                  <tr>
                    <td style="color: #a1a1aa; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; font-weight: bold;">Ganancia</td>
                    <td style="font-weight: 900; font-size: 18px; color: #00e5ff; font-family: monospace;">S/ ${numPrice.toFixed(2)}</td>
                  </tr>
                </table>
              </div>
              
              <p style="color: #a1a1aa; font-size: 14px; margin-bottom: 25px;">Recuerda actualizar el estado de la orden en tu panel de administración al terminar de enviar el regalo.</p>
              <a href="https://www.imshop.games/admin" style="display: inline-block; padding: 14px 28px; background-color: #ffb703; color: #000000; text-decoration: none; font-weight: 900; text-transform: uppercase; letter-spacing: 1px; font-size: 12px;">Ir al Panel Admin</a>
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
