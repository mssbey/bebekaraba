'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { signIn } from 'next-auth/react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, ArrowRight, ShieldCheck, Boxes, Truck, Users, CheckCircle2 } from 'lucide-react';

const FEATURES = [
  { icon: ShieldCheck, label: 'Güvenli Yönetim', desc: 'Oturum korumalı erişim' },
  { icon: Boxes, label: 'Stok Yönetimi', desc: 'Anlık envanter takibi' },
  { icon: Truck, label: 'Sipariş Takibi', desc: 'Uçtan uca akış' },
  { icon: Users, label: 'Müşteri Yönetimi', desc: 'Tek panelde tümü' },
];

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [shake, setShake] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (result?.ok && !result.error) {
      setSuccess(true);
      setTimeout(() => { router.push('/admin'); router.refresh(); }, 900);
    } else {
      setError('E-posta veya şifre hatalı');
      setShake(true);
      setTimeout(() => setShake(false), 450);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: '#0A1628' }}>
      {/* ── LEFT HERO ── */}
      <div className="relative hidden lg:flex w-[52%] overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #102A4C 0%, #14325A 45%, #0C1E38 100%)' }} />
        <motion.div
          className="absolute -top-20 -left-10 w-[28rem] h-[28rem] rounded-full blur-3xl"
          style={{ background: 'rgba(239,116,44,0.30)' }}
          animate={{ x: [0, 40, 0], y: [0, 30, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-[-6rem] right-[-4rem] w-[26rem] h-[26rem] rounded-full blur-3xl"
          style={{ background: 'rgba(59,130,246,0.28)' }}
          animate={{ x: [0, -30, 0], y: [0, -40, 0], scale: [1, 1.15, 1] }}
          transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
        />
        {[...Array(18)].map((_, i) => (
          <motion.span
            key={i}
            className="absolute w-1 h-1 rounded-full bg-white/40"
            style={{ left: `${(i * 53) % 100}%`, top: `${(i * 37) % 100}%` }}
            animate={{ y: [0, -24, 0], opacity: [0.2, 0.7, 0.2] }}
            transition={{ duration: 4 + (i % 5), repeat: Infinity, delay: i * 0.3, ease: 'easeInOut' }}
          />
        ))}

        <div className="relative z-10 flex flex-col justify-between p-12 xl:p-16 w-full">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/95 flex items-center justify-center overflow-hidden shadow-lg">
              <Image src="/2.png" alt="Logo" width={32} height={32} className="object-contain" />
            </div>
            <span className="text-white font-bold text-lg">Bebek Arabacınız</span>
          </div>

          <div className="max-w-md">
            <motion.h1
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
              className="text-4xl xl:text-5xl font-extrabold text-white leading-[1.1] mb-4"
            >
              Premium<br />Yönetim Paneli
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
              className="text-white/55 text-base leading-relaxed mb-10"
            >
              Ürünlerinizi, siparişlerinizi ve müşterilerinizi tek bir şık panelden yönetin.
            </motion.p>
            <div className="grid grid-cols-2 gap-3">
              {FEATURES.map((f, i) => {
                const Icon = f.icon;
                return (
                  <motion.div
                    key={f.label}
                    initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 + i * 0.08 }}
                    className="rounded-2xl p-4 border border-white/10"
                    style={{ background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(12px)' }}
                  >
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-2.5" style={{ background: 'rgba(239,116,44,0.18)', color: '#FB8444' }}>
                      <Icon size={18} />
                    </div>
                    <p className="text-white font-semibold text-sm">{f.label}</p>
                    <p className="text-white/45 text-xs mt-0.5">{f.desc}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>

          <p className="text-white/35 text-xs">© 2026 Bebek Arabacınız · Tüm hakları saklıdır</p>
        </div>
      </div>

      {/* ── RIGHT LOGIN ── */}
      <div className="flex-1 flex items-center justify-center p-6 relative">
        <div className="lg:hidden absolute top-0 right-0 w-72 h-72 rounded-full bg-brand-500/25 blur-3xl pointer-events-none" />
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.5 }}
          className={`relative z-10 w-full max-w-md rounded-3xl p-8 sm:p-10 ${shake ? 'animate-shake' : ''}`}
          style={{ background: 'rgba(255,255,255,0.97)', boxShadow: '0 30px 80px rgba(0,0,0,0.45)' }}
        >
          <div className="text-center mb-8">
            <div className="relative w-16 h-16 mx-auto mb-4 rounded-2xl overflow-hidden shadow-lg bg-navy-50">
              <Image src="/2.png" alt="Logo" fill className="object-contain p-2" />
            </div>
            <h1 className="text-2xl font-extrabold text-navy-800">Admin Paneli</h1>
            <p className="text-gray-500 text-sm mt-1">Bebek Arabacınız Yönetim Sistemi</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">E-posta</label>
              <div className="relative">
                <Mail size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email" required value={email} onChange={e => setEmail(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15 transition-all"
                  placeholder="admin@bebekarabaciniz.com"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-gray-600">Şifre</label>
              </div>
              <div className="relative">
                <Lock size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPass ? 'text' : 'password'} required value={password} onChange={e => setPassword(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl pl-11 pr-11 py-3 text-sm focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15 transition-all"
                  placeholder="••••••••••"
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer select-none">
              <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} className="w-4 h-4 rounded accent-brand-500" />
              Beni hatırla
            </label>

            {error && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                <Lock size={14} /> {error}
              </motion.div>
            )}

            <button
              type="submit" disabled={loading || success}
              className="ad-btn-accent w-full py-3.5 rounded-xl flex items-center justify-center gap-2 text-sm"
            >
              {success ? (
                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-2">
                  <CheckCircle2 size={18} /> Giriş başarılı
                </motion.span>
              ) : loading ? (
                <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : (
                <>Giriş Yap <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          <p className="text-xs text-gray-400 text-center mt-6">Sadece yetkili personel erişebilir</p>
        </motion.div>
      </div>
    </div>
  );
}
