import { NextResponse } from 'next/server';
import type { Session } from 'next-auth';

import { auth } from '@/auth';
import {
  createAdminUser,
  createAdminUserSchema,
  listAdminUsers,
} from '@/app/lib/users';

const unauthorizedResponse = NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

async function ensureAdmin() {
  const session = await auth();
  const user = session?.user as (Session['user'] & { admin?: boolean }) | undefined;
  if (!session || !user?.admin) {
    return unauthorizedResponse;
  }
  return null;
}

export async function GET() {
  const guard = await ensureAdmin();
  if (guard) {
    return guard;
  }

  try {
    const users = await listAdminUsers();
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch admin users:', error);
    return NextResponse.json({ error: 'Failed to fetch admin users.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const guard = await ensureAdmin();
  if (guard) {
    return guard;
  }

  const payload = await request.json().catch(() => null);
  const parsed = createAdminUserSchema.safeParse(payload);

  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    return NextResponse.json(
      { error: 'Validation failed.', fieldErrors },
      { status: 400 },
    );
  }

  try {
    const user = await createAdminUser(parsed.data);
    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create admin user.';
    const status = message === 'Email already exists.' ? 409 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}