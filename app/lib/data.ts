import { sql } from '@vercel/postgres';

import {
  Openday,
  Event,
} from './definitions';

export async function fetchOpendays() {
  try {
    // Artificially delay a response for demo purposes.
    // Don't do this in production :)

    console.log('Fetching Openday data...');
    const data = await sql<Openday>`SELECT * FROM openday`;

    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch Openday data.');
  }
}

export async function fetchOpendayById(id: string) {
  const opendays = await fetchOpendays();
  return opendays.find((o) => o.id === id);
}

export async function fetchEventsByOpendayId(opendayId: string) {
  try {
    console.log('Fetching Events for Openday:', opendayId);
    const data = await sql<Event>`SELECT * FROM event WHERE openday_fk = ${opendayId}`;
    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch Event data.');
  }
}