'use client';

import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import BlogCard from './BlogCard';
import { BLOG_CATEGORIES, type BlogPost } from '@/lib/blog';

export default function BlogExplorer({ posts }: { posts: BlogPost[] }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string>('');

  const categories = useMemo(() => {
    const present = new Set(posts.map((p) => p.category));
    return Object.entries(BLOG_CATEGORIES).filter(([slug]) => present.has(slug));
  }, [posts]);

  const filtered = useMemo(() => {
    return posts.filter((p) => {
      if (category && p.category !== category) return false;
      if (query.trim()) {
        const q = query.trim().toLowerCase();
        return p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q) || p.tags.some((t) => t.toLowerCase().includes(q));
      }
      return true;
    });
  }, [posts, query, category]);

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-3 mb-10">
        <div className="relative flex-1">
          <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: '#8E8E8E' }} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Blog yazılarında ara..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl text-sm bg-white focus:outline-none"
            style={{ border: '1px solid #ECE8E2' }}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setCategory('')}
            className={`px-4 py-2 rounded-full text-xs font-semibold border transition-all ${category === '' ? 'bg-navy-700 text-white border-navy-700' : 'bg-white text-charcoal border-[#EDE9E4]'}`}
          >
            Tümü
          </button>
          {categories.map(([slug, label]) => (
            <button
              key={slug}
              onClick={() => setCategory(slug)}
              className={`px-4 py-2 rounded-full text-xs font-semibold border transition-all ${category === slug ? 'bg-navy-700 text-white border-navy-700' : 'bg-white text-charcoal border-[#EDE9E4]'}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="font-serif font-bold text-xl" style={{ color: '#163356' }}>Sonuç bulunamadı</p>
          <p className="text-sm mt-2" style={{ color: '#8E8E8E' }}>Farklı bir arama terimi veya kategori deneyin.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
