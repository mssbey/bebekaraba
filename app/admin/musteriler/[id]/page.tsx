'use client';

import { useState, useEffect, useCallback, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Mail, Phone, MapPin, Tag, ShoppingBag,
  MessageSquarePlus, Pencil, Trash2, Send, Clock,
} from 'lucide-react';
import { useAdmin } from '@/components/admin/AdminProvider';

const STATUS_LABEL: Record<string, string> = {
  PENDING: 'Beklemede', PREPARING: 'Hazırlanıyor',
  SHIPPED: 'Kargoda', DELIVERED: 'Teslim Edildi', CANCELLED: 'İptal',
};
const STATUS_COLOR: Record<string, string> = {
  PENDING: '#F59E0B', PREPARING: '#3B82F6', SHIPPED: '#8B5CF6',
  DELIVERED: '#22C55E', CANCELLED: '#EF4444',
};

interface Note { id: string; content: string; createdAt: string; }
interface OrderItem { name: string; price: number; quantity: number; }
interface Order {
  id: string; orderNumber: string; total: number; status: string;
  createdAt: string; items: OrderItem[];
}
interface Customer {
  id: string; name: string; email: string | null; phone: string | null;
  city: string | null; address: string | null; tags: string[];
  createdAt: string; orders: Order[]; notes: Note[];
}

