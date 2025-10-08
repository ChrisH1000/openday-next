import { sql } from '@vercel/postgres';
import { NextRequest, NextResponse } from 'next/server';
import { createSession } from '@/app/lib/actions';

export async function GET(req: Request, { params }: { params: { id: string; eventId: string } }) {
  try {
    const sessionsResult = await sql`SELECT * FROM session WHERE event_fk = ${params.eventId} ORDER BY starttime`;
    return new Response(JSON.stringify(sessionsResult.rows), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : 'Unknown error' }), { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: { id: string; eventId: string } }) {
  const data = await req.json();
  try {
    const created = await createSession({ ...data, event_fk: params.eventId });
    return NextResponse.json({ success: true, session: created });
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ success: false, error: errorMessage }, { status: 400 });
  }
}