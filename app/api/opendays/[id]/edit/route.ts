// API endpoint for updating an openday
import { NextRequest, NextResponse } from 'next/server';
import { updateOpenday } from '@/app/lib/actions';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const data = await req.json();
  try {
    const updated = await updateOpenday({ ...data, id: params.id });
    return NextResponse.json({ success: true, openday: updated });
  } catch (e) {
    return NextResponse.json({ success: false, error: e.message }, { status: 400 });
  }
}
