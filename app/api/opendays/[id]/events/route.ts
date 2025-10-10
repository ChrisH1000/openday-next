import { sql } from '@vercel/postgres';
import { NextRequest, NextResponse } from 'next/server';
import { createEvent } from '@/app/lib/actions';
import { buildErrorResponse } from '@/app/lib/errors';
import { identifierSchema } from '@/app/lib/schemas';

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const opendayId = identifierSchema.parse(params.id);
    const eventsResult = await sql`
      SELECT
        e.id,
        e.title,
        e.description,
        e.interests,
        e.openday_fk,
        COALESCE(
          json_agg(
            json_build_object(
              'id', s.id,
              'starttime', s.starttime,
              'endtime', s.endtime,
              'event_fk', s.event_fk
            )
          ) FILTER (WHERE s.id IS NOT NULL),
          '[]'::json
        ) AS sessions
      FROM event e
      LEFT JOIN session s ON s.event_fk = e.id
      WHERE e.openday_fk = ${opendayId}
      GROUP BY e.id
      ORDER BY e.title ASC
    `;

    return NextResponse.json(eventsResult.rows, { status: 200 });
  } catch (error) {
    return buildErrorResponse(error);
  }
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const opendayId = identifierSchema.parse(params.id);
    const payload = await req.json();
    const created = await createEvent({ ...payload, openday_fk: opendayId });
    return NextResponse.json({ event: created }, { status: 201 });
  } catch (error) {
    return buildErrorResponse(error);
  }
}