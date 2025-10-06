import { sql } from '@vercel/postgres';

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