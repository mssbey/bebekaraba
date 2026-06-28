import { NextResponse } from 'next/server';
import { createOrder, getOrders } from '@/lib/db';
import { cookies } from 'next/headers';

const ADMIN_TOKEN = 'ba_admin_2025_secure';

export async function GET() {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session')?.value;
  if (session !== ADMIN_TOKEN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const orders = await getOrders();
    return NextResponse.json({ orders });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      customer_name,
      customer_email,
      customer_phone = '',
      customer_address,
      city = '',
      notes = '',
      items,
      total,
    } = body;

    if (!customer_name || !customer_email || !customer_address || !items?.length) {
      return NextResponse.json({ error: 'Eksik bilgi' }, { status: 400 });
    }

    const order_number = await createOrder({
      customer_name,
      customer_email,
      customer_phone,
      customer_address,
      city,
      notes,
      items,
      total,
    });

    return NextResponse.json({ success: true, order_number }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Server error';
    const status = message.includes('stok') ? 409 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
