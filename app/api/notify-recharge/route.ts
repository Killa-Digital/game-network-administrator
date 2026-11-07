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
      subject: `💰 Nueva Recarga por Aprobar - S/ ${amount}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; background-color: #070609; color: #ffffff;">
          <h2 style="color: #00e5ff;">Nueva Solicitud de Recarga</h2>
          <p>Un usuario ha subido una captura de pago y está esperando que apruebes su saldo.</p>
          <div style="background-color: #110f16; padding: 15px; border-left: 4px solid #00e5ff; margin: 20px 0;">
            <p><strong>Email del Cliente:</strong> ${userEmail || 'No especificado'}</p>
            <p><strong>Monto Yapeado/Transferido:</strong> <span style="font-size: 18px; color: #00e5ff;">S/ ${Number(amount).toFixed(2)}</span></p>
          </div>
          <p>Entra a tu panel para verificar el comprobante y sumarle el saldo.</p>
          <a href="https://www.imshop.games/admin" style="display: inline-block; padding: 12px 24px; background-color: #00e5ff; color: #000000; text-decoration: none; font-weight: bold; text-transform: uppercase; margin-top: 10px;">Ir al Panel Admin</a>
        </div>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error enviando notificación de recarga:', error)
    return NextResponse.json({ error: 'Error enviando correo' }, { status: 500 })
  }
}
