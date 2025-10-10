import { NextResponse } from 'next/server';
import type { Session } from 'next-auth';

import { auth } from '@/auth';
import {
  deleteAdminUser,
  getAdminUser,
  updateAdminUser,
  updateAdminUserSchema,
} from '@/app/lib/users';

const unauthorizedResponse = NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

type AdminSession = {
  session: Session;
  user: Session['user'] & { admin?: boolean; id?: string };
};

async function ensureAdmin(): Promise<{ response: NextResponse | null } & Partial<AdminSession>> {
  const session = await auth();
  if (!session) {
    return { response: unauthorizedResponse };
  }

  const user = session.user as Session['user'] & { admin?: boolean; id?: string };

  if (!user?.admin) {
    return { response: unauthorizedResponse };
  }

  return { response: null, session, user };
}

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { response, user } = await ensureAdmin();
  if (response) {
    return response;
  }

  try {
    const adminUser = await getAdminUser(id);
    if (!adminUser) {
      return NextResponse.json({ error: 'Admin user not found.' }, { status: 404 });
    }
    return NextResponse.json(adminUser, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch admin user:', error, { id: id, requester: user?.id });
    return NextResponse.json({ error: 'Failed to fetch admin user.' }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { response, user } = await ensureAdmin();
  if (response || !user) {
    return response ?? unauthorizedResponse;
  }

  const payload = await request.json().catch(() => null);
  const parsed = updateAdminUserSchema.safeParse(payload);

  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    return NextResponse.json(
      { error: 'Validation failed.', fieldErrors },
      { status: 400 },
    );
  }

  if (parsed.data.admin === false && user.id === id) {
    return NextResponse.json({ error: 'You cannot remove your own admin access.' }, { status: 400 });
  }

  try {
    const adminUser = await updateAdminUser(id, parsed.data);
    return NextResponse.json(adminUser, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update admin user.';
    const status = message === 'Email already exists.' ? 409 : message === 'Admin user not found.' ? 404 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { response, user } = await ensureAdmin();
  if (response || !user) {
    return response ?? unauthorizedResponse;
  }

  if (user.id === id) {
    return NextResponse.json({ error: 'You cannot delete your own account.' }, { status: 400 });
  }

  try {
    await deleteAdminUser(id);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete admin user.';
    const status = message === 'Admin user not found.' ? 404 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}