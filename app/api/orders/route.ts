import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { createOrder, getOrders } from '@/lib/db';
import { checkoutSchema } from '@/lib/validations';
import { sendOrderConfirmation, sendNewOrderNotification } from '@/lib/mail';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });

  const orders = await getOrders();
  return NextResponse.json(orders);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = checkoutSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Geçersiz form verisi', details: parsed.error.flatten() }, { status: 400 });
    }

    const { customer_name, customer_email, customer_phone, customer_address, city, notes } = parsed.data;

    if (!body.items || !Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json({ error: 'Sepet boş' }, { status: 400 });
    }

    const orderNumber = await createOrder({
      customer_name,
      customer_email,
      customer_phone: customer_phone || '',
      customer_address,
      city,
      notes: notes || '',
      items: body.items,
      total: body.total,
    });

    // E-posta bildirimleri (hata olursa siparişi engelleme)
    const mailData = {
      orderNumber,
      customerName: customer_name,
      customerEmail: customer_email,
      items: body.items.map((i: { product_name: string; price: number; quantity: number }) => ({
        name: i.product_name,
        price: i.price,
        quantity: i.quantity,
      })),
      total: body.total,
      address: customer_address,
      city,
    };

    Promise.allSettled([
      sendOrderConfirmation(mailData),
      sendNewOrderNotification(mailData),
    ]).catch(console.error);

    return NextResponse.json({ success: true, orderNumber }, { status: 201 });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Sunucu hatası';
    console.error(e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
