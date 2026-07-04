import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getProduct, updateProduct, deleteProduct } from '@/lib/db';
import { productSchema } from '@/lib/validations';

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) return NextResponse.json({ error: 'Bulunamadı' }, { status: 404 });
  return NextResponse.json(product);
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });

  const { id } = await params;
  try {
    const body = await req.json();
    const parsed = productSchema.partial().safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Geçersiz veri', details: parsed.error.flatten() }, { status: 400 });
    }

    const data = parsed.data;
    const product = await updateProduct(id, {
      name: data.name,
      description: data.description,
      price: data.price,
      salePrice: data.salePrice ?? null,
      stock: data.stock,
      categoryId: data.categoryId,
      brand: data.brand,
      model: data.model,
      condition: data.condition,
      featured: data.featured,
      campaign: data.campaign,
      gradient: data.gradient,
      sort_order: data.sortOrder,
      image: data.image ?? undefined,
      seoTitle: data.seoTitle,
      seoDescription: data.seoDescription,
    });

    return NextResponse.json(product);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  return PUT(req, { params });
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });

  const { id } = await params;
  try {
    await deleteProduct(id);
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}
