import { sql } from '@vercel/postgres';
import { NextRequest, NextResponse } from 'next/server';
import { updateEvent } from '@/app/lib/actions';
import { buildErrorResponse, NotFoundError } from '@/app/lib/errors';
import { identifierSchema } from '@/app/lib/schemas';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string; eventId: string }> }) {
  try {
    const { eventId } = await params;
    const parsedEventId = identifierSchema.parse(eventId);
    const payload = await req.json();
    const updated = await updateEvent({ ...payload, id: parsedEventId });
    return NextResponse.json({ event: updated }, { status: 200 });
  } catch (error) {
    return buildErrorResponse(error);
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string; eventId: string }> }) {
  try {
    const { eventId } = await params;
    const parsedEventId = identifierSchema.parse(eventId);
    const result = await sql`DELETE FROM event WHERE id = ${parsedEventId} RETURNING id`;
    if (result.rows.length === 0) {
      throw new NotFoundError('Event not found.');
    }
    return new Response(null, { status: 204 });
  } catch (error) {
    return buildErrorResponse(error);
  }
}
