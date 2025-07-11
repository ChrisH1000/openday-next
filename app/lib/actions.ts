'use server';

// import { z } from 'zod';
// import { sql } from '@vercel/postgres';
// import { revalidatePath } from 'next/cache';
// import { redirect } from 'next/navigation';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { sql } from '@vercel/postgres';
import bcrypt from 'bcrypt';

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
  console.log(formData);
  try {
    const user = {
      id: crypto.randomUUID(),
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
  try {
    const result = await sql`
      UPDATE openday
      SET title = ${title}, campus = ${campus}, starttime = ${starttime}, endtime = ${endtime}, status = ${status}
      WHERE id = ${id}
      RETURNING *;
    `;
    return result.rows[0];
  } catch (error) {
    console.error('Failed to update openday:', error, { id, title, campus, starttime, endtime, status });
    throw new Error('Failed to update openday.');
  }
}

export async function createOpenday({ title, campus, starttime, endtime }: { title: string, campus: string, starttime: number, endtime: number }) {
  try {
    const id = crypto.randomUUID();
    const status = 'under construction';
    const result = await sql`
      INSERT INTO openday (id, title, campus, starttime, endtime, status)
      VALUES (${id}, ${title}, ${campus}, ${starttime}, ${endtime}, ${status})
      RETURNING *;
    `;
    return result.rows[0];
  } catch (error) {
    console.error('Failed to create openday:', error, { title, campus, starttime, endtime });
    throw new Error('Failed to create openday.');
  }
}