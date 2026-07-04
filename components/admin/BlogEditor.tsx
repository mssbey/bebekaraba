'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Search as SeoIcon, Link2, ExternalLink, Plus, Trash2 } from 'lucide-react';
import { BLOG_CATEGORIES } from '@/lib/blog';

export interface BlogFaqField { question: string; answer: string; }

export interface BlogForm {
  id?: string;
  title: string; slug: string; excerpt: string; content: string;
  coverImage: string; category: string; tags: string[];
  seoTitle: string; seoDescription: string;
  featured: boolean; published: boolean;
  faq: BlogFaqField[];
}

const EMPTY: BlogForm = {
  title: '', slug: '', excerpt: '', content: '', coverImage: '',
  category: 'rehber', tags: [], seoTitle: '', seoDescription: '',
  featured: false, published: true, faq: [],
};

function seoScore(f: BlogForm) {
  let s = 0;
  if (f.title.length >= 10) s += 20;
  if (f.excerpt.length >= 40) s += 20;
  if (f.content.length >= 400) s += 25;
  if (f.coverImage) s += 15;
  if (f.seoTitle) s += 10;
  if (f.seoDescription) s += 10;
  return s;
}

export default function BlogEditor({ open, initial, onClose, onSaved, notify }: {
  open: boolean;
  initial: BlogForm | null;
  onClose: () => void;
  onSaved: () => void;
  notify: (kind: 'success' | 'error', title: string, desc?: string) => void;
}) {
  const [form, setForm] = useState<BlogForm>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const baseline = useRef<string>('');

  useEffect(() => {
    if (open) {
      const f = initial ?? EMPTY;
      setForm(f);
      baseline.current = JSON.stringify(f);
      setDirty(false);
      setTagInput('');
    }
  }, [open, initial]);

  const set = <K extends keyof BlogForm>(k: K, v: BlogForm[K]) => {
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
    if (!form.title.trim() || !form.excerpt.trim() || !form.content.trim()) {
      notify('error', 'Başlık, özet ve içerik gerekli');
      return;
    }
    setSaving(true);
    const url = isNew ? '/api/blog' : `/api/blog/${form.id}`;
    const res = await fetch(url, {
      method: isNew ? 'POST' : 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (res.ok) {
      baseline.current = JSON.stringify(form);
      setDirty(false);
      notify('success', isNew ? 'Yazı eklendi' : 'Değişiklikler kaydedildi');
      onSaved();
      if (isNew) onClose();
    } else {
      notify('error', 'Kaydedilemedi', 'Lütfen tekrar deneyin');
    }
  };

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !form.tags.includes(t)) set('tags', [...form.tags, t]);
    setTagInput('');
  };
  const removeTag = (t: string) => set('tags', form.tags.filter(x => x !== t));

  const addFaq = () => set('faq', [...form.faq, { question: '', answer: '' }]);
  const updateFaq = (i: number, key: keyof BlogFaqField, v: string) =>
    set('faq', form.faq.map((f, idx) => (idx === i ? { ...f, [key]: v } : f)));
  const removeFaq = (i: number) => set('faq', form.faq.filter((_, idx) => idx !== i));

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
            className="relative ad-surface w-full max-w-2xl h-full flex flex-col shadow-2xl"
          >
            <div className="flex items-center justify-between px-5 h-16 border-b ad-border-c flex-shrink-0">
              <div>
                <h2 className="font-bold" style={{ color: 'var(--ad-text)' }}>{isNew ? 'Yeni Yazı' : 'Yazıyı Düzenle'}</h2>
                <p className="text-[11px] ad-muted">{dirty ? 'Kaydedilmemiş değişiklikler' : 'Tüm alanları düzenleyin'}</p>
              </div>
              <button onClick={handleClose} className="w-9 h-9 rounded-xl ad-surface-2 border ad-border-c flex items-center justify-center ad-muted hover:text-brand-500">
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              <div className="flex gap-4 items-center ad-surface-2 rounded-2xl border ad-border-c p-4">
                <div className="w-16 h-16 rounded-xl bg-black/10 flex-shrink-0 overflow-hidden">
                  {form.coverImage && <img src={form.coverImage} alt="" className="w-full h-full object-cover" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold truncate" style={{ color: 'var(--ad-text)' }}>{form.title || 'Yazı başlığı'}</p>
                  <p className="text-xs ad-muted truncate">{form.excerpt || 'Kısa açıklama'}</p>
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
                <Field label="Başlık *">
                  <input className="ad-input" value={form.title} onChange={e => set('title', e.target.value)} placeholder="Bebek arabası alırken nelere dikkat edilmeli?" />
                </Field>
                <Field label="Slug (boş = otomatik)">
                  <div className="relative">
                    <Link2 size={15} className="absolute left-3 top-1/2 -translate-y-1/2 ad-muted" />
                    <input className="ad-input !pl-9" value={form.slug} onChange={e => set('slug', e.target.value)} placeholder="bebek-arabasi-secim-rehberi" />
                  </div>
                </Field>
                <Field label="Kategori">
                  <select className="ad-input" value={form.category} onChange={e => set('category', e.target.value)}>
                    {Object.entries(BLOG_CATEGORIES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                </Field>
                <Field label="Kısa Açıklama (özet) *">
                  <textarea rows={2} className="ad-input resize-none" value={form.excerpt} onChange={e => set('excerpt', e.target.value)} />
                </Field>
                <Field label="İçerik * (## Başlık, - liste, 1. numaralı liste desteklenir)">
                  <textarea rows={12} className="ad-input resize-none font-mono text-xs" value={form.content} onChange={e => set('content', e.target.value)} />
                </Field>
              </Section>

              <Section title="Etiketler">
                <div className="flex gap-2">
                  <input className="ad-input" value={tagInput} onChange={e => setTagInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
                    placeholder="Etiket ekle ve Enter'a bas" />
                  <button type="button" onClick={addTag} className="ad-btn-ghost px-3 rounded-xl"><Plus size={16} /></button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {form.tags.map(t => (
                    <span key={t} className="flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ad-surface border ad-border-c">
                      {t}
                      <button type="button" onClick={() => removeTag(t)} className="ad-muted hover:text-red-500"><X size={12} /></button>
                    </span>
                  ))}
                </div>
              </Section>

              <Section title="Kapak Görseli">
                <Field label="Görsel URL">
                  <input className="ad-input" value={form.coverImage} onChange={e => set('coverImage', e.target.value)} placeholder="/products/1.jpeg" />
                </Field>
              </Section>

              <Section title="SEO">
                <Field label="SEO Başlığı">
                  <input className="ad-input" value={form.seoTitle} onChange={e => set('seoTitle', e.target.value)} placeholder="Boş bırakılırsa başlık kullanılır" />
                </Field>
                <Field label="Meta Açıklama">
                  <textarea rows={2} className="ad-input resize-none" value={form.seoDescription} onChange={e => set('seoDescription', e.target.value)} />
                </Field>
                <div className="flex items-center gap-2 text-xs ad-muted">
                  <SeoIcon size={13} /> SEO puanı: <span className="font-bold" style={{ color: 'var(--ad-text)' }}>{score}/100</span>
                </div>
              </Section>

              <Section title="Sık Sorulan Sorular">
                {form.faq.map((f, i) => (
                  <div key={i} className="ad-surface rounded-xl border ad-border-c p-3 space-y-2">
                    <div className="flex items-center gap-2">
                      <input className="ad-input flex-1" placeholder="Soru" value={f.question} onChange={e => updateFaq(i, 'question', e.target.value)} />
                      <button type="button" onClick={() => removeFaq(i)} className="ad-muted hover:text-red-500"><Trash2 size={15} /></button>
                    </div>
                    <textarea rows={2} className="ad-input resize-none" placeholder="Cevap" value={f.answer} onChange={e => updateFaq(i, 'answer', e.target.value)} />
                  </div>
                ))}
                <button type="button" onClick={addFaq} className="ad-btn-ghost w-full py-2 rounded-xl text-sm flex items-center justify-center gap-2">
                  <Plus size={15} /> Soru Ekle
                </button>
              </Section>

              <Section title="Durum">
                <Field label="Yayın Durumu">
                  <div className="flex gap-2">
                    {[{ v: true, l: 'Yayında' }, { v: false, l: 'Taslak' }].map(o => (
                      <button key={String(o.v)} type="button" onClick={() => set('published', o.v)}
                        className={`flex-1 py-2 rounded-xl text-sm font-medium border transition-colors ${form.published === o.v ? 'bg-brand-500 text-white border-brand-500' : 'ad-surface border-[color:var(--ad-border)] ad-muted'}`}>
                        {o.l}
                      </button>
                    ))}
                  </div>
                </Field>
                <Field label="Öne Çıkan Yazı">
                  <div className="flex gap-2">
                    {[{ v: true, l: 'Evet' }, { v: false, l: 'Hayır' }].map(o => (
                      <button key={String(o.v)} type="button" onClick={() => set('featured', o.v)}
                        className={`flex-1 py-2 rounded-xl text-sm font-medium border transition-colors ${form.featured === o.v ? 'bg-brand-500 text-white border-brand-500' : 'ad-surface border-[color:var(--ad-border)] ad-muted'}`}>
                        {o.l}
                      </button>
                    ))}
                  </div>
                </Field>
              </Section>

              {!isNew && form.slug && (
                <a href={`/blog/${form.slug}`} target="_blank" className="flex items-center justify-center gap-2 text-sm font-medium text-brand-500 py-2">
                  <ExternalLink size={14} /> Canlı önizleme
                </a>
              )}
            </div>

            <div className="flex items-center gap-3 px-5 py-4 border-t ad-border-c flex-shrink-0">
              <button onClick={handleClose} className="ad-btn-ghost px-4 py-2.5 rounded-xl text-sm font-medium">İptal</button>
              <button onClick={save} disabled={saving || !form.title.trim()} className="ad-btn-accent flex-1 py-2.5 rounded-xl text-sm flex items-center justify-center gap-2">
                {saving ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : <><Save size={15} /> {isNew ? 'Yazıyı Ekle' : 'Kaydet'}</>}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export { EMPTY as EMPTY_BLOG };
