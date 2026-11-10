import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

export async function POST(req: NextRequest) {
  const resend = new Resend(process.env.RESEND_API_KEY!)

  try {
    const body = await req.json()
    const { amount, userId, userEmail } = body

    if (!amount) {
      return NextResponse.json({ error: 'Faltan datos' }, { status: 400 })
    }

    await resend.emails.send({
      from: 'pagos@mail.imshop.games',
      to: 'mckenzey17@gmail.com',
      subject: `IMSHOP | 💰 Nueva Recarga por Aprobar - S/ ${amount}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 40px 20px; background-color: #070609; color: #ffffff; max-width: 600px; margin: 0 auto; border: 1px solid #1f1a29;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 900; letter-spacing: 2px;">IM<span style="color: #ff2a1f;">SHOP</span></h1>
          </div>
          
          <h2 style="color: #00e5ff; font-weight: 900; text-transform: uppercase; margin-bottom: 10px; font-size: 20px;">Nueva Solicitud de Recarga</h2>
          <p style="color: #a1a1aa; font-size: 14px; line-height: 1.5;">Un usuario ha subido una captura de pago y está esperando que apruebes su saldo.</p>
          
          <div style="background-color: #110f16; padding: 20px; border-left: 4px solid #00e5ff; margin: 25px 0;">
            <p style="margin: 0 0 8px 0; color: #a1a1aa; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; font-weight: bold;">Email del Cliente</p>
            <p style="margin: 0 0 20px 0; font-weight: bold; font-size: 15px;">${userEmail || 'No especificado'}</p>
            
            <p style="margin: 0 0 8px 0; color: #a1a1aa; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; font-weight: bold;">Monto Depositado</p>
            <p style="margin: 0; font-size: 24px; color: #00e5ff; font-weight: 900; font-family: monospace;">S/ ${Number(amount).toFixed(2)}</p>
          </div>
          
          <p style="color: #a1a1aa; font-size: 14px; margin-bottom: 25px;">Entra a tu panel para verificar el comprobante y sumarle el saldo.</p>
          <a href="https://www.imshop.games/admin" style="display: inline-block; padding: 14px 28px; background-color: #00e5ff; color: #000000; text-decoration: none; font-weight: 900; text-transform: uppercase; letter-spacing: 1px; font-size: 12px;">Ir al Panel Admin</a>
        </div>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error enviando notificación de recarga:', error)
    return NextResponse.json({ error: 'Error enviando correo' }, { status: 500 })
  }
}
