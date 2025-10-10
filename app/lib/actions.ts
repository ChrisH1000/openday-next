'use server';

import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { sql } from '@vercel/postgres';
import bcrypt from 'bcryptjs';
import {
  createEventSchema,
  createOpendaySchema,
  createSessionSchema,
  updateEventSchema,
  updateOpendaySchema,
  updateSessionSchema,
} from '@/app/lib/schemas';
import { NotFoundError, ValidationError, extractFieldErrors } from '@/app/lib/errors';
import { randomUUID } from 'node:crypto';

// const FormSchema = z.object({
//   id: z.string(),
//   customerId: z.string({
//     invalid_type_error: 'Please select a customer.',
//   }),
//   amount: z.coerce
//     .number()
//     .gt(0, { message: 'Please enter an amount greater than $0.' }),
//   status: z.enum(['pending', 'paid'], {
//     invalid_type_error: 'Please select an invoice status.',
//   }),
//   date: z.string(),
// });

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}

export async function createUser(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    const user = {
      id: randomUUID(),
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    };

    const hashedPassword = await bcrypt.hash(user.password, 10);

    await sql`
      INSERT INTO users (id, name, email, password, admin)
      VALUES (${user.id}, ${user.name}, ${user.email}, ${hashedPassword}, false)
      ON CONFLICT (id) DO NOTHING;
    `;

  } catch (error) {
    console.error('Failed to create user:', error);
    throw new Error('Failed to create user.');
  }

  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}

export async function updateOpenday({ id, title, campus, starttime, endtime, status }: { id: string, title: string, campus: string, starttime: number, endtime: number, status: string }) {
  const parsed = updateOpendaySchema.safeParse({ id, title, campus, starttime, endtime, status });
  if (!parsed.success) {
    throw new ValidationError('Invalid OpenDay payload.', extractFieldErrors(parsed.error));
  }

  const data = parsed.data;

  try {
    const result = await sql`
      UPDATE openday
      SET title = ${data.title}, campus = ${data.campus}, starttime = ${data.starttime}, endtime = ${data.endtime}, status = ${data.status}
      WHERE id = ${data.id}
      RETURNING id, title, campus, starttime, endtime, status;
    `;
    const updated = result.rows[0];

    if (!updated) {
      throw new NotFoundError('OpenDay not found.');
    }

    return updated;
  } catch {
    throw new Error('Failed to update openday.');
  }
}

export async function createOpenday({ title, campus, starttime, endtime, status }: { title: string, campus: string, starttime: number, endtime: number, status?: string }) {
  const parsed = createOpendaySchema.safeParse({ title, campus, starttime, endtime, status });
  if (!parsed.success) {
    throw new ValidationError('Invalid OpenDay payload.', extractFieldErrors(parsed.error));
  }

  const data = parsed.data;
  try {
    const id = randomUUID();
    const status = data.status ?? 'under construction';
    const result = await sql`
      INSERT INTO openday (id, title, campus, starttime, endtime, status)
      VALUES (${id}, ${data.title}, ${data.campus}, ${data.starttime}, ${data.endtime}, ${status})
      RETURNING id, title, campus, starttime, endtime, status;
    `;
    return result.rows[0];
  } catch {
    throw new Error('Failed to create openday.');
  }
}

export async function createEvent({ title, description, interests, openday_fk }: { title: string, description: string, interests: string, openday_fk: string }) {
  const parsed = createEventSchema.safeParse({ title, description, interests, openday_fk });
  if (!parsed.success) {
    throw new ValidationError('Invalid event payload.', extractFieldErrors(parsed.error));
  }

  const data = parsed.data;
  try {
    const id = randomUUID();
    const result = await sql`
      INSERT INTO event (id, title, description, interests, openday_fk)
      VALUES (${id}, ${data.title}, ${data.description}, ${data.interests}, ${data.openday_fk})
      RETURNING id, title, description, interests, openday_fk;
    `;
    return result.rows[0];
  } catch {
    throw new Error('Failed to create event.');
  }
}

export async function updateEvent({ id, title, description, interests }: { id: string, title: string, description: string, interests: string }) {
  const parsed = updateEventSchema.safeParse({ id, title, description, interests });
  if (!parsed.success) {
    throw new ValidationError('Invalid event payload.', extractFieldErrors(parsed.error));
  }

  const data = parsed.data;
  try {
    const result = await sql`
      UPDATE event
      SET title = ${data.title}, description = ${data.description}, interests = ${data.interests}
      WHERE id = ${data.id}
      RETURNING id, title, description, interests, openday_fk;
    `;
    const updated = result.rows[0];

    if (!updated) {
      throw new NotFoundError('Event not found.');
    }

    return updated;
  } catch {
    throw new Error('Failed to update event.');
  }
}

export async function createSession({ starttime, endtime, event_fk }: { starttime: number, endtime: number, event_fk: string }) {
  const parsed = createSessionSchema.safeParse({ starttime, endtime, event_fk });
  if (!parsed.success) {
    throw new ValidationError('Invalid session payload.', extractFieldErrors(parsed.error));
  }

  const data = parsed.data;
  try {
    const id = randomUUID();
    const result = await sql`
      INSERT INTO session (id, starttime, endtime, event_fk)
      VALUES (${id}, ${data.starttime}, ${data.endtime}, ${data.event_fk})
      RETURNING id, starttime, endtime, event_fk;
    `;
    return result.rows[0];
  } catch {
    throw new Error('Failed to create session.');
  }
}

export async function updateSession({ id, starttime, endtime }: { id: string, starttime: number, endtime: number }) {
  const parsed = updateSessionSchema.safeParse({ id, starttime, endtime });
  if (!parsed.success) {
    throw new ValidationError('Invalid session payload.', extractFieldErrors(parsed.error));
  }

  const data = parsed.data;
  try {
    const result = await sql`
      UPDATE session
      SET starttime = ${data.starttime}, endtime = ${data.endtime}
      WHERE id = ${data.id}
      RETURNING id, starttime, endtime, event_fk;
    `;
    const updated = result.rows[0];

    if (!updated) {
      throw new NotFoundError('Session not found.');
    }

    return updated;
  } catch {
    throw new Error('Failed to update session.');
  }
}