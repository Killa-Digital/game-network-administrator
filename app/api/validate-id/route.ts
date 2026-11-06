import { NextResponse } from 'next/server'
import crypto from 'crypto'

export async function POST(request: Request) {
  try {
    const { playerId, gameCode } = await request.json()

    const apiKey = process.env.CODESTORE_API_KEY!
    const secretKey = process.env.CODESTORE_SECRET_KEY!
    const targetPath = '/v1/validate-player'
    const method = 'POST'
    const timestamp = Date.now().toString()

    const codestoreGameCode = gameCode === 'freefire' ? 'free-fire-latam' : gameCode

    const bodyObj = {
      game: codestoreGameCode,
      playerId: playerId,
      zoneId: '',
    }
    const stringifiedBody = JSON.stringify(bodyObj)

    const payload = `${timestamp}.${method}.${targetPath}.${stringifiedBody}`
    const signature = crypto.createHmac('sha256', secretKey).update(payload).digest('hex')

    const response = await fetch(`https://api.codestore.app${targetPath}`, {
      method: method,
      headers: {
        'x-api-key': apiKey,
        'x-timestamp': timestamp,
        'x-signature': signature,
        'Content-Type': 'application/json',
      },
      body: stringifiedBody,
    })

    const data = await response.json()

    if (response.ok && data.success) {
      return NextResponse.json({
        success: true,
        nickname: data.data.nickname,
      })
    } else {
      return NextResponse.json(
        { success: false, error: data.message || 'ID no encontrado o inválido' },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Error validando ID con Codestore:', error)
    return NextResponse.json(
      { success: false, error: 'Error de conexión con el servidor mayorista' },
      { status: 500 }
    )
  }
}