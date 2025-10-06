import { sql } from '@vercel/postgres';
import { NextRequest, NextResponse } from 'next/server';
import { updateEvent } from '@/app/lib/actions';

export async function PUT(req: NextRequest, { params }: { params: { id: string; eventId: string } }) {
  const data = await req.json();
  try {
    const updated = await updateEvent({ ...data, id: params.eventId });
    return NextResponse.json({ success: true, event: updated });
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ success: false, error: errorMessage }, { status: 400 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string; eventId: string } }) {
  try {
    const result = await sql`DELETE FROM event WHERE id = ${params.eventId} RETURNING *`;
    if (result.rows.length === 0) {
      return new Response(JSON.stringify({ success: false, error: 'No record deleted. ID not found.' }), { status: 404 });
    }
    return new Response(null, { status: 204 });
  } catch (e) {
    return new Response(JSON.stringify({ success: false, error: e instanceof Error ? e.message : 'Unknown error' }), { status: 400 });
  }
}
