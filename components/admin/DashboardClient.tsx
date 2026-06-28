'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ShoppingBag, TrendingUp, Package, Users, Receipt, Clock,
  ArrowUpRight, ArrowDownRight, Plus, RefreshCw, AlertTriangle, Star,
} from 'lucide-react';
import type { Order, Product } from '@/lib/db';

interface Stats {
  total_products: number; in_stock: number; sold: number;
  total_orders: number; total_revenue: number; pending_orders: number;
}

const ease = [0.22, 1, 0.36, 1] as const;
const fmt = (n: number) => n.toLocaleString('tr-TR');
const fmtTRY = (n: number) => `₺${n.toLocaleString('tr-TR')}`;

function useCountUp(target: number, duration = 900) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let raf = 0; const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min((t - start) / duration, 1);
      setVal(Math.round((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return val;
}

function StatCard({ icon: Icon, label, value, prefix, trend, color, delay }: {
  icon: typeof ShoppingBag; label: string; value: number; prefix?: string;
  trend?: number; color: string; delay: number;
}) {
  const count = useCountUp(value);
  const up = (trend ?? 0) >= 0;
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay, ease }}
      className="ad-card ad-card-hover p-5"
    >
      <div className="flex items-start justify-between">
        <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background: `${color}1A`, color }}>
          <Icon size={20} />
        </div>
        {trend !== undefined && (
          <span className={`flex items-center gap-0.5 text-xs font-semibold px-2 py-1 rounded-lg ${up ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-500'}`}>
            {up ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}{Math.abs(trend)}%
          </span>
        )}
      </div>
      <p className="text-2xl font-extrabold mt-4" style={{ color: 'var(--ad-text)' }}>
        {prefix}{fmt(count)}
      </p>
      <p className="text-xs ad-muted mt-0.5">{label}</p>
    </motion.div>
  );
}

