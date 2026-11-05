import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
    try {
        const cookieStore = await cookies();
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() { return cookieStore.getAll(); },
                    setAll(cookiesToSet) {
                        try {
                            cookiesToSet.forEach(({ name, value, options }) =>
                                cookieStore.set(name, value, options)
                            );
                        } catch (error) {}
                    },
                },
            }
        );

        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'No autorizado. Inicia sesión.' }, { status: 401 });
        }

        const body = await req.json();
        const { playerId, nickname, productCode, price } = body;

        if (!playerId || !productCode || !price) {
            return NextResponse.json({ error: 'Faltan datos de la orden' }, { status: 400 });
        }

        const { data: order, error } = await supabase
            .from('orders')
            .insert([{
                player_id: playerId,
                nickname: nickname,
                product_code: productCode,
                price: price,
                status: 'pending',
                user_id: user.id,
                user_email: user.email
            }])
            .select()
            .single();

        if (error) {
            console.error('Error insertando en Supabase:', error);
            throw error;
        }

        const izipayShopId = process.env.IZIPAY_SHOP_ID;
        const izipayPassword = process.env.IZIPAY_TEST_PASSWORD;
        const authCredentials = Buffer.from(`${izipayShopId}:${izipayPassword}`).toString('base64');

        const amountInCents = Math.round(Number(price) * 100);

        const izipayResponse = await fetch('https://api.micuentaweb.pe/api-payment/V4/Charge/CreatePayment', {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${authCredentials}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                amount: amountInCents,
                currency: 'PEN',
                orderId: order.id.toString(),
                customer: {
                    email: user.email
                }
            })
        });

        const izipayData = await izipayResponse.json();

        if (izipayData.status !== 'SUCCESS') {
            console.error('Error de Izipay:', izipayData);
            return NextResponse.json({ error: 'Error al conectar con la pasarela de pago' }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            formToken: izipayData.answer.formToken,
            orderId: order.id
        });

    } catch (error) {
        console.error('Error creando orden en Izipay:', error);
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    }
}