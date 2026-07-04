'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Search, RefreshCw, Trash2, ExternalLink, Pencil, Star, Eye, EyeOff,
} from 'lucide-react';
import { useAdmin } from '@/components/admin/AdminProvider';
import BlogEditor, { type BlogForm } from '@/components/admin/BlogEditor';
import { BLOG_CATEGORIES } from '@/lib/blog';

interface BlogPostRow {
  id: string; title: string; slug: string; excerpt: string; content: string;
  coverImage?: string; category: string; tags: string[];
  seoTitle?: string; seoDescription?: string;
  featured: boolean; published: boolean;
  faq: { question: string; answer: string }[];
  publishedAt: string; readingTime: number;
}

export default function AdminBlogPage() {
  const { toast } = useAdmin();
  const [posts, setPosts] = useState<BlogPostRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('all');
  const [editorOpen, setEditorOpen] = useState(false);
  const [editing, setEditing] = useState<BlogForm | null>(null);

  const notify = useCallback((kind: 'success' | 'error', title: string, desc?: string) =>
    void toast({ kind, title, desc }), [toast]);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    const res = await fetch('/api/blog');
    const data = await res.json();
    setPosts(Array.isArray(data) ? data : []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  const visible = useMemo(() => {
    let list = [...posts];
    if (q.trim()) {
      const s = q.toLowerCase();
      list = list.filter(p => p.title.toLowerCase().includes(s) || p.slug.toLowerCase().includes(s));
    }
    if (cat !== 'all') list = list.filter(p => p.category === cat);
    return list;
  }, [posts, q, cat]);

  const patch = (id: string, body: object) =>
    fetch(`/api/blog/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });

  const openEdit = (p: BlogPostRow) => {
    setEditing({
      id: p.id, title: p.title, slug: p.slug, excerpt: p.excerpt, content: p.content,
      coverImage: p.coverImage || '', category: p.category, tags: p.tags,
      seoTitle: p.seoTitle || '', seoDescription: p.seoDescription || '',
      featured: p.featured, published: p.published, faq: p.faq || [],
    });
    setEditorOpen(true);
  };
  const openNew = () => { setEditing(null); setEditorOpen(true); };

  const togglePublish = async (p: BlogPostRow) => {
    await patch(p.id, { published: !p.published });
    await fetchPosts();
    notify('success', p.published ? 'Taslağa alındı' : 'Yayınlandı');
  };

  const remove = async (p: BlogPostRow) => {
    if (!confirm(`"${p.title}" silinsin mi?`)) return;
    await fetch(`/api/blog/${p.id}`, { method: 'DELETE' });
    await fetchPosts();
    notify('success', 'Yazı silindi');
  };

  return (
    <div className="space-y-4">
      <div className="ad-card p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 ad-muted" />
            <input value={q} onChange={e => setQ(e.target.value)} placeholder="Yazı ara..." className="ad-input !pl-9" />
          </div>
          <select value={cat} onChange={e => setCat(e.target.value)} className="ad-input w-auto">
            <option value="all">Tüm Kategoriler</option>
            {Object.entries(BLOG_CATEGORIES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
          <button onClick={fetchPosts} className="ad-btn-ghost h-10 w-10 rounded-xl flex items-center justify-center"><RefreshCw size={15} /></button>
          <button onClick={openNew} className="ad-btn-accent h-10 px-4 rounded-xl text-sm flex items-center gap-2"><Plus size={16} /> Yeni Yazı</button>
        </div>
      </div>

      <div className="ad-card overflow-hidden">
        <div className="flex items-center gap-3 px-3 sm:px-4 py-3 border-b ad-border-c text-[11px] font-bold uppercase tracking-wider ad-muted">
          <span className="flex-1">Yazı ({visible.length})</span>
        </div>

        {loading ? (
          <div className="divide-y ad-border-c">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3">
                <div className="ad-skeleton w-11 h-11 rounded-xl" />
                <div className="flex-1 space-y-2"><div className="ad-skeleton h-3 w-1/3 rounded" /><div className="ad-skeleton h-2.5 w-1/4 rounded" /></div>
              </div>
            ))}
          </div>
        ) : visible.length === 0 ? (
          <div className="text-center py-16 ad-muted">
            <Search size={36} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">Yazı bulunamadı</p>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            <div className="divide-y ad-border-c">
              {visible.map(p => (
                <motion.div key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="flex items-center gap-3 px-3 sm:px-4 py-3 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors">
                  <div className="w-11 h-11 rounded-xl bg-black/10 flex-shrink-0 overflow-hidden">
                    {p.coverImage && <img src={p.coverImage} alt="" className="w-full h-full object-cover" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <p className="font-semibold text-sm truncate" style={{ color: 'var(--ad-text)' }}>{p.title}</p>
                      {p.featured && <Star size={13} className="text-amber-400 fill-amber-400 flex-shrink-0" />}
                    </div>
                    <p className="text-[11px] ad-muted">{BLOG_CATEGORIES[p.category] ?? p.category} · {p.readingTime} dk okuma</p>
                  </div>
                  <button onClick={() => togglePublish(p)}
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0 flex items-center gap-1 ${p.published ? 'bg-green-500/10 text-green-600' : 'bg-amber-500/10 text-amber-600'}`}>
                    {p.published ? <Eye size={12} /> : <EyeOff size={12} />} {p.published ? 'Yayında' : 'Taslak'}
                  </button>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button onClick={() => openEdit(p)} className="w-8 h-8 rounded-lg ad-surface-2 border ad-border-c flex items-center justify-center ad-muted hover:text-brand-500" title="Düzenle"><Pencil size={14} /></button>
                    <Link href={`/blog/${p.slug}`} target="_blank" className="w-8 h-8 rounded-lg ad-surface-2 border ad-border-c flex items-center justify-center ad-muted hover:text-brand-500 hidden sm:flex" title="Görüntüle"><ExternalLink size={14} /></Link>
                    <button onClick={() => remove(p)} className="w-8 h-8 rounded-lg ad-surface-2 border ad-border-c flex items-center justify-center ad-muted hover:text-red-500" title="Sil"><Trash2 size={14} /></button>
                  </div>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        )}
      </div>

      <BlogEditor open={editorOpen} initial={editing} onClose={() => setEditorOpen(false)} onSaved={fetchPosts} notify={notify} />
    </div>
  );
}