function AreaChart({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data, 1);
  const w = 100, h = 36;
  const pts = data.map((v, i) => [(i / (data.length - 1)) * w, h - (v / max) * h]);
  const line = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
  const area = `${line} L${w},${h} L0,${h} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="w-full h-24">
      <defs>
        <linearGradient id="areaG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.28" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <motion.path d={area} fill="url(#areaG)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} />
      <motion.path d={line} fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, ease }} />
    </svg>
  );
}

const DAYS = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];

export default function DashboardClient({ stats, orders, products }: { stats: Stats; orders: Order[]; products: Product[] }) {
  // last 7 days revenue + orders
  const { revSeries, orderSeries } = useMemo(() => {
    const rev = new Array(7).fill(0);
    const cnt = new Array(7).fill(0);
    const now = new Date();
    orders.forEach(o => {
      const d = new Date(o.created_at);
      const diff = Math.floor((now.getTime() - d.getTime()) / 86400000);
      if (diff >= 0 && diff < 7) { const idx = 6 - diff; rev[idx] += o.total; cnt[idx] += 1; }
    });
    // gentle baseline so empty charts still look alive
    if (rev.every(v => v === 0)) for (let i = 0; i < 7; i++) rev[i] = 0;
    return { revSeries: rev, orderSeries: cnt };
  }, [orders]);

  const customers = useMemo(() => new Set(orders.map(o => o.customer_email)).size, [orders]);
  const avgOrder = stats.total_orders ? Math.round(stats.total_revenue / stats.total_orders) : 0;
  const todayOrders = useMemo(() => {
    const t = new Date().toDateString();
    return orders.filter(o => new Date(o.created_at).toDateString() === t).length;
  }, [orders]);

  const lowStock = useMemo(() => products.filter(p => p.stock <= 1).slice(0, 5), [products]);
  const recent = orders.slice(0, 6);

  const bestSellers = useMemo(() => {
    const m = new Map<string, { name: string; qty: number }>();
    orders.forEach(o => o.items.forEach(it => {
      const e = m.get(it.product_name) ?? { name: it.product_name, qty: 0 };
      e.qty += it.quantity; m.set(it.product_name, e);
    }));
    return [...m.values()].sort((a, b) => b.qty - a.qty).slice(0, 4);
  }, [orders]);

  const maxOrder = Math.max(...orderSeries, 1);

  return (
    <div className="space-y-6">
      {/* Stat grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard icon={ShoppingBag} label="Bugünkü Sipariş" value={todayOrders} trend={12} color="#EF742C" delay={0} />
        <StatCard icon={TrendingUp} label="Toplam Ciro" value={stats.total_revenue} prefix="₺" trend={8} color="#22C55E" delay={0.05} />
        <StatCard icon={Package} label="Toplam Ürün" value={stats.total_products} color="#3B82F6" delay={0.1} />
        <StatCard icon={Users} label="Müşteriler" value={customers} trend={5} color="#8B5CF6" delay={0.15} />
        <StatCard icon={Receipt} label="Ort. Sipariş" value={avgOrder} prefix="₺" color="#0EA5E9" delay={0.2} />
        <StatCard icon={Clock} label="Bekleyen" value={stats.pending_orders} color="#F59E0B" delay={0.25} />
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2, ease }} className="ad-card p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-1">
            <div>
              <p className="font-bold" style={{ color: 'var(--ad-text)' }}>Ciro (Son 7 Gün)</p>
              <p className="text-xs ad-muted">Günlük toplam gelir</p>
            </div>
            <p className="text-xl font-extrabold" style={{ color: 'var(--ad-text)' }}>{fmtTRY(revSeries.reduce((a, b) => a + b, 0))}</p>
          </div>
          <AreaChart data={revSeries} color="#EF742C" />
          <div className="flex justify-between mt-1 text-[10px] ad-muted">{DAYS.map(d => <span key={d}>{d}</span>)}</div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.25, ease }} className="ad-card p-5">
          <p className="font-bold mb-1" style={{ color: 'var(--ad-text)' }}>Siparişler</p>
          <p className="text-xs ad-muted mb-4">Son 7 gün</p>
          <div className="flex items-end justify-between gap-1.5 h-24">
            {orderSeries.map((v, i) => (
              <motion.div key={i} className="flex-1 rounded-t-md bg-gradient-to-t from-navy-700 to-navy-400"
                initial={{ height: 0 }} animate={{ height: `${(v / maxOrder) * 100}%` }} transition={{ duration: 0.6, delay: 0.3 + i * 0.05, ease }}
                style={{ minHeight: 4 }} title={`${v} sipariş`} />
            ))}
          </div>
          <div className="flex justify-between mt-1 text-[10px] ad-muted">{DAYS.map(d => <span key={d}>{d}</span>)}</div>
        </motion.div>
      </div>

      {/* Quick actions */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { icon: Plus, label: 'Yeni Ürün', href: '/admin/urunler?new=1', color: '#EF742C' },
          { icon: ShoppingBag, label: 'Siparişler', href: '/admin/siparisler', color: '#3B82F6' },
          { icon: RefreshCw, label: 'Stok Yönetimi', href: '/admin/urunler', color: '#22C55E' },
          { icon: Users, label: 'Müşteriler', href: '/admin/musteriler', color: '#8B5CF6' },
        ].map(({ icon: Icon, label, href, color }, i) => (
          <motion.div key={label} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 + i * 0.05 }}>
            <Link href={href} className="ad-card ad-card-hover p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}1A`, color }}><Icon size={18} /></div>
              <span className="font-semibold text-sm" style={{ color: 'var(--ad-text)' }}>{label}</span>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Lower grid */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Recent orders */}
        <div className="ad-card lg:col-span-2 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b ad-border-c">
            <p className="font-bold" style={{ color: 'var(--ad-text)' }}>Son Siparişler</p>
            <Link href="/admin/siparisler" className="text-xs font-semibold text-brand-500 hover:text-brand-600">Tümünü Gör →</Link>
          </div>
          {recent.length === 0 ? (
            <div className="text-center py-12 ad-muted">
              <ShoppingBag size={36} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">Henüz sipariş yok</p>
            </div>
          ) : (
            <div className="divide-y ad-border-c">
              {recent.map(o => (
                <div key={o.id} className="flex items-center gap-3 px-5 py-3 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-navy-100 to-navy-200 dark:from-navy-700 dark:to-navy-800 flex items-center justify-center text-navy-700 dark:text-white font-bold text-xs flex-shrink-0">
                    {o.customer_name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate" style={{ color: 'var(--ad-text)' }}>{o.customer_name}</p>
                    <p className="text-[11px] ad-muted font-mono">{o.order_number}</p>
                  </div>
                  <p className="font-bold text-sm" style={{ color: 'var(--ad-text)' }}>{fmtTRY(o.total)}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Side column: low stock + best sellers */}
        <div className="space-y-4">
          <div className="ad-card overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-4 border-b ad-border-c">
              <AlertTriangle size={16} className="text-amber-500" />
              <p className="font-bold text-sm" style={{ color: 'var(--ad-text)' }}>Düşük Stok</p>
            </div>
            {lowStock.length === 0 ? (
              <p className="text-center text-sm ad-muted py-8">Stoklar yeterli ✓</p>
            ) : (
              <div className="divide-y ad-border-c">
                {lowStock.map(p => (
                  <div key={p.id} className="flex items-center gap-3 px-5 py-3">
                    <div className={`w-8 h-8 rounded-lg ${p.gradient} flex-shrink-0 overflow-hidden`}>
                      {p.image && <img src={p.image} alt="" className="w-full h-full object-cover" />}
                    </div>
                    <p className="text-sm flex-1 truncate" style={{ color: 'var(--ad-text)' }}>{p.name}</p>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${p.stock === 0 ? 'bg-red-500/10 text-red-500' : 'bg-amber-500/10 text-amber-600'}`}>
                      {p.stock === 0 ? 'Tükendi' : `${p.stock} kaldı`}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="ad-card overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-4 border-b ad-border-c">
              <Star size={16} className="text-brand-500" />
              <p className="font-bold text-sm" style={{ color: 'var(--ad-text)' }}>Çok Satanlar</p>
            </div>
            {bestSellers.length === 0 ? (
              <p className="text-center text-sm ad-muted py-8">Henüz satış yok</p>
            ) : (
              <div className="divide-y ad-border-c">
                {bestSellers.map((b, i) => (
                  <div key={b.name} className="flex items-center gap-3 px-5 py-3">
                    <span className="w-6 h-6 rounded-lg bg-brand-500/10 text-brand-600 font-bold text-xs flex items-center justify-center flex-shrink-0">{i + 1}</span>
                    <p className="text-sm flex-1 truncate" style={{ color: 'var(--ad-text)' }}>{b.name}</p>
                    <span className="text-xs ad-muted">{b.qty} adet</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
