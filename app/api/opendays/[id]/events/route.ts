import { sql } from '@vercel/postgres';
import { NextRequest, NextResponse } from 'next/server';
import { createEvent } from '@/app/lib/actions';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const result = await sql`SELECT * FROM event WHERE openday_fk = ${params.id}`;
    return new Response(JSON.stringify(result.rows), {
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