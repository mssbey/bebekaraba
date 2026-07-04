'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Sparkles, Search as SeoIcon, Link2, ExternalLink } from 'lucide-react';

export interface ProductForm {
  id?: string;
  name: string; slug: string; description: string;
  price: number; stock: number; category: string; brand: string;
  featured: boolean; gradient: string; image?: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  'bebek-arabasi': 'Bebek Arabası', 'oto-koltugu': 'Oto Koltuğu', 'aksesuar': 'Aksesuar',
};
const GRADIENTS = ['grad-blue', 'grad-indigo', 'grad-purple', 'grad-pink', 'grad-dark', 'grad-teal', 'grad-navy', 'grad-green', 'grad-orange'];

const EMPTY: ProductForm = {
  name: '', slug: '', description: '', price: 0, stock: 1,
  category: 'bebek-arabasi', brand: 'Stokke', featured: false, gradient: 'grad-blue', image: '',
};

function seoScore(f: ProductForm) {
  let s = 0;
  if (f.name.length >= 8) s += 25;
  if (f.description.length >= 80) s += 30;
  if (f.slug.length >= 4) s += 15;
  if (f.image) s += 15;
  if (f.price > 0) s += 15;
  return s;
}

export default function ProductEditor({ open, initial, onClose, onSaved, notify }: {
  open: boolean;
  initial: ProductForm | null;
  onClose: () => void;
  onSaved: () => void;
  notify: (kind: 'success' | 'error', title: string, desc?: string) => void;
}) {
  const [form, setForm] = useState<ProductForm>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const baseline = useRef<string>('');

  useEffect(() => {
    if (open) {
      const f = initial ?? EMPTY;
      setForm(f);
      baseline.current = JSON.stringify(f);
      setDirty(false);
      setSavedAt(null);
    }
  }, [open, initial]);

  const set = <K extends keyof ProductForm>(k: K, v: ProductForm[K]) => {
    setForm(prev => {
      const next = { ...prev, [k]: v };
      setDirty(JSON.stringify(next) !== baseline.current);
      return next;
    });
  };

  const isNew = !initial?.id;
  const score = seoScore(form);

  const handleClose = () => {
    if (dirty && !confirm('Kaydedilmemiş değişiklikler var. Kapatılsın mı?')) return;
    onClose();
  };

  const save = async () => {
    if (!form.name.trim()) { notify('error', 'Ürün adı gerekli'); return; }
    setSaving(true);
    const url = isNew ? '/api/products' : `/api/products/${form.id}`;
    const res = await fetch(url, {
      method: isNew ? 'POST' : 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (res.ok) {
      baseline.current = JSON.stringify(form);
      setDirty(false);
      setSavedAt(new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }));
      notify('success', isNew ? 'Ürün eklendi' : 'Değişiklikler kaydedildi');
      onSaved();
      if (isNew) onClose();
    } else {
      notify('error', 'Kaydedilemedi', 'Lütfen tekrar deneyin');
    }
  };

  const genDesc = () => {
    set('description',
      `${form.name || 'Bu ürün'}, premium kalitesi ve özenli bakımıyla öne çıkıyor. ${CATEGORY_LABELS[form.category]} kategorisinde, ${form.brand} güvencesiyle sunulur. Az kullanılmış, temiz ve eksiksiz. Bebeğiniz için güvenli ve konforlu bir tercih.`);
    notify('success', 'Açıklama oluşturuldu', 'AI taslağı eklendi — düzenleyebilirsiniz');
  };

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="ad-surface-2 rounded-2xl border ad-border-c p-4">
      <p className="text-xs font-bold uppercase tracking-wider ad-muted mb-3">{title}</p>
      <div className="space-y-3">{children}</div>
    </div>
  );
  const Field = ({ label, children }: { label: React.ReactNode; children: React.ReactNode }) => (
    <div>
      <label className="block text-xs font-semibold ad-muted mb-1">{label}</label>
      {children}
    </div>
  );

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[120] flex justify-end">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={handleClose} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <motion.div
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 36 }}
            className="relative ad-surface w-full max-w-xl h-full flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 h-16 border-b ad-border-c flex-shrink-0">
              <div>
                <h2 className="font-bold" style={{ color: 'var(--ad-text)' }}>{isNew ? 'Yeni Ürün' : 'Ürünü Düzenle'}</h2>
                <p className="text-[11px] ad-muted">
                  {dirty ? 'Kaydedilmemiş değişiklikler' : savedAt ? `Kaydedildi · ${savedAt}` : 'Tüm alanları düzenleyin'}
                </p>
              </div>
              <button onClick={handleClose} className="w-9 h-9 rounded-xl ad-surface-2 border ad-border-c flex items-center justify-center ad-muted hover:text-brand-500">
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {/* Preview */}
              <div className="flex gap-4 items-center ad-surface-2 rounded-2xl border ad-border-c p-4">
                <div className={`w-16 h-16 rounded-xl ${form.gradient} flex-shrink-0 overflow-hidden`}>
                  {form.image && <img src={form.image} alt="" className="w-full h-full object-cover" />}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold truncate" style={{ color: 'var(--ad-text)' }}>{form.name || 'Ürün adı'}</p>
                  <p className="text-sm font-bold text-brand-500">₺{form.price.toLocaleString('tr-TR')}</p>
                </div>
                <div className="ml-auto text-center">
                  <div className="relative w-12 h-12">
                    <svg viewBox="0 0 36 36" className="w-12 h-12 -rotate-90">
                      <circle cx="18" cy="18" r="15" fill="none" stroke="currentColor" strokeWidth="3" className="ad-muted opacity-20" />
                      <circle cx="18" cy="18" r="15" fill="none" stroke={score >= 70 ? '#22C55E' : score >= 40 ? '#F59E0B' : '#EF4444'}
                        strokeWidth="3" strokeLinecap="round" strokeDasharray={`${(score / 100) * 94.2} 94.2`} />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-[11px] font-bold" style={{ color: 'var(--ad-text)' }}>{score}</span>
                  </div>
                  <p className="text-[9px] ad-muted mt-0.5">SEO</p>
                </div>
              </div>

              <Section title="Genel">
                <Field label="Ürün Adı *">
                  <input className="ad-input" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Stokke Travel Sistem" />
                </Field>
                <Field label="Slug (boş = otomatik)">
                  <div className="relative">
                    <Link2 size={15} className="absolute left-3 top-1/2 -translate-y-1/2 ad-muted" />
                    <input className="ad-input !pl-9" value={form.slug} onChange={e => set('slug', e.target.value)} placeholder="stokke-travel-sistem" />
                  </div>
                </Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Marka">
                    <input className="ad-input" value={form.brand} onChange={e => set('brand', e.target.value)} />
                  </Field>
                  <Field label="Kategori">
                    <select className="ad-input" value={form.category} onChange={e => set('category', e.target.value)}>
                      {Object.entries(CATEGORY_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                    </select>
                  </Field>
                </div>
                <Field label={
                  <span className="flex items-center justify-between">Açıklama
                    <button type="button" onClick={genDesc} className="flex items-center gap-1 text-[11px] font-semibold text-brand-500"><Sparkles size={12} /> AI ile oluştur</button>
                  </span>
                }>
                  <textarea rows={5} className="ad-input resize-none" value={form.description} onChange={e => set('description', e.target.value)} />
                </Field>
              </Section>

              <Section title="Fiyatlandırma & Stok">
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Fiyat (₺)">
                    <input type="number" className="ad-input" value={form.price} onChange={e => set('price', Number(e.target.value))} />
                  </Field>
                  <Field label="Stok Adedi">
                    <input type="number" min={0} className="ad-input" value={form.stock} onChange={e => set('stock', Number(e.target.value))} />
                  </Field>
                </div>
              </Section>

              <Section title="Görsel">
                <Field label="Görsel URL">
                  <input className="ad-input" value={form.image ?? ''} onChange={e => set('image', e.target.value)} placeholder="/products/1.jpeg" />
                </Field>
                <Field label="Renk Geçişi (görsel yoksa)">
                  <div className="flex flex-wrap gap-2">
                    {GRADIENTS.map(g => (
                      <button key={g} type="button" onClick={() => set('gradient', g)}
                        className={`w-9 h-9 rounded-lg ${g} transition-transform ${form.gradient === g ? 'ring-2 ring-brand-500 ring-offset-2 scale-105' : 'hover:scale-105'}`}
                        style={{ ['--tw-ring-offset-color' as string]: 'var(--ad-surface-2)' }} title={g} />
                    ))}
                  </div>
                </Field>
              </Section>

              <Section title="Durum & SEO">
                <Field label="Öne Çıkan Ürün">
                  <div className="flex gap-2">
                    {[{ v: true, l: 'Evet' }, { v: false, l: 'Hayır' }].map(o => (
                      <button key={String(o.v)} type="button" onClick={() => set('featured', o.v)}
                        className={`flex-1 py-2 rounded-xl text-sm font-medium border transition-colors ${form.featured === o.v ? 'bg-brand-500 text-white border-brand-500' : 'ad-surface border-[color:var(--ad-border)] ad-muted'}`}>
                        {o.l}
                      </button>
                    ))}
                  </div>
                </Field>
                <div className="flex items-center gap-2 text-xs ad-muted">
                  <SeoIcon size={13} /> SEO puanı: <span className="font-bold" style={{ color: 'var(--ad-text)' }}>{score}/100</span>
                </div>
              </Section>

              {!isNew && form.slug && (
                <a href={`/urun/${form.slug}`} target="_blank" className="flex items-center justify-center gap-2 text-sm font-medium text-brand-500 py-2">
                  <ExternalLink size={14} /> Canlı önizleme
                </a>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center gap-3 px-5 py-4 border-t ad-border-c flex-shrink-0">
              <button onClick={handleClose} className="ad-btn-ghost px-4 py-2.5 rounded-xl text-sm font-medium">İptal</button>
              <button onClick={save} disabled={saving || !form.name.trim()} className="ad-btn-accent flex-1 py-2.5 rounded-xl text-sm flex items-center justify-center gap-2">
                {saving ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : <><Save size={15} /> {isNew ? 'Ürünü Ekle' : 'Kaydet'}</>}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export { EMPTY as EMPTY_PRODUCT, CATEGORY_LABELS, GRADIENTS };
