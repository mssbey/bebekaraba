import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getProducts, createProduct, slugify } from '@/lib/db';
import { productSchema } from '@/lib/validations';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const products = await getProducts();
    return NextResponse.json(products);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });

  try {
    const body = await req.json();
    const parsed = productSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Geçersiz veri', details: parsed.error.flatten() }, { status: 400 });
    }

    const data = parsed.data;
    const product = await createProduct({
      name: data.name,
      slug: data.slug || slugify(data.name),
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

    return NextResponse.json(product, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}
