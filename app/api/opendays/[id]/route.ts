import { sql } from '@vercel/postgres';
import { buildErrorResponse, NotFoundError } from '@/app/lib/errors';
import { identifierSchema } from '@/app/lib/schemas';

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    const id = identifierSchema.parse(params.id);
    const result = await sql`DELETE FROM openday WHERE id = ${id} RETURNING id`;
    if (result.rows.length === 0) {
      throw new NotFoundError('OpenDay not found.');
    }
    return new Response(null, { status: 204 });
  } catch (error) {
    return buildErrorResponse(error);
  }
}
