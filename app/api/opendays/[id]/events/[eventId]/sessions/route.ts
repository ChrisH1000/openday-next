import { sql } from '@vercel/postgres';
import { NextRequest, NextResponse } from 'next/server';
import { createSession } from '@/app/lib/actions';
import { buildErrorResponse } from '@/app/lib/errors';
import { identifierSchema } from '@/app/lib/schemas';

export async function GET(_req: Request, { params }: { params: { id: string; eventId: string } }) {
  try {
    const eventId = identifierSchema.parse(params.eventId);
    const sessionsResult = await sql`SELECT * FROM session WHERE event_fk = ${eventId} ORDER BY starttime`;
    return NextResponse.json(sessionsResult.rows, { status: 200 });
  } catch (error) {
    return buildErrorResponse(error);
  }
}

export async function POST(req: NextRequest, { params }: { params: { id: string; eventId: string } }) {
  try {
    const eventId = identifierSchema.parse(params.eventId);
    const payload = await req.json();
    const created = await createSession({ ...payload, event_fk: eventId });
    return NextResponse.json({ session: created }, { status: 201 });
  } catch (error) {
    return buildErrorResponse(error);
  }
}