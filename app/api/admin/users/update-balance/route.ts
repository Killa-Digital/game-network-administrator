export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';


export async function POST(req: Request) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  try {
        const body = await req.json();

        const {userId, amountToAdd} = body;

        if (!userId || amountToAdd === undefined) {
            return NextResponse.json({success: false, error: 'Faltan datos'}, {status: 400});
        }

        const {data: profile, error: fetchError} = await supabase
            .from('profiles')
            .select('balance')
            .eq('id', userId)
            .single();

        if (fetchError) throw fetchError;

        const currentBalance = profile?.balance || 0;
        const newBalance = Number((currentBalance + Number(amountToAdd)).toFixed(2));

            const { error: updateError } = await supabase
            .from('profiles')
            .update({ balance: newBalance })
            .eq('id', userId);

        if (updateError) throw updateError;

        return NextResponse.json({ success: true, newBalance });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}