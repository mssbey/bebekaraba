import type { Metadata } from 'next';
import { getBlogPosts } from '@/lib/blog';
import { buildMetadata } from '@/lib/seo';
import { breadcrumbSchema } from '@/lib/schema';
import BlogCard from '@/components/BlogCard';
import BlogExplorer from '@/components/BlogExplorer';

export const revalidate = 3600;

export function generateMetadata(): Metadata {
  return buildMetadata({
    title: 'Blog — Bebek Arabası Rehberleri',
    description: 'Bebek arabası seçimi, travel sistem, kabin boy modeller, bakım ve temizlik üzerine özgün, uzman rehberler.',
    path: '/blog',
  });
}

export default async function BlogPage() {
  const posts = await getBlogPosts();
  const featured = posts.filter((p) => p.featured).slice(0, 3);
  const schema = breadcrumbSchema([
    { name: 'Ana Sayfa', path: '/' },
    { name: 'Blog', path: '/blog' },
  ]);

  return (
    <div className="bg-cream min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <div className="bg-white border-b border-[#EDE9E4] pt-24 pb-12">
        <div className="container mx-auto px-4 sm:px-6">
          <p className="text-xs font-bold uppercase tracking-widest text-orange-500 mb-2">Blog</p>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-navy-900 mb-3">Bebek Arabası Rehberleri</h1>
          <p className="text-charcoal/55 max-w-2xl text-sm sm:text-base">
            Doğru seçim yapmanız için hazırladığımız özgün rehberler: satın alma kriterleri, travel sistem, kabin boy modeller,
            ikiz bebek arabaları ve bakım önerileri.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-12">
        {featured.length > 0 && (
          <section className="mb-16">
            <p className="text-xs font-bold uppercase tracking-widest text-orange-500 mb-2">Öne Çıkanlar</p>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-navy-900 mb-8">Editörün Seçimi</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured.map((post, i) => (
                <BlogCard key={post.id} post={post} priority={i === 0} />
              ))}
            </div>
          </section>
        )}

        <section>
          <p className="text-xs font-bold uppercase tracking-widest text-orange-500 mb-2">Tüm Yazılar</p>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-navy-900 mb-8">Son Yazılar</h2>
          <BlogExplorer posts={posts} />
        </section>
      </div>
    </div>
  );
}
