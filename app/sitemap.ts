import type { MetadataRoute } from 'next';
import { getProducts } from '@/lib/db';
import { getBlogPosts } from '@/lib/blog';
import { getSiteUrl } from '@/lib/seo';

export const dynamic = 'force-dynamic';

const CATEGORY_SLUGS = ['bebek-arabasi', 'oto-koltugu', 'aksesuar'];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: 'daily', priority: 1 },
    { url: `${base}/urunler`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${base}/blog`, lastModified: now, changeFrequency: 'daily', priority: 0.8 },
    { url: `${base}/sepet`, lastModified: now, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${base}/giris`, lastModified: now, changeFrequency: 'yearly', priority: 0.2 },
  ];

  const categoryRoutes: MetadataRoute.Sitemap = CATEGORY_SLUGS.map((slug) => ({
    url: `${base}/urunler?kategori=${slug}`,
    lastModified: now,
    changeFrequency: 'daily',
    priority: 0.7,
  }));

  let productRoutes: MetadataRoute.Sitemap = [];
  try {
    const products = await getProducts();
    productRoutes = products.map((p) => ({
      url: `${base}/urun/${p.slug}`,
      lastModified: new Date(p.created_at),
      changeFrequency: 'weekly',
      priority: 0.8,
    }));
  } catch {
    productRoutes = [];
  }

  let blogRoutes: MetadataRoute.Sitemap = [];
  try {
    const posts = await getBlogPosts();
    blogRoutes = posts.map((p) => ({
      url: `${base}/blog/${p.slug}`,
      lastModified: new Date(p.updatedAt),
      changeFrequency: 'monthly',
      priority: 0.6,
    }));
  } catch {
    blogRoutes = [];
  }

  return [...staticRoutes, ...categoryRoutes, ...productRoutes, ...blogRoutes];
}
