import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { updateOrderStatus } from '@/lib/db';
import { orderStatusSchema } from '@/lib/validations';
import { sendStatusUpdateMail } from '@/lib/mail';

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });

  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: { include: { product: true } }, customer: true },
  });

  if (!order) return NextResponse.json({ error: 'Bulunamadı' }, { status: 404 });
  return NextResponse.json(order);
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });

  const { id } = await params;
  try {
    const body = await req.json();
    const parsed = orderStatusSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Geçersiz durum' }, { status: 400 });
    }

    await updateOrderStatus(id, parsed.data.status);

    // Durum maili gönder
    const order = await prisma.order.findUnique({
      where: { id },
      include: { customer: true },
    });

    if (order) {
      const email = order.customer?.email || order.guestEmail;
      const name = order.customer?.name || order.guestName || 'Müşteri';
      if (email && parsed.data.status !== 'PENDING') {
        sendStatusUpdateMail({
          orderNumber: order.orderNumber,
          customerEmail: email,
          customerName: name,
          status: parsed.data.status,
        }).catch(console.error);
      }
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });

  const { id } = await params;
  await prisma.order.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
