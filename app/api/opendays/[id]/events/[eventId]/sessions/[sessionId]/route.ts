import { sql } from '@vercel/postgres';
import { NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/app/lib/actions';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string; eventId: string; sessionId: string }> }) {
  const { sessionId } = await params;
  const data = await req.json();
  try {
    const updated = await updateSession({ ...data, id: sessionId });
    return NextResponse.json({ success: true, session: updated });
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ success: false, error: errorMessage }, { status: 400 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string; eventId: string; sessionId: string }> }) {
  const { sessionId } = await params;
  try {
    const result = await sql`DELETE FROM session WHERE id = ${sessionId} RETURNING *`;
    if (result.rows.length === 0) {
      return new Response(JSON.stringify({ success: false, error: 'No record deleted. ID not found.' }), { status: 404 });
    }
    return new Response(null, { status: 204 });
  } catch (e) {
    return new Response(JSON.stringify({ success: false, error: e instanceof Error ? e.message : 'Unknown error' }), { status: 400 });
  }
}