import { sql } from '@vercel/postgres';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

import type { AdminUser } from '@/app/lib/definitions';

const POSTGRES_UNIQUE_VIOLATION = '23505';

const getPostgresErrorCode = (error: unknown): string | undefined => {
  if (typeof error === 'object' && error !== null && 'code' in error) {
    return (error as { code?: string }).code;
  }
  return undefined;
};

export const createAdminUserSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  email: z.string().trim().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
  admin: z.boolean().default(false),
});

export const updateAdminUserSchema = z
  .object({
    name: z.string().trim().min(1).optional(),
    email: z.string().trim().email('Invalid email address').optional(),
    password: z.string().min(8, 'Password must be at least 8 characters long').optional(),
    admin: z.boolean().optional(),
  })
  .refine((value) => Object.values(value).some((v) => v !== undefined), {
    message: 'At least one field must be provided',
  });

export type CreateAdminUserInput = z.infer<typeof createAdminUserSchema>;
export type UpdateAdminUserInput = z.infer<typeof updateAdminUserSchema>;

export async function listAdminUsers(): Promise<AdminUser[]> {
  try {
    const result = await sql<AdminUser>`
      SELECT id, name, email, admin
      FROM users
      ORDER BY name ASC
    `;
    return result.rows;
  } catch (error) {
    console.error('Failed to list admin users:', error);
    throw new Error('Failed to list admin users.');
  }
}

export async function getAdminUser(id: string): Promise<AdminUser | null> {
  try {
    const result = await sql<AdminUser>`
      SELECT id, name, email, admin
      FROM users
      WHERE id = ${id}
      LIMIT 1
    `;
    return result.rows[0] ?? null;
  } catch (error) {
    console.error('Failed to fetch admin user:', error, { id });
    throw new Error('Failed to fetch admin user.');
  }
}

export async function createAdminUser(input: CreateAdminUserInput): Promise<AdminUser> {
  try {
    const id = crypto.randomUUID();
    const hashedPassword = await bcrypt.hash(input.password, 10);
    const result = await sql<AdminUser>`
      INSERT INTO users (id, name, email, password, admin)
      VALUES (${id}, ${input.name}, ${input.email.toLowerCase()}, ${hashedPassword}, ${input.admin})
      RETURNING id, name, email, admin
    `;
    return result.rows[0];
  } catch (error: unknown) {
    console.error('Failed to create admin user:', error, { input: { ...input, password: '[REDACTED]' } });
    if (getPostgresErrorCode(error) === POSTGRES_UNIQUE_VIOLATION) {
      throw new Error('Email already exists.');
    }
    throw new Error('Failed to create admin user.');
  }
}

export async function updateAdminUser(id: string, input: UpdateAdminUserInput): Promise<AdminUser> {
  try {
    if (
      input.name === undefined &&
      input.email === undefined &&
      input.password === undefined &&
      input.admin === undefined
    ) {
      throw new Error('No updates provided.');
    }

    const hashedPassword = input.password ? await bcrypt.hash(input.password, 10) : null;
    const normalizedEmail = input.email ? input.email.toLowerCase() : null;
    const result = await sql<AdminUser>`
      UPDATE users
      SET
        name = COALESCE(${input.name ?? null}, name),
        email = COALESCE(${normalizedEmail}, email),
        password = COALESCE(${hashedPassword}, password),
        admin = COALESCE(${input.admin ?? null}, admin)
      WHERE id = ${id}
      RETURNING id, name, email, admin
    `;

    if (result.rows.length === 0) {
      throw new Error('Admin user not found.');
    }

    return result.rows[0];
  } catch (error: unknown) {
    console.error('Failed to update admin user:', error, { id, input: { ...input, password: input.password ? '[REDACTED]' : undefined } });
    if (getPostgresErrorCode(error) === POSTGRES_UNIQUE_VIOLATION) {
      throw new Error('Email already exists.');
    }
    throw new Error('Failed to update admin user.');
  }
}

export async function deleteAdminUser(id: string): Promise<void> {
  try {
    const result = await sql`DELETE FROM users WHERE id = ${id}`;
    if (result.rowCount === 0) {
      throw new Error('Admin user not found.');
    }
  } catch (error) {
    console.error('Failed to delete admin user:', error, { id });
    throw new Error('Failed to delete admin user.');
  }
}