import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Clock, ChevronRight, ArrowRight } from 'lucide-react';
import { getBlogPost, getBlogPosts, getRelatedBlogPosts, BLOG_CATEGORIES } from '@/lib/blog';
import { buildMetadata } from '@/lib/seo';
import { articleSchema, breadcrumbSchema, faqSchema } from '@/lib/schema';
import BlogContent from '@/components/BlogContent';
import BlogCard from '@/components/BlogCard';

export const revalidate = 3600;

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

function formatDate(iso: string) {
  return new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(iso));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) return buildMetadata({ title: 'Yazı Bulunamadı', description: 'Aradığınız blog yazısı bulunamadı.', noindex: true });

  return buildMetadata({
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt,
    path: `/blog/${post.slug}`,
    image: post.coverImage || undefined,
    keywords: post.tags,
    type: 'article',
  });
}

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) notFound();

  const related = await getRelatedBlogPosts(post, 3);
  const schemas = [
    articleSchema({ ...post, description: post.seoDescription || post.excerpt }),
    breadcrumbSchema([
      { name: 'Ana Sayfa', path: '/' },
      { name: 'Blog', path: '/blog' },
      { name: post.title, path: `/blog/${post.slug}` },
    ]),
    ...(post.faq.length > 0 ? [faqSchema(post.faq)] : []),
  ];

  return (
    <div style={{ background: '#FAF8F4', minHeight: '100vh' }}>
      {schemas.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}

      <div className="pt-24 pb-0">
        <div className="max-w-3xl mx-auto px-6 sm:px-8">
          <nav className="flex items-center gap-2 text-xs font-medium mb-6" style={{ color: '#8E8E8E' }}>
            <Link href="/" className="hover:text-[#163356] transition-colors">Ana Sayfa</Link>
            <ChevronRight size={12} />
            <Link href="/blog" className="hover:text-[#163356] transition-colors">Blog</Link>
            <ChevronRight size={12} />
            <span style={{ color: '#163356' }} className="truncate max-w-xs">{post.title}</span>
          </nav>

          <span className="inline-flex items-center bg-[#163356] text-white text-[10px] font-bold tracking-wider uppercase px-3 py-1.5 rounded-full mb-5">
            {BLOG_CATEGORIES[post.category] ?? post.category}
          </span>

          <h1 className="font-serif font-bold leading-tight mb-5" style={{ fontSize: 'clamp(28px, 4vw, 44px)', color: '#163356' }}>
            {post.title}
          </h1>

          <div className="flex items-center gap-3 text-xs mb-8" style={{ color: '#8E8E8E' }}>
            <span>{post.authorName}</span>
            <span aria-hidden="true">·</span>
            <span>{formatDate(post.publishedAt)}</span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1"><Clock size={12} /> {post.readingTime} dk okuma</span>
          </div>
        </div>
      </div>

      {post.coverImage && (
        <div className="max-w-4xl mx-auto px-6 sm:px-8 mb-12">
          <div className="relative overflow-hidden" style={{ borderRadius: 32, aspectRatio: '16/8' }}>
            <Image src={post.coverImage} alt={post.title} fill priority sizes="(max-width: 1024px) 100vw, 1024px" className="object-cover" />
          </div>
        </div>
      )}

      <div className="max-w-3xl mx-auto px-6 sm:px-8 pb-20">
        <BlogContent content={post.content} />

        {post.faq.length > 0 && (
          <div className="mt-16">
            <h2 className="font-serif font-bold text-2xl sm:text-3xl mb-6" style={{ color: '#163356' }}>Sık Sorulan Sorular</h2>
            <div className="flex flex-col gap-4">
              {post.faq.map((item) => (
                <div key={item.question} className="p-6 rounded-2xl" style={{ background: 'white', border: '1px solid #ECE8E2' }}>
                  <p className="font-bold mb-2 text-sm" style={{ color: '#163356' }}>{item.question}</p>
                  <p className="text-sm leading-relaxed" style={{ color: '#8E8E8E' }}>{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-16 rounded-[32px] overflow-hidden relative" style={{ background: 'linear-gradient(135deg, #0A1E35 0%, #163356 60%, #1F4A7A 100%)', padding: '48px 40px' }}>
          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-serif font-bold text-2xl mb-2 text-white">Doğru Ürünü Bulmaya Hazır mısınız?</h3>
              <p className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>Uzman kontrolünden geçmiş premium ikinci el ürünleri keşfedin.</p>
            </div>
            <Link href="/urunler" className="flex items-center gap-2 font-bold text-white px-6 py-3 rounded-2xl shrink-0" style={{ background: 'linear-gradient(135deg, #F47A3C, #D4571F)' }}>
              Ürünleri Gör <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div className="max-w-6xl mx-auto px-6 sm:px-8 pb-24">
          <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#F47A3C' }}>İlginizi Çekebilir</p>
          <h2 className="font-serif font-bold text-2xl sm:text-3xl mb-8" style={{ color: '#163356' }}>İlgili Yazılar</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {related.map((p) => (
              <BlogCard key={p.id} post={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