export default function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { toast } = useAdmin();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [note, setNote] = useState('');
  const [sendingNote, setSendingNote] = useState(false);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', city: '', address: '', tags: '' });

  const fetch_ = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/customers/${id}`);
    if (!res.ok) { router.push('/admin/musteriler'); return; }
    const data = await res.json();
    setCustomer(data);
    setForm({
      name: data.name ?? '',
      email: data.email ?? '',
      phone: data.phone ?? '',
      city: data.city ?? '',
      address: data.address ?? '',
      tags: data.tags?.join(', ') ?? '',
    });
    setLoading(false);
  }, [id, router]);

  useEffect(() => { fetch_(); }, [fetch_]);

  const addNote = async () => {
    if (!note.trim()) return;
    setSendingNote(true);
    const res = await fetch(`/api/customers/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'addNote', content: note }),
    });
    setSendingNote(false);
    if (res.ok) {
      setNote('');
      toast({ kind: 'success', title: 'Not eklendi' });
      fetch_();
    }
  };

  const saveEdit = async () => {
    const res = await fetch(`/api/customers/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.name,
        email: form.email || undefined,
        phone: form.phone || undefined,
        city: form.city || undefined,
        address: form.address || undefined,
        tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      }),
    });
    if (res.ok) {
      toast({ kind: 'success', title: 'Müşteri güncellendi' });
      setEditing(false);
      fetch_();
    }
  };

  const deleteCustomer = async () => {
    if (!confirm(`"${customer?.name}" silinsin mi?`)) return;
    await fetch(`/api/customers/${id}`, { method: 'DELETE' });
    toast({ kind: 'success', title: 'Müşteri silindi' });
    router.push('/admin/musteriler');
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="ad-skeleton h-32 rounded-2xl" />
        <div className="grid md:grid-cols-3 gap-4">
          <div className="ad-skeleton h-48 rounded-2xl md:col-span-2" />
          <div className="ad-skeleton h-48 rounded-2xl" />
        </div>
      </div>
    );
  }
  if (!customer) return null;

  const totalRevenue = customer.orders.reduce((s, o) => s + o.total, 0);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="ad-card p-5 flex items-center gap-4 flex-wrap">
        <Link href="/admin/musteriler" className="ad-btn-ghost w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0">
          <ArrowLeft size={18} />
        </Link>
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900 dark:to-purple-800 flex items-center justify-center text-xl font-extrabold text-purple-700 dark:text-purple-200 flex-shrink-0">
          {customer.name.slice(0, 2).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-extrabold truncate" style={{ color: 'var(--ad-text)' }}>{customer.name}</h1>
          <div className="flex flex-wrap items-center gap-3 mt-1">
            {customer.email && <span className="flex items-center gap-1 text-xs ad-muted"><Mail size={12} />{customer.email}</span>}
            {customer.phone && <span className="flex items-center gap-1 text-xs ad-muted"><Phone size={12} />{customer.phone}</span>}
            {customer.city && <span className="flex items-center gap-1 text-xs ad-muted"><MapPin size={12} />{customer.city}</span>}
          </div>
          {customer.tags.length > 0 && (
            <div className="flex items-center gap-1.5 mt-1.5">
              <Tag size={11} className="ad-muted" />
              {customer.tags.map(t => <span key={t} className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-600">{t}</span>)}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setEditing(true)} className="ad-btn-ghost px-3 py-2 rounded-xl text-sm flex items-center gap-2"><Pencil size={14} /> Düzenle</button>
          <button onClick={deleteCustomer} className="px-3 py-2 rounded-xl text-sm flex items-center gap-2 bg-red-500/10 text-red-500 hover:bg-red-500/20"><Trash2 size={14} /> Sil</button>
          {customer.phone && (
            <a href={`https://wa.me/${customer.phone.replace(/\D/g, '')}`} target="_blank" rel="noreferrer"
              className="ad-btn-accent px-3 py-2 rounded-xl text-sm flex items-center gap-2">
              WhatsApp
            </a>
          )}
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Toplam Sipariş', value: customer.orders.length, color: '#EF742C' },
          { label: 'Toplam Harcama', value: `₺${totalRevenue.toLocaleString('tr-TR')}`, color: '#22C55E' },
          { label: 'Not Sayısı', value: customer.notes.length, color: '#8B5CF6' },
        ].map((s) => (
          <div key={s.label} className="ad-card p-4">
            <p className="text-2xl font-extrabold" style={{ color: s.color }}>{s.value}</p>
            <p className="text-xs ad-muted mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {/* Orders */}
        <div className="md:col-span-2 ad-card overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-4 border-b ad-border-c">
            <ShoppingBag size={16} className="ad-muted" />
            <p className="font-bold text-sm" style={{ color: 'var(--ad-text)' }}>Siparişler</p>
          </div>
          {customer.orders.length === 0 ? (
            <p className="text-center py-12 text-sm ad-muted">Henüz sipariş yok</p>
          ) : (
            <div className="divide-y ad-border-c">
              {customer.orders.map(o => (
                <div key={o.id} className="px-5 py-3 flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-mono text-xs ad-muted">{o.orderNumber}</p>
                    <p className="text-sm truncate" style={{ color: 'var(--ad-text)' }}>
                      {o.items.map(i => `${i.name} ×${i.quantity}`).join(', ')}
                    </p>
                  </div>
                  <p className="font-bold text-sm flex-shrink-0" style={{ color: 'var(--ad-text)' }}>₺{o.total.toLocaleString('tr-TR')}</p>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0"
                    style={{ background: `${STATUS_COLOR[o.status] ?? '#999'}1A`, color: STATUS_COLOR[o.status] ?? '#999' }}>
                    {STATUS_LABEL[o.status] ?? o.status}
                  </span>
                  <span className="text-[11px] ad-muted flex-shrink-0 hidden sm:block">
                    {new Date(o.createdAt).toLocaleDateString('tr-TR')}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Notes */}
        <div className="ad-card overflow-hidden flex flex-col">
          <div className="flex items-center gap-2 px-5 py-4 border-b ad-border-c flex-shrink-0">
            <MessageSquarePlus size={16} className="ad-muted" />
            <p className="font-bold text-sm" style={{ color: 'var(--ad-text)' }}>Notlar</p>
          </div>
          <div className="flex-1 overflow-y-auto max-h-72 divide-y ad-border-c">
            {customer.notes.length === 0 ? (
              <p className="text-center py-8 text-sm ad-muted">Henüz not yok</p>
            ) : (
              customer.notes.map(n => (
                <div key={n.id} className="px-4 py-3">
                  <p className="text-sm" style={{ color: 'var(--ad-text)' }}>{n.content}</p>
                  <p className="flex items-center gap-1 text-[11px] ad-muted mt-1"><Clock size={11} /> {new Date(n.createdAt).toLocaleDateString('tr-TR')}</p>
                </div>
              ))
            )}
          </div>
          <div className="p-3 border-t ad-border-c flex gap-2">
            <input
              className="ad-input flex-1"
              placeholder="Not ekle..."
              value={note}
              onChange={e => setNote(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addNote()}
            />
            <button onClick={addNote} disabled={sendingNote || !note.trim()} className="ad-btn-accent w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0">
              {sendingNote ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : <Send size={15} />}
            </button>
          </div>
        </div>
      </div>

      {/* Edit modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setEditing(false)} />
          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
            className="relative ad-surface rounded-2xl p-6 w-full max-w-md shadow-2xl border ad-border-c">
            <h2 className="font-bold text-lg mb-4" style={{ color: 'var(--ad-text)' }}>Müşteriyi Düzenle</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold ad-muted mb-1">Ad Soyad *</label>
                <input className="ad-input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
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
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold ad-muted mb-1">Şehir</label>
                  <input className="ad-input" value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-xs font-semibold ad-muted mb-1">Etiketler (virgülle)</label>
                  <input className="ad-input" value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold ad-muted mb-1">Adres</label>
                <textarea rows={2} className="ad-input resize-none" value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} />
              </div>
              <div className="flex gap-3 pt-1">
                <button onClick={() => setEditing(false)} className="ad-btn-ghost flex-1 py-2.5 rounded-xl text-sm">İptal</button>
                <button onClick={saveEdit} className="ad-btn-accent flex-1 py-2.5 rounded-xl text-sm">Kaydet</button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
