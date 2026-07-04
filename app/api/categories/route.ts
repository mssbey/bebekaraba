import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { categorySchema } from '@/lib/validations';

export const dynamic = 'force-dynamic';

export async function GET() {
  const categories = await prisma.category.findMany({ orderBy: { sortOrder: 'asc' } });
  return NextResponse.json(categories);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });

  const body = await req.json();
  const parsed = categorySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Geçersiz veri', details: parsed.error.flatten() }, { status: 400 });
  }

  const existing = await prisma.category.findUnique({ where: { slug: parsed.data.slug } });
  if (existing) return NextResponse.json({ error: 'Bu slug zaten kullanılıyor' }, { status: 409 });

  const category = await prisma.category.create({ data: parsed.data });
  return NextResponse.json(category, { status: 201 });
}

export async function PUT(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });

  const body = await req.json();
  if (!body.id) return NextResponse.json({ error: 'ID gerekli' }, { status: 400 });

  const parsed = categorySchema.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Geçersiz veri' }, { status: 400 });
  }

  const category = await prisma.category.update({ where: { id: body.id }, data: parsed.data });
  return NextResponse.json(category);
}

export async function DELETE(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });

  const { id } = await req.json();
  const count = await prisma.product.count({ where: { categoryId: id } });
  if (count > 0) return NextResponse.json({ error: `Bu kategoride ${count} ürün var. Önce ürünleri taşıyın.` }, { status: 409 });

  await prisma.category.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
