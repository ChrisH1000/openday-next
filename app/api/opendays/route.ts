import { sql } from '@vercel/postgres';

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
    return new Response(JSON.stringify(result.rows), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : 'Unknown error' }), { status: 500 });
  }
}
