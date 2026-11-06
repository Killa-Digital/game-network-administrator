import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const apiKey = process.env.CODESTORE_API_KEY!

    const response = await fetch('https://api.codestore.app/v1/catalog', {
      method: 'GET',
      headers: {
        'x-api-key': apiKey,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    })

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({ success: false, error: 'Error interno' }, { status: 500 })
  }
}
