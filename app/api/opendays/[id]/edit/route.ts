// API endpoint for updating an openday
import { NextRequest, NextResponse } from 'next/server';
import { updateOpenday } from '@/app/lib/actions';
import { sql } from '@vercel/postgres';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await req.json();
  try {
    const updated = await updateOpenday({ ...data, id: id });
    return NextResponse.json({ success: true, openday: updated });
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ success: false, error: errorMessage }, { status: 400 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    await sql`DELETE FROM openday WHERE id = ${id}`;
    return new Response(null, { status: 204 });
  } catch (e) {
    return new Response(JSON.stringify({ success: false, error: e instanceof Error ? e.message : 'Unknown error' }), { status: 400 });
  }
}
