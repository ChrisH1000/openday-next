import { sql } from '@vercel/postgres';
import { NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/app/lib/actions';
import { buildErrorResponse, NotFoundError } from '@/app/lib/errors';
import { identifierSchema } from '@/app/lib/schemas';

export async function PUT(req: NextRequest, { params }: { params: { id: string; eventId: string; sessionId: string } }) {
  try {
    const sessionId = identifierSchema.parse(params.sessionId);
    const payload = await req.json();
    const updated = await updateSession({ ...payload, id: sessionId });
    return NextResponse.json({ session: updated }, { status: 200 });
  } catch (error) {
    return buildErrorResponse(error);
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string; eventId: string; sessionId: string } }) {
  try {
    const sessionId = identifierSchema.parse(params.sessionId);
    const result = await sql`DELETE FROM session WHERE id = ${sessionId} RETURNING id`;
    if (result.rows.length === 0) {
      throw new NotFoundError('Session not found.');
    }
    return new Response(null, { status: 204 });
  } catch (error) {
    return buildErrorResponse(error);
  }
}