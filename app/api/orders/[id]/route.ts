import { NextResponse } from 'next/server';
import { updateOrderStatus } from '@/lib/db';
import { cookies } from 'next/headers';

const ADMIN_TOKEN = 'ba_admin_2025_secure';
const VALID_STATUSES = ['beklemede', 'onaylandi', 'kargoda', 'teslim_edildi', 'iptal'];

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session')?.value;
  if (session !== ADMIN_TOKEN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  try {
    const { status } = await request.json();
    if (!VALID_STATUSES.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }
    await updateOrderStatus(Number(id), status);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
