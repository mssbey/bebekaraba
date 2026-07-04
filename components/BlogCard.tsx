import Link from 'next/link';
import Image from 'next/image';
import { Clock, ArrowRight } from 'lucide-react';
import { BLOG_CATEGORIES, type BlogPost } from '@/lib/blog';

function formatDate(iso: string) {
  return new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(iso));
}

export default function BlogCard({ post, priority = false }: { post: BlogPost; priority?: boolean }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block overflow-hidden bg-white transition-shadow duration-300 hover:shadow-[0_32px_80px_rgba(22,51,86,0.14)]"
      style={{ borderRadius: 28, border: '1px solid #ECE8E2', boxShadow: '0 2px 20px rgba(22,51,86,0.06)' }}
    >
      <div className="relative overflow-hidden" style={{ aspectRatio: '16/10', background: 'radial-gradient(ellipse at 60% 40%, #F9F6F0 0%, #F0EBE2 60%, #E8E1D5 100%)' }}>
        {post.coverImage && (
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            priority={priority}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
        <div className="absolute top-4 left-4">
          <span className="inline-flex items-center bg-[#163356] text-white text-[10px] font-bold tracking-wider uppercase px-3 py-1.5 rounded-full">
            {BLOG_CATEGORIES[post.category] ?? post.category}
          </span>
        </div>
      </div>
      <div className="p-6 flex flex-col gap-3">
        <p className="flex items-center gap-2 text-[11px]" style={{ color: '#8E8E8E' }}>
          <span>{formatDate(post.publishedAt)}</span>
          <span aria-hidden="true">·</span>
          <span className="flex items-center gap-1"><Clock size={11} /> {post.readingTime} dk okuma</span>
        </p>
        <h3 className="font-serif font-bold leading-snug line-clamp-2 group-hover:text-[#F47A3C] transition-colors" style={{ fontSize: 19, color: '#163356' }}>
          {post.title}
        </h3>
        <p className="text-sm leading-relaxed line-clamp-2" style={{ color: '#6B7280' }}>{post.excerpt}</p>
        <span className="flex items-center gap-1.5 text-sm font-semibold mt-1" style={{ color: '#163356' }}>
          Devamını Oku <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </span>
      </div>
    </Link>
  );
}
