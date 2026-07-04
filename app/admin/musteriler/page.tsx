'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Search, RefreshCw, Plus, User, Mail, Phone, MapPin, ShoppingBag, Tag } from 'lucide-react';
import { useAdmin } from '@/components/admin/AdminProvider';

interface Customer {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  city: string | null;
  tags: string[];
  createdAt: string;
  _count: { orders: number };
  orders: { total: number }[];
}

export default function AdminMusterilerPage() {
  const { toast } = useAdmin();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [addOpen, setAddOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', city: '', tags: '' });

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    const res = await fetch('/api/customers');
    const data = await res.json();
    setCustomers(Array.isArray(data) ? data : []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchCustomers(); }, [fetchCustomers]);

  const searchCustomers = useCallback(async (search: string) => {
    setLoading(true);
    const res = await fetch(`/api/customers${search ? `?q=${encodeURIComponent(search)}` : ''}`);
    const data = await res.json();
    setCustomers(Array.isArray(data) ? data : []);
    setLoading(false);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => searchCustomers(q), 300);
    return () => clearTimeout(t);
  }, [q, searchCustomers]);

  const addCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSaving(true);
    const res = await fetch('/api/customers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.name,
        email: form.email || undefined,
        phone: form.phone || undefined,
        city: form.city || undefined,
        tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      }),
    });
    setSaving(false);
    if (res.ok) {
      toast({ kind: 'success', title: 'Müşteri eklendi' });
      setAddOpen(false);
      setForm({ name: '', email: '', phone: '', city: '', tags: '' });
      fetchCustomers();
    } else {
      toast({ kind: 'error', title: 'Eklenemedi' });
    }
  };

  const totalRevenue = useMemo(() =>
    customers.reduce((s, c) => s + c.orders.reduce((a, o) => a + o.total, 0), 0), [customers]);

  const totalOrders = useMemo(() =>
    customers.reduce((s, c) => s + c._count.orders, 0), [customers]);

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Toplam Müşteri', value: customers.length, icon: User, color: '#8B5CF6' },
          { label: 'Toplam Sipariş', value: totalOrders, icon: ShoppingBag, color: '#EF742C' },
          { label: 'Toplam Ciro', value: `₺${totalRevenue.toLocaleString('tr-TR')}`, icon: Tag, color: '#22C55E' },
        ].map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="ad-card p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${s.color}1A`, color: s.color }}>
                <Icon size={18} />
              </div>
              <div>
                <p className="text-lg font-extrabold" style={{ color: 'var(--ad-text)' }}>{s.value}</p>
                <p className="text-xs ad-muted">{s.label}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Toolbar */}
      <div className="ad-card p-3 flex items-center gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 ad-muted" />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="İsim, e-posta veya telefon ara..." className="ad-input !pl-9" />
        </div>
        <button onClick={fetchCustomers} className="ad-btn-ghost h-10 w-10 rounded-xl flex items-center justify-center"><RefreshCw size={15} /></button>
        <button onClick={() => setAddOpen(true)} className="ad-btn-accent h-10 px-4 rounded-xl text-sm flex items-center gap-2">
          <Plus size={16} /> Yeni Müşteri
        </button>
      </div>

      {/* List */}
      <div className="ad-card overflow-hidden">
        <div className="px-5 py-3 border-b ad-border-c text-[11px] font-bold uppercase tracking-wider ad-muted">
          Müşteriler ({customers.length})
        </div>

        {loading ? (
          <div className="divide-y ad-border-c">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 px-5 py-4">
                <div className="ad-skeleton w-10 h-10 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <div className="ad-skeleton h-3 w-1/4 rounded" />
                  <div className="ad-skeleton h-2.5 w-1/3 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : customers.length === 0 ? (
          <div className="text-center py-16 ad-muted">
            <User size={36} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">Müşteri bulunamadı</p>
          </div>
        ) : (
          <div className="divide-y ad-border-c">
            {customers.map((c) => {
              const rev = c.orders.reduce((a, o) => a + o.total, 0);
              return (
                <Link key={c.id} href={`/admin/musteriler/${c.id}`}
                  className="flex items-center gap-4 px-5 py-4 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900 dark:to-purple-800 flex items-center justify-center font-bold text-sm text-purple-700 dark:text-purple-200 flex-shrink-0">
                    {c.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-sm truncate" style={{ color: 'var(--ad-text)' }}>{c.name}</p>
                    <div className="flex items-center gap-3 mt-0.5">
                      {c.email && <span className="flex items-center gap-1 text-[11px] ad-muted"><Mail size={11} />{c.email}</span>}
                      {c.phone && <span className="flex items-center gap-1 text-[11px] ad-muted"><Phone size={11} />{c.phone}</span>}
                      {c.city && <span className="flex items-center gap-1 text-[11px] ad-muted"><MapPin size={11} />{c.city}</span>}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 hidden sm:block">
                    <p className="text-sm font-bold" style={{ color: 'var(--ad-text)' }}>{c._count.orders} sipariş</p>
                    <p className="text-xs ad-muted">₺{rev.toLocaleString('tr-TR')}</p>
                  </div>
                  {c.tags.length > 0 && (
                    <div className="hidden md:flex items-center gap-1.5 flex-shrink-0">
                      {c.tags.slice(0, 2).map(t => (
                        <span key={t} className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-600">{t}</span>
                      ))}
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Add modal */}
      {addOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setAddOpen(false)} />
          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
            className="relative ad-surface rounded-2xl p-6 w-full max-w-md shadow-2xl border ad-border-c">
            <h2 className="font-bold text-lg mb-5" style={{ color: 'var(--ad-text)' }}>Yeni Müşteri</h2>
            <form onSubmit={addCustomer} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold ad-muted mb-1">Ad Soyad *</label>
                <input required className="ad-input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Ayşe Yılmaz" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold ad-muted mb-1">E-posta</label>
                  <input type="email" className="ad-input" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-xs font-semibold ad-muted mb-1">Telefon</label>
                  <input className="ad-input" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold ad-muted mb-1">Şehir</label>
                <input className="ad-input" value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} />
              </div>
              <div>
                <label className="block text-xs font-semibold ad-muted mb-1">Etiketler (virgülle ayır)</label>
                <input className="ad-input" value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} placeholder="vip, düzenli" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setAddOpen(false)} className="ad-btn-ghost flex-1 py-2.5 rounded-xl text-sm">İptal</button>
                <button type="submit" disabled={saving} className="ad-btn-accent flex-1 py-2.5 rounded-xl text-sm flex items-center justify-center">
                  {saving ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : 'Ekle'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
