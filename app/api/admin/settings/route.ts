import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: Request) {
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  try {
    const { maintenanceMode } = await req.json();

    const { error } = await supabaseAdmin
      .from('site_settings')
      .update({ maintenance_mode: maintenanceMode })
      .eq('id', 1);

    if (error) throw error;

    return NextResponse.json({ success: true, maintenance_mode: maintenanceMode });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}