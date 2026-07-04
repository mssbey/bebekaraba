import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProduct } from '@/lib/db';
import { buildMetadata } from '@/lib/seo';
import { breadcrumbSchema, productSchema } from '@/lib/schema';
import ProductDetailClient from './ProductDetailClient';

export const dynamic = 'force-dynamic';

function getCategoryLabel(c: string) {
  if (c === 'oto-koltugu') return 'Oto Koltuğu';
  if (c === 'aksesuar') return 'Aksesuar';
  return 'Bebek Arabası';
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) {
    return buildMetadata({ title: 'Ürün Bulunamadı', description: 'Aradığınız ürün bulunamadı.', noindex: true });
  }

  return buildMetadata({
    title: product.seoTitle || `${product.name} — ${getCategoryLabel(product.category)}`,
    description: product.seoDescription || product.description.slice(0, 160) || `${product.name} — Bebek Arabacınız'da premium ikinci el.`,
    path: `/urun/${product.slug}`,
    image: product.image || undefined,
    type: 'article',
  });
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const schemas = [
    productSchema({
      name: product.name,
      description: product.description,
      image: product.image,
      slug: product.slug,
      price: product.salePrice ?? product.price,
      stock: product.stock,
      brand: product.brand,
    }),
    breadcrumbSchema([
      { name: 'Ana Sayfa', path: '/' },
      { name: 'Ürünler', path: '/urunler' },
      { name: product.name, path: `/urun/${product.slug}` },
    ]),
  ];

  return (
    <>
      {schemas.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
      <ProductDetailClient slug={slug} />
    </>
  );
}
