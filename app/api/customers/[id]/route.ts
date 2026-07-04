import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { customerSchema } from '@/lib/validations';

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });

  const { id } = await params;
  const customer = await prisma.customer.findUnique({
    where: { id },
    include: {
      orders: { include: { items: true }, orderBy: { createdAt: 'desc' } },
      notes: { orderBy: { createdAt: 'desc' } },
    },
  });

  if (!customer) return NextResponse.json({ error: 'Bulunamadı' }, { status: 404 });
  return NextResponse.json(customer);
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });

  const { id } = await params;
  const body = await req.json();

  // Not ekleme
  if (body.action === 'addNote') {
    const note = await prisma.customerNote.create({
      data: { content: body.content, customerId: id },
    });
    return NextResponse.json(note);
  }

  const parsed = customerSchema.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Geçersiz veri' }, { status: 400 });
  }

  const data = parsed.data;
  const customer = await prisma.customer.update({
    where: { id },
    data: {
      name: data.name,
      email: data.email || null,
      phone: data.phone || null,
      city: data.city || null,
      address: data.address || null,
      tags: data.tags,
    },
  });

  return NextResponse.json(customer);
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });

  const { id } = await params;
  await prisma.customer.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
