/**
 * lib/blog.ts — Blog için Prisma tabanlı veri katmanı
 */
import { Prisma } from '@prisma/client';
import { prisma } from './prisma';
import { readingTimeMinutes } from './seo';

export interface BlogFaqItem {
  question: string;
  answer: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string | null;
  category: string;
  tags: string[];
  authorName: string;
  seoTitle?: string | null;
  seoDescription?: string | null;
  featured: boolean;
  published: boolean;
  faq: BlogFaqItem[];
  sortOrder: number;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
  readingTime: number;
}

export const BLOG_CATEGORIES: Record<string, string> = {
  rehber: 'Satın Alma Rehberi',
  bakim: 'Bakım & Temizlik',
  'travel-sistem': 'Travel Sistem',
  ikiz: 'İkiz Bebek Arabası',
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toBlogPost(row: any): BlogPost {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt,
    content: row.content,
    coverImage: row.coverImage ?? undefined,
    category: row.category,
    tags: row.tags || [],
    authorName: row.authorName,
    seoTitle: row.seoTitle,
    seoDescription: row.seoDescription,
    featured: row.featured,
    published: row.published,
    faq: Array.isArray(row.faq) ? row.faq : [],
    sortOrder: row.sortOrder,
    publishedAt: row.publishedAt?.toISOString?.() || new Date().toISOString(),
    createdAt: row.createdAt?.toISOString?.() || new Date().toISOString(),
    updatedAt: row.updatedAt?.toISOString?.() || new Date().toISOString(),
    readingTime: readingTimeMinutes(row.content || ''),
  };
}

export async function getBlogPosts(opts: { includeDrafts?: boolean } = {}): Promise<BlogPost[]> {
  const rows = await prisma.blogPost.findMany({
    where: opts.includeDrafts ? {} : { published: true },
    orderBy: [{ sortOrder: 'asc' }, { publishedAt: 'desc' }],
  });
  return rows.map(toBlogPost);
}

export async function getBlogPost(idOrSlug: string, opts: { includeDrafts?: boolean } = {}): Promise<BlogPost | null> {
  const row = await prisma.blogPost.findFirst({
    where: {
      OR: [{ id: idOrSlug }, { slug: idOrSlug }],
      ...(opts.includeDrafts ? {} : { published: true }),
    },
  });
  return row ? toBlogPost(row) : null;
}

export async function getRelatedBlogPosts(post: BlogPost, limit = 3): Promise<BlogPost[]> {
  const rows = await prisma.blogPost.findMany({
    where: { published: true, category: post.category, slug: { not: post.slug } },
    orderBy: { publishedAt: 'desc' },
    take: limit,
  });
  return rows.map(toBlogPost);
}

function slugifyTr(s: string): string {
  return s
    .toLowerCase()
    .replace(/ı/g, 'i').replace(/ğ/g, 'g').replace(/ü/g, 'u')
    .replace(/ş/g, 's').replace(/ö/g, 'o').replace(/ç/g, 'c')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export interface BlogPostInput {
  title: string;
  slug?: string;
  excerpt: string;
  content: string;
  coverImage?: string | null;
  category?: string;
  tags?: string[];
  authorName?: string;
  seoTitle?: string;
  seoDescription?: string;
  featured?: boolean;
  published?: boolean;
  faq?: BlogFaqItem[];
  sortOrder?: number;
}

export async function createBlogPost(data: BlogPostInput): Promise<BlogPost> {
  const baseSlug = data.slug?.trim() || slugifyTr(data.title);
  let slug = baseSlug;
  let n = 2;
  while (await prisma.blogPost.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${n++}`;
  }

  const row = await prisma.blogPost.create({
    data: {
      title: data.title,
      slug,
      excerpt: data.excerpt,
      content: data.content,
      coverImage: data.coverImage ?? null,
      category: data.category || 'rehber',
      tags: data.tags || [],
      authorName: data.authorName || 'Bebek Arabacınız',
      seoTitle: data.seoTitle,
      seoDescription: data.seoDescription,
      featured: data.featured ?? false,
      published: data.published ?? true,
      faq: (data.faq ?? undefined) as unknown as Prisma.InputJsonValue | undefined,
      sortOrder: data.sortOrder ?? 0,
    },
  });
  return toBlogPost(row);
}

export async function updateBlogPost(id: string, data: Partial<BlogPostInput>): Promise<BlogPost> {
  const update: Record<string, unknown> = {};
  if (data.title !== undefined) update.title = data.title;
  if (data.slug !== undefined) update.slug = data.slug;
  if (data.excerpt !== undefined) update.excerpt = data.excerpt;
  if (data.content !== undefined) update.content = data.content;
  if (data.coverImage !== undefined) update.coverImage = data.coverImage;
  if (data.category !== undefined) update.category = data.category;
  if (data.tags !== undefined) update.tags = data.tags;
  if (data.authorName !== undefined) update.authorName = data.authorName;
  if (data.seoTitle !== undefined) update.seoTitle = data.seoTitle;
  if (data.seoDescription !== undefined) update.seoDescription = data.seoDescription;
  if (data.featured !== undefined) update.featured = data.featured;
  if (data.published !== undefined) update.published = data.published;
  if (data.faq !== undefined) update.faq = data.faq as unknown as Prisma.InputJsonValue;
  if (data.sortOrder !== undefined) update.sortOrder = data.sortOrder;

  const row = await prisma.blogPost.update({ where: { id }, data: update });
  return toBlogPost(row);
}

export async function deleteBlogPost(id: string): Promise<void> {
  await prisma.blogPost.delete({ where: { id } });
}
