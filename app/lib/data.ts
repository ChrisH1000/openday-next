import { sql } from '@vercel/postgres';

import { Openday, Event } from './definitions';
import { identifierSchema } from '@/app/lib/schemas';

export async function fetchOpendays() {
  try {
    const data = await sql<Openday>`SELECT * FROM openday ORDER BY starttime DESC`;

    return data.rows;
  } catch {
    throw new Error('Failed to fetch Openday data.');
  }
}

export async function fetchOpendayById(id: string) {
  const opendayId = identifierSchema.parse(id);
  try {
    const data = await sql<Openday>`SELECT * FROM openday WHERE id = ${opendayId} LIMIT 1`;
    return data.rows[0] ?? null;
  } catch {
    throw new Error('Failed to fetch Openday.');
  }
}

export async function fetchEventsByOpendayId(opendayId: string) {
  try {
    const validatedId = identifierSchema.parse(opendayId);
    const data = await sql<Event>`SELECT * FROM event WHERE openday_fk = ${validatedId} ORDER BY title ASC`;
    return data.rows;
  } catch {
    throw new Error('Failed to fetch Event data.');
  }
}