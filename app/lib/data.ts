import { sql } from '@vercel/postgres';

import {
  Openday,
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