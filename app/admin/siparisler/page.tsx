'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, ChevronDown, Search, Phone, MapPin, Mail, Printer, Package } from 'lucide-react';
import { useAdmin } from '@/components/admin/AdminProvider';

interface OrderItem { product_name: string; price: number; quantity: number; }
interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_address: string;
  city: string;
  notes: string;
  total: number;
  status: string;
  created_at: string;
  items: OrderItem[];
}

const STATUS = [
  { value: 'PENDING', label: 'Beklemede', color: '#F59E0B' },
  { value: 'PREPARING', label: 'Hazırlanıyor', color: '#3B82F6' },
  { value: 'SHIPPED', label: 'Kargoda', color: '#8B5CF6' },
  { value: 'DELIVERED', label: 'Teslim Edildi', color: '#22C55E' },
  { value: 'CANCELLED', label: 'İptal', color: '#EF4444' },
];
const FLOW = ['PENDING', 'PREPARING', 'SHIPPED', 'DELIVERED'];
const fmt = (n: number) => `₺${n.toLocaleString('tr-TR')}`;

export default function AdminSiparislerPage() {
  const { toast } = useAdmin();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState('all');

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    const res = await fetch('/api/orders');
    const data = await res.json();
    setOrders(Array.isArray(data) ? data : (data.orders ?? []));
    setLoading(false);
  }, []);
  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const updateStatus = async (id: string, status: string) => {
    const res = await fetch(`/api/orders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
      toast({ kind: 'success', title: 'Durum güncellendi' });
    } else {
      toast({ kind: 'error', title: 'Güncellenemedi' });
    }
  };

  const visible = useMemo(() => {
    let list = [...orders];
    if (q.trim()) {
      const s = q.toLowerCase();
      list = list.filter(o =>
        o.order_number.toLowerCase().includes(s) ||
        o.customer_name.toLowerCase().includes(s) ||
        o.customer_email.toLowerCase().includes(s)
      );
    }
    if (filter !== 'all') list = list.filter(o => o.status === filter);
    return list;
  }, [orders, q, filter]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: orders.length };
    STATUS.forEach(s => { c[s.value] = orders.filter(o => o.status === s.value).length; });
    return c;
  }, [orders]);

  return (
    <div className="space-y-4">
      {/* Status filter pills */}
      <div className="flex flex-wrap gap-2">
        {[{ value: 'all', label: 'Tümü', color: '#6B7488' }, ...STATUS].map(s => (
          <button key={s.value} onClick={() => setFilter(s.value)}
            className={`px-3.5 py-2 rounded-xl text-sm font-medium border transition-colors flex items-center gap-2 ${filter === s.value ? 'text-white border-transparent' : 'ad-surface ad-border-c ad-muted'}`}
            style={filter === s.value ? { background: s.color } : undefined}>
            {s.label}
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${filter === s.value ? 'bg-white/25' : 'bg-black/5 dark:bg-white/10'}`}>{counts[s.value] ?? 0}</span>
          </button>
        ))}
      </div>

      {/* Toolbar */}
      <div className="ad-card p-3 flex items-center gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 ad-muted" />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Sipariş no, müşteri veya e-posta ara..." className="ad-input !pl-9" />
        </div>
        <button onClick={fetchOrders} className="ad-btn-ghost h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0">
          <RefreshCw size={15} />
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="ad-skeleton h-16 rounded-2xl" />)}</div>
      ) : visible.length === 0 ? (
        <div className="ad-card text-center py-16 ad-muted">
          <Package size={40} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">Sipariş bulunamadı</p>
        </div>
      ) : (
        <div className="space-y-3">
          {visible.map(order => {
            const st = STATUS.find(s => s.value === order.status) ?? STATUS[0];
            const isOpen = expanded === order.id;
            const stepIdx = FLOW.indexOf(order.status);
            return (
              <div key={order.id} className="ad-card overflow-hidden">
                <button
                  onClick={() => setExpanded(isOpen ? null : order.id)}
                  className="w-full flex items-center gap-4 px-4 sm:px-5 py-4 text-left hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors"
                >
                  <ChevronDown size={18} className={`ad-muted transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-navy-100 to-navy-200 dark:from-navy-700 dark:to-navy-800 flex items-center justify-center text-navy-700 dark:text-white font-bold text-xs flex-shrink-0">
                    {order.customer_name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-mono text-xs ad-muted">{order.order_number}</p>
                    <p className="font-semibold text-sm truncate" style={{ color: 'var(--ad-text)' }}>{order.customer_name}</p>
                  </div>
                  <p className="font-bold text-sm hidden sm:block flex-shrink-0" style={{ color: 'var(--ad-text)' }}>{fmt(order.total)}</p>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0" style={{ background: `${st.color}1A`, color: st.color }}>{st.label}</span>
                  <p className="text-[11px] ad-muted flex-shrink-0 hidden md:block">
                    {new Date(order.created_at).toLocaleDateString('tr-TR', { day: '2-digit', month: 'short' })}
                  </p>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden border-t ad-border-c"
                    >
                      <div className="p-5 space-y-5">
                        {/* Timeline */}
                        {order.status !== 'CANCELLED' && (
                          <div className="flex items-center gap-1">
                            {FLOW.map((s, i) => {
                              const done = i <= stepIdx;
                              const so = STATUS.find(x => x.value === s)!;
                              return (
                                <div key={s} className="flex-1 flex items-center gap-1">
                                  <div className="flex flex-col items-center gap-1">
                                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white" style={{ background: done ? so.color : 'var(--ad-border)' }}>{i + 1}</div>
                                    <span className="text-[9px] ad-muted whitespace-nowrap">{so.label}</span>
                                  </div>
                                  {i < FLOW.length - 1 && <div className="flex-1 h-0.5 rounded -mt-4" style={{ background: i < stepIdx ? so.color : 'var(--ad-border)' }} />}
                                </div>
                              );
                            })}
                          </div>
                        )}

                        <div className="grid sm:grid-cols-2 gap-5">
                          <div>
                            <p className="text-xs font-bold uppercase tracking-wider ad-muted mb-3">Müşteri</p>
                            <div className="space-y-2 text-sm" style={{ color: 'var(--ad-text)' }}>
                              <p className="flex items-center gap-2"><Mail size={14} className="ad-muted" /> {order.customer_email}</p>
                              {order.customer_phone && <p className="flex items-center gap-2"><Phone size={14} className="ad-muted" /> {order.customer_phone}</p>}
                              <p className="flex items-start gap-2"><MapPin size={14} className="ad-muted mt-0.5" /> <span>{order.customer_address}, {order.city}</span></p>
                              {order.notes && <p className="text-xs ad-muted italic">Not: {order.notes}</p>}
                            </div>
                          </div>
                          <div>
                            <p className="text-xs font-bold uppercase tracking-wider ad-muted mb-3">Ürünler</p>
                            <div className="space-y-2">
                              {order.items.map((it, i) => (
                                <div key={i} className="flex justify-between text-sm">
                                  <span style={{ color: 'var(--ad-text)' }}>{it.product_name} × {it.quantity}</span>
                                  <span className="font-semibold" style={{ color: 'var(--ad-text)' }}>{fmt(it.price * it.quantity)}</span>
                                </div>
                              ))}
                              <div className="border-t ad-border-c pt-2 flex justify-between font-bold" style={{ color: 'var(--ad-text)' }}>
                                <span>Toplam</span><span className="text-brand-500">{fmt(order.total)}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div>
                          <p className="text-xs font-bold uppercase tracking-wider ad-muted mb-2">Durumu Güncelle</p>
                          <div className="flex flex-wrap gap-2">
                            {STATUS.map(s => (
                              <button key={s.value} onClick={() => updateStatus(order.id, s.value)}
                                className="px-3 py-1.5 rounded-lg text-xs font-medium border transition-all"
                                style={order.status === s.value
                                  ? { background: s.color, color: '#fff', borderColor: s.color }
                                  : { borderColor: 'var(--ad-border)', color: 'var(--ad-muted)' }}>
                                {s.label}
                              </button>
                            ))}
                            <button onClick={() => window.print()} className="ad-btn-ghost px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 ml-auto">
                              <Printer size={13} /> Yazdır
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
