import { sql } from '@vercel/postgres';
import { NextRequest, NextResponse } from 'next/server';
import { buildErrorResponse } from '@/app/lib/errors';
import { createOpenday } from '@/app/lib/actions';

export async function GET() {
  try {
    // Get opendays with event counts
    const result = await sql`
      SELECT
        o.*,
        COUNT(e.id) as event_count
      FROM openday o
      LEFT JOIN event e ON o.id = e.openday_fk
      GROUP BY o.id
      ORDER BY o.starttime DESC
    `;
    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    return buildErrorResponse(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    const created = await createOpenday(payload);
    return NextResponse.json({ openday: created }, { status: 201 });
  } catch (error) {
    return buildErrorResponse(error);
  }
}
