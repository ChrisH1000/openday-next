import { sql } from '@vercel/postgres';
import { NextRequest, NextResponse } from 'next/server';
import { createEvent } from '@/app/lib/actions';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    // First get events
    const eventsResult = await sql`SELECT * FROM event WHERE openday_fk = ${params.id}`;

    // Then get sessions for each event
    const eventsWithSessions = await Promise.all(
      eventsResult.rows.map(async (event) => {
        const sessionsResult = await sql`SELECT * FROM session WHERE event_fk = ${event.id} ORDER BY starttime`;
        return {
          ...event,
          sessions: sessionsResult.rows
        };
      })
    );

    return new Response(JSON.stringify(eventsWithSessions), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : 'Unknown error' }), { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const data = await req.json();
  try {
    const created = await createEvent({ ...data, openday_fk: params.id });
    return NextResponse.json({ success: true, event: created });
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ success: false, error: errorMessage }, { status: 400 });
  }
}