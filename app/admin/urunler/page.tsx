'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { Reorder, motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Search, RefreshCw, Copy, Trash2, ExternalLink, GripVertical,
  X, Star, SlidersHorizontal, CheckSquare, Square, Pencil, Download, ChevronDown,
} from 'lucide-react';
import { useAdmin } from '@/components/admin/AdminProvider';
import ProductEditor, { type ProductForm, CATEGORY_LABELS } from '@/components/admin/ProductEditor';

interface Product {
  id: number; name: string; slug: string; price: number; stock: number;
  category: string; brand: string; featured: number; description: string;
  gradient: string; image?: string; sort_order: number;
}

type SortKey = 'manual' | 'price-asc' | 'price-desc' | 'stock' | 'name' | 'newest';

export default function AdminUrunlerPage() {
  const { toast } = useAdmin();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('all');
  const [stockF, setStockF] = useState('all');
  const [featF, setFeatF] = useState('all');
  const [sort, setSort] = useState<SortKey>('manual');
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [editorOpen, setEditorOpen] = useState(false);
  const [editing, setEditing] = useState<ProductForm | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const notify = useCallback((kind: 'success' | 'error', title: string, desc?: string) =>
    void toast({ kind, title, desc }), [toast]);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const res = await fetch('/api/products');
    const data = await res.json();
    setProducts(data.products ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  // open editor for new product via ?new=1
  useEffect(() => {
    if (typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('new') === '1') {
      setEditing(null); setEditorOpen(true);
      window.history.replaceState({}, '', '/admin/urunler');
    }
  }, []);

  const filtersActive = q.trim() !== '' || cat !== 'all' || stockF !== 'all' || featF !== 'all' || sort !== 'manual';
  const canDrag = !filtersActive;

  const visible = useMemo(() => {
    let list = [...products];
    if (q.trim()) {
      const s = q.toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(s) || p.brand.toLowerCase().includes(s) || p.slug.toLowerCase().includes(s));
    }
    if (cat !== 'all') list = list.filter(p => p.category === cat);
    if (stockF !== 'all') list = list.filter(p =>
      stockF === 'out' ? p.stock === 0 : stockF === 'low' ? p.stock > 0 && p.stock <= 1 : p.stock > 0);
    if (featF !== 'all') list = list.filter(p => (featF === 'yes' ? p.featured === 1 : p.featured === 0));
    switch (sort) {
      case 'price-asc': list.sort((a, b) => a.price - b.price); break;
      case 'price-desc': list.sort((a, b) => b.price - a.price); break;
      case 'stock': list.sort((a, b) => a.stock - b.stock); break;
      case 'name': list.sort((a, b) => a.name.localeCompare(b.name, 'tr')); break;
      case 'newest': list.sort((a, b) => b.id - a.id); break;
      default: list.sort((a, b) => a.sort_order - b.sort_order);
    }
    return list;
  }, [products, q, cat, stockF, featF, sort]);

  const allSelected = visible.length > 0 && visible.every(p => selected.has(p.id));
  const toggleSel = (id: number) => setSelected(prev => {
    const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n;
  });
  const toggleAll = () => setSelected(allSelected ? new Set() : new Set(visible.map(p => p.id)));
  const clearSel = () => setSelected(new Set());

  // persist drag order
  const onReorder = async (newOrder: Product[]) => {
    setProducts(newOrder.map((p, i) => ({ ...p, sort_order: i + 1 })));
    await Promise.all(newOrder.map((p, i) =>
      fetch(`/api/products/${p.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ sort_order: i + 1 }) })));
  };

  const patch = (id: number, body: Partial<Product>) =>
    fetch(`/api/products/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });

  const openEdit = (p: Product) => { setEditing(p); setEditorOpen(true); };
  const openNew = () => { setEditing(null); setEditorOpen(true); };

  const duplicate = async (p: Product) => {
    const { ...rest } = p;
    await fetch('/api/products', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...rest, id: undefined, name: `${p.name} (Kopya)`, slug: '' }),
    });
    await fetchProducts();
    notify('success', 'Ürün kopyalandı');
  };

  const remove = async (p: Product) => {
    if (!confirm(`"${p.name}" silinsin mi?`)) return;
    await fetch(`/api/products/${p.id}`, { method: 'DELETE' });
    setSelected(prev => { const n = new Set(prev); n.delete(p.id); return n; });
    await fetchProducts();
    notify('success', 'Ürün silindi');
  };

  // ── bulk actions ──
  const bulkPrice = async () => {
    const v = prompt('Yeni fiyat (₺) — seçili tüm ürünlere uygulanır:');
    if (v == null || isNaN(Number(v))) return;
    await Promise.all([...selected].map(id => patch(id, { price: Number(v) })));
    await fetchProducts(); notify('success', `${selected.size} ürün fiyatı güncellendi`);
  };
  const bulkStock = async () => {
    const v = prompt('Yeni stok adedi — seçili tüm ürünlere uygulanır:');
    if (v == null || isNaN(Number(v))) return;
    await Promise.all([...selected].map(id => patch(id, { stock: Number(v) })));
    await fetchProducts(); notify('success', `${selected.size} ürün stoğu güncellendi`);
  };
  const bulkCategory = async () => {
    const v = prompt('Yeni kategori (bebek-arabasi / oto-koltuğu / aksesuar):');
    if (!v || !CATEGORY_LABELS[v]) { notify('error', 'Geçersiz kategori'); return; }
    await Promise.all([...selected].map(id => patch(id, { category: v })));
    await fetchProducts(); notify('success', `${selected.size} ürün kategorisi güncellendi`);
  };
  const bulkDuplicate = async () => {
    const items = products.filter(p => selected.has(p.id));
    await Promise.all(items.map(p => fetch('/api/products', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...p, id: undefined, name: `${p.name} (Kopya)`, slug: '' }),
    })));
    clearSel(); await fetchProducts(); notify('success', `${items.length} ürün kopyalandı`);
  };
  const bulkDelete = async () => {
    if (!confirm(`${selected.size} ürün kalıcı olarak silinsin mi?`)) return;
    await Promise.all([...selected].map(id => fetch(`/api/products/${id}`, { method: 'DELETE' })));
    clearSel(); await fetchProducts(); notify('success', 'Seçili ürünler silindi');
  };

  const exportCsv = () => {
    const rows = [['id', 'name', 'slug', 'brand', 'category', 'price', 'stock', 'featured']];
    visible.forEach(p => rows.push([String(p.id), p.name, p.slug, p.brand, p.category, String(p.price), String(p.stock), String(p.featured)]));
    const csv = rows.map(r => r.map(c => `"${c.replace(/"/g, '""')}"`).join(',')).join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    const a = document.createElement('a'); a.href = url; a.download = 'urunler.csv'; a.click();
    URL.revokeObjectURL(url);
    notify('success', 'CSV dışa aktarıldı');
  };

  const Row = ({ p }: { p: Product }) => (
    <div className="flex items-center gap-3 px-3 sm:px-4 py-3">
      {canDrag && <GripVertical size={16} className="ad-muted cursor-grab active:cursor-grabbing flex-shrink-0 hidden sm:block" />}
      <button onClick={() => toggleSel(p.id)} className="flex-shrink-0 ad-muted hover:text-brand-500">
        {selected.has(p.id) ? <CheckSquare size={18} className="text-brand-500" /> : <Square size={18} />}
      </button>
      <div className={`w-11 h-11 rounded-xl ${p.gradient} flex-shrink-0 overflow-hidden`}>
        {p.image && <img src={p.image} alt="" className="w-full h-full object-cover" />}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <p className="font-semibold text-sm truncate" style={{ color: 'var(--ad-text)' }}>{p.name}</p>
          {p.featured === 1 && <Star size={13} className="text-amber-400 fill-amber-400 flex-shrink-0" />}
        </div>
        <p className="text-[11px] ad-muted">{p.brand} · {CATEGORY_LABELS[p.category] ?? p.category}</p>
      </div>
      <p className="font-bold text-sm w-24 text-right flex-shrink-0 hidden sm:block" style={{ color: 'var(--ad-text)' }}>₺{p.price.toLocaleString('tr-TR')}</p>
      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0 w-20 text-center ${p.stock === 0 ? 'bg-red-500/10 text-red-500' : p.stock <= 1 ? 'bg-amber-500/10 text-amber-600' : 'bg-green-500/10 text-green-600'}`}>
        {p.stock === 0 ? 'Tükendi' : `${p.stock} var`}
      </span>
      <div className="flex items-center gap-1 flex-shrink-0">
        <button onClick={() => openEdit(p)} className="w-8 h-8 rounded-lg ad-surface-2 border ad-border-c flex items-center justify-center ad-muted hover:text-brand-500" title="Düzenle"><Pencil size={14} /></button>
        <button onClick={() => duplicate(p)} className="w-8 h-8 rounded-lg ad-surface-2 border ad-border-c flex items-center justify-center ad-muted hover:text-brand-500 hidden sm:flex" title="Kopyala"><Copy size={14} /></button>
        <Link href={`/urun/${p.slug}`} target="_blank" className="w-8 h-8 rounded-lg ad-surface-2 border ad-border-c flex items-center justify-center ad-muted hover:text-brand-500 hidden sm:flex" title="Görüntüle"><ExternalLink size={14} /></Link>
        <button onClick={() => remove(p)} className="w-8 h-8 rounded-lg ad-surface-2 border ad-border-c flex items-center justify-center ad-muted hover:text-red-500" title="Sil"><Trash2 size={14} /></button>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="ad-card p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 ad-muted" />
            <input value={q} onChange={e => setQ(e.target.value)} placeholder="Ürün, marka veya slug ara..." className="ad-input !pl-9" />
          </div>
          <button onClick={() => setShowFilters(v => !v)} className="ad-btn-ghost h-10 px-3 rounded-xl text-sm flex items-center gap-2">
            <SlidersHorizontal size={15} /> Filtreler <ChevronDown size={14} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
          <button onClick={exportCsv} className="ad-btn-ghost h-10 px-3 rounded-xl text-sm flex items-center gap-2"><Download size={15} /> <span className="hidden sm:inline">Dışa Aktar</span></button>
          <button onClick={fetchProducts} className="ad-btn-ghost h-10 w-10 rounded-xl flex items-center justify-center"><RefreshCw size={15} /></button>
          <button onClick={openNew} className="ad-btn-accent h-10 px-4 rounded-xl text-sm flex items-center gap-2"><Plus size={16} /> Yeni Ürün</button>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
                {[
                  { v: cat, set: setCat, opts: [['all', 'Tüm Kategoriler'], ...Object.entries(CATEGORY_LABELS)] },
                  { v: stockF, set: setStockF, opts: [['all', 'Tüm Stoklar'], ['instock', 'Stokta'], ['low', 'Az Stok'], ['out', 'Tükendi']] },
                  { v: featF, set: setFeatF, opts: [['all', 'Tümü'], ['yes', 'Öne Çıkan'], ['no', 'Normal']] },
                  { v: sort, set: (x: string) => setSort(x as SortKey), opts: [['manual', 'Manuel Sıra'], ['newest', 'En Yeni'], ['price-asc', 'Fiyat ↑'], ['price-desc', 'Fiyat ↓'], ['stock', 'Stok ↑'], ['name', 'İsim A-Z']] },
                ].map((f, i) => (
                  <select key={i} value={f.v} onChange={e => f.set(e.target.value)} className="ad-input">
                    {f.opts.map(([val, label]) => <option key={val} value={val}>{label}</option>)}
                  </select>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bulk bar */}
      <AnimatePresence>
        {selected.size > 0 && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="ad-glass rounded-2xl p-3 flex flex-wrap items-center gap-2 sticky top-20 z-20">
            <span className="text-sm font-semibold px-2" style={{ color: 'var(--ad-text)' }}>{selected.size} seçili</span>
            <div className="h-5 w-px bg-[color:var(--ad-border)] mx-1" />
            <button onClick={bulkPrice} className="ad-btn-ghost px-3 py-1.5 rounded-lg text-xs font-medium">Fiyat Güncelle</button>
            <button onClick={bulkStock} className="ad-btn-ghost px-3 py-1.5 rounded-lg text-xs font-medium">Stok Güncelle</button>
            <button onClick={bulkCategory} className="ad-btn-ghost px-3 py-1.5 rounded-lg text-xs font-medium">Kategori Değiştir</button>
            <button onClick={bulkDuplicate} className="ad-btn-ghost px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1"><Copy size={13} /> Kopyala</button>
            <button onClick={bulkDelete} className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-500/10 text-red-500 hover:bg-red-500/20 flex items-center gap-1"><Trash2 size={13} /> Sil</button>
            <button onClick={clearSel} className="ml-auto ad-muted hover:text-brand-500 flex items-center gap-1 text-xs"><X size={14} /> Temizle</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grid */}
      <div className="ad-card overflow-hidden">
        <div className="flex items-center gap-3 px-3 sm:px-4 py-3 border-b ad-border-c text-[11px] font-bold uppercase tracking-wider ad-muted">
          <button onClick={toggleAll} className="ad-muted hover:text-brand-500">{allSelected ? <CheckSquare size={18} className="text-brand-500" /> : <Square size={18} />}</button>
          <span className="flex-1">Ürün ({visible.length})</span>
          {canDrag && <span className="hidden sm:block text-[10px] normal-case font-medium">↕ sürükle-bırak ile sırala</span>}
        </div>

        {loading ? (
          <div className="divide-y ad-border-c">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3">
                <div className="ad-skeleton w-11 h-11 rounded-xl" />
                <div className="flex-1 space-y-2"><div className="ad-skeleton h-3 w-1/3 rounded" /><div className="ad-skeleton h-2.5 w-1/4 rounded" /></div>
                <div className="ad-skeleton h-6 w-20 rounded-full" />
              </div>
            ))}
          </div>
        ) : visible.length === 0 ? (
          <div className="text-center py-16 ad-muted">
            <Search size={36} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">Ürün bulunamadı</p>
          </div>
        ) : canDrag ? (
          <Reorder.Group axis="y" values={visible} onReorder={onReorder} className="divide-y ad-border-c">
            {visible.map(p => (
              <Reorder.Item key={p.id} value={p} className="ad-surface hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors">
                <Row p={p} />
              </Reorder.Item>
            ))}
          </Reorder.Group>
        ) : (
          <div className="divide-y ad-border-c">
            {visible.map(p => (
              <div key={p.id} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors"><Row p={p} /></div>
            ))}
          </div>
        )}
      </div>

      <ProductEditor open={editorOpen} initial={editing} onClose={() => setEditorOpen(false)} onSaved={fetchProducts} notify={notify} />
    </div>
  );
}
