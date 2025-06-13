import { sql } from '@vercel/postgres';

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    console.log('DELETE /api/opendays/[id] called with id:', params.id);
    const result = await sql`DELETE FROM openday WHERE id = ${params.id} RETURNING *`;
    console.log('Rows deleted:', result.rows.length, 'Deleted row:', result.rows[0]);
    if (result.rows.length === 0) {
      return new Response(JSON.stringify({ success: false, error: 'No record deleted. ID not found.' }), { status: 404 });
    }
    return new Response(null, { status: 204 });
  } catch (e) {
    return new Response(JSON.stringify({ success: false, error: e instanceof Error ? e.message : 'Unknown error' }), { status: 400 });
  }
}
