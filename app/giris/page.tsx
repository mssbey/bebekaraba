'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Mail, Lock, User, CheckCircle2 } from 'lucide-react';
import { setUser } from '@/lib/account';

// ── Pupil (no background, just a dark dot tracking mouse) ─────────────────
interface PupilProps {
  size?: number;
  maxDistance?: number;
  pupilColor?: string;
  forceLookX?: number;
  forceLookY?: number;
}

function Pupil({ size = 12, maxDistance = 5, pupilColor = '#2D2D3A', forceLookX, forceLookY }: PupilProps) {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => setMouse({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', h);
    return () => window.removeEventListener('mousemove', h);
  }, []);

  let px = 0, py = 0;
  if (forceLookX !== undefined && forceLookY !== undefined) {
    px = forceLookX; py = forceLookY;
  } else if (ref.current) {
    const r = ref.current.getBoundingClientRect();
    const dx = mouse.x - (r.left + r.width / 2);
    const dy = mouse.y - (r.top + r.height / 2);
    const dist = Math.min(Math.sqrt(dx * dx + dy * dy), maxDistance);
    const angle = Math.atan2(dy, dx);
    px = Math.cos(angle) * dist;
    py = Math.sin(angle) * dist;
  }

  return (
    <div
      ref={ref}
      className="rounded-full"
      style={{
        width: size, height: size,
        backgroundColor: pupilColor,
        transform: `translate(${px}px, ${py}px)`,
        transition: 'transform 0.1s ease-out',
      }}
    />
  );
}

// ── EyeBall (white sclera + tracking pupil, can blink) ────────────────────
interface EyeBallProps {
  size?: number;
  pupilSize?: number;
  maxDistance?: number;
  eyeColor?: string;
  pupilColor?: string;
  isBlinking?: boolean;
  forceLookX?: number;
  forceLookY?: number;
}

function EyeBall({
  size = 48, pupilSize = 16, maxDistance = 10,
  eyeColor = 'white', pupilColor = '#2D2D3A',
  isBlinking = false, forceLookX, forceLookY,
}: EyeBallProps) {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => setMouse({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', h);
    return () => window.removeEventListener('mousemove', h);
  }, []);

  let px = 0, py = 0;
  if (forceLookX !== undefined && forceLookY !== undefined) {
    px = forceLookX; py = forceLookY;
  } else if (ref.current) {
    const r = ref.current.getBoundingClientRect();
    const dx = mouse.x - (r.left + r.width / 2);
    const dy = mouse.y - (r.top + r.height / 2);
    const dist = Math.min(Math.sqrt(dx * dx + dy * dy), maxDistance);
    const angle = Math.atan2(dy, dx);
    px = Math.cos(angle) * dist;
    py = Math.sin(angle) * dist;
  }

  return (
    <div
      ref={ref}
      className="rounded-full flex items-center justify-center transition-all duration-150"
      style={{ width: size, height: isBlinking ? 2 : size, backgroundColor: eyeColor, overflow: 'hidden' }}
    >
      {!isBlinking && (
        <div
          className="rounded-full"
          style={{
            width: pupilSize, height: pupilSize,
            backgroundColor: pupilColor,
            transform: `translate(${px}px, ${py}px)`,
            transition: 'transform 0.1s ease-out',
          }}
        />
      )}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────
type Mode = 'giris' | 'kayit';

export default function GirisPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>('giris');
  const [showPw, setShowPw] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPw: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  // Character animation state
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [navyBlinking, setNavyBlinking] = useState(false);
  const [charcoalBlinking, setCharcoalBlinking] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [lookEachOther, setLookEachOther] = useState(false);
  const [navyPeeking, setNavyPeeking] = useState(false);

  const navyRef = useRef<HTMLDivElement>(null);
  const charcoalRef = useRef<HTMLDivElement>(null);
  const creamRef = useRef<HTMLDivElement>(null);
  const sageRef = useRef<HTMLDivElement>(null);

  // Mouse tracking
  useEffect(() => {
    const h = (e: MouseEvent) => setMouse({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', h);
    return () => window.removeEventListener('mousemove', h);
  }, []);

  // Navy random blink
  useEffect(() => {
    const schedule = (): ReturnType<typeof setTimeout> => setTimeout(() => {
      setNavyBlinking(true);
      setTimeout(() => { setNavyBlinking(false); schedule(); }, 150);
    }, Math.random() * 4000 + 3000);
    const t = schedule();
    return () => clearTimeout(t);
  }, []);

  // Charcoal random blink
  useEffect(() => {
    const schedule = (): ReturnType<typeof setTimeout> => setTimeout(() => {
      setCharcoalBlinking(true);
      setTimeout(() => { setCharcoalBlinking(false); schedule(); }, 150);
    }, Math.random() * 4000 + 3000);
    const t = schedule();
    return () => clearTimeout(t);
  }, []);

  // Characters glance at each other when email is focused
  useEffect(() => {
    if (isTyping) {
      setLookEachOther(true);
      const t = setTimeout(() => setLookEachOther(false), 800);
      return () => clearTimeout(t);
    }
    setLookEachOther(false);
  }, [isTyping]);

  // Navy peeks when password is visible — interval-based so no dep-loop
  useEffect(() => {
    if (form.password.length === 0 || !showPw) { setNavyPeeking(false); return; }
    const interval = setInterval(() => {
      setNavyPeeking(true);
      setTimeout(() => setNavyPeeking(false), 800);
    }, Math.random() * 2000 + 3000);
    return () => clearInterval(interval);
  }, [form.password, showPw]);

  // Helper: calculate body skew + face offset toward mouse
  const calcPos = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (!ref.current) return { faceX: 0, faceY: 0, bodySkew: 0 };
    const r = ref.current.getBoundingClientRect();
    const dx = mouse.x - (r.left + r.width / 2);
    const dy = mouse.y - (r.top + r.height / 3);
    return {
      faceX: Math.max(-15, Math.min(15, dx / 20)),
      faceY: Math.max(-10, Math.min(10, dy / 30)),
      bodySkew: Math.max(-6, Math.min(6, -dx / 120)),
    };
  };

  const np = calcPos(navyRef);
  const cp = calcPos(charcoalRef);
  const crp = calcPos(creamRef);
  const sp = calcPos(sageRef);

  const isHiding = form.password.length > 0 && !showPw;
  const isPeeking = form.password.length > 0 && showPw;

  // Form validation
  function validate() {
    const e: Record<string, string> = {};
    if (mode === 'kayit' && !form.name.trim()) e.name = 'Ad gereklidir.';
    if (!form.email.includes('@')) e.email = 'Geçerli bir e-posta girin.';
    if (form.password.length < 6) e.password = 'Şifre en az 6 karakter olmalı.';
    if (mode === 'kayit' && form.password !== form.confirmPw) e.confirmPw = 'Şifreler eşleşmiyor.';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => {
      const name = form.name.trim() || form.email.split('@')[0];
      setUser({ name, email: form.email });
      setLoading(false);
      setDone(true);
      setTimeout(() => router.push('/hesap'), 1200);
    }, 1000);
  }

  // Success screen
  if (done) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-4">
        <div className="text-center max-w-sm mx-auto">
          <div className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-3xl flex items-center justify-center">
            <CheckCircle2 size={38} className="text-green-500" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-navy-900 mb-3">
            {mode === 'giris' ? 'Hoş Geldiniz!' : 'Hesabınız Oluşturuldu!'}
          </h2>
          <p className="text-charcoal/60 mb-8 text-sm">
            {mode === 'giris' ? 'Başarıyla giriş yaptınız.' : 'Artık alışveriş yapabilirsiniz.'}
          </p>
          <Link href="/urunler" className="btn-orange inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl">
            Alışverişe Başla
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">

      {/* ── Left: Animated Characters Panel ────────────────────────────── */}
      <div
        className="relative hidden lg:flex flex-col justify-between p-12 text-white overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #B34618 0%, #D4571F 45%, #F4723A 100%)' }}
      >
        {/* Decorative grid */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            opacity: 0.06,
            backgroundImage: 'repeating-linear-gradient(0deg,#fff 0,#fff 1px,transparent 1px,transparent 20px),repeating-linear-gradient(90deg,#fff 0,#fff 1px,transparent 1px,transparent 20px)',
          }}
        />
        {/* Glow blobs */}
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center overflow-hidden">
            <Image src="/logo.png" alt="Bebek Arabacınız" width={32} height={32} className="object-contain p-1" />
          </div>
          <div>
            <p className="font-serif font-bold text-[15px] leading-tight">Bebek Arabacınız</p>
            <p className="text-white/50 text-[10px] tracking-widest">PREMİUM İKİNCİ EL</p>
          </div>
        </div>

        {/* Characters scene */}
        <div className="relative z-10 flex items-end justify-center" style={{ height: '420px' }}>
          <div className="relative" style={{ width: '520px', height: '380px' }}>

            {/* ① Navy tall rectangle — the shy one (hides behind when password typed) */}
            <div
              ref={navyRef}
              className="absolute bottom-0 transition-all duration-700 ease-in-out"
              style={{
                left: '58px',
                width: '172px',
                height: isHiding ? '430px' : '390px',
                backgroundColor: '#1B3A5C',
                borderRadius: '10px 10px 0 0',
                zIndex: 1,
                transform: isPeeking
                  ? 'skewX(0deg)'
                  : isHiding
                    ? `skewX(${np.bodySkew - 12}deg) translateX(38px)`
                    : `skewX(${np.bodySkew}deg)`,
                transformOrigin: 'bottom center',
              }}
            >
              <div
                className="absolute flex gap-7 transition-all duration-700 ease-in-out"
                style={{
                  left: isPeeking ? '16px' : isHiding ? '18px' : lookEachOther ? '50px' : `${40 + np.faceX}px`,
                  top: isPeeking ? '30px' : isHiding ? '-28px' : lookEachOther ? '60px' : `${36 + np.faceY}px`,
                }}
              >
                <EyeBall
                  size={18} pupilSize={7} maxDistance={5}
                  eyeColor="white" pupilColor="#1B3A5C"
                  isBlinking={navyBlinking}
                  forceLookX={isPeeking ? (navyPeeking ? 4 : -4) : lookEachOther ? 3 : undefined}
                  forceLookY={isPeeking ? (navyPeeking ? 5 : -4) : lookEachOther ? 4 : undefined}
                />
                <EyeBall
                  size={18} pupilSize={7} maxDistance={5}
                  eyeColor="white" pupilColor="#1B3A5C"
                  isBlinking={navyBlinking}
                  forceLookX={isPeeking ? (navyPeeking ? 4 : -4) : lookEachOther ? 3 : undefined}
                  forceLookY={isPeeking ? (navyPeeking ? 5 : -4) : lookEachOther ? 4 : undefined}
                />
              </div>
            </div>

            {/* ② Charcoal medium rectangle — steady companion */}
            <div
              ref={charcoalRef}
              className="absolute bottom-0 transition-all duration-700 ease-in-out"
              style={{
                left: '224px',
                width: '116px',
                height: '305px',
                backgroundColor: '#2D2D3A',
                borderRadius: '8px 8px 0 0',
                zIndex: 2,
                transform: isPeeking
                  ? 'skewX(0deg)'
                  : lookEachOther
                    ? `skewX(${cp.bodySkew * 1.5 + 10}deg) translateX(18px)`
                    : isHiding
                      ? `skewX(${cp.bodySkew * 1.5}deg)`
                      : `skewX(${cp.bodySkew}deg)`,
                transformOrigin: 'bottom center',
              }}
            >
              <div
                className="absolute flex gap-5 transition-all duration-700 ease-in-out"
                style={{
                  left: isPeeking ? '10px' : lookEachOther ? '30px' : `${24 + cp.faceX}px`,
                  top: isPeeking ? '24px' : lookEachOther ? '10px' : `${30 + cp.faceY}px`,
                }}
              >
                <EyeBall
                  size={16} pupilSize={6} maxDistance={4}
                  eyeColor="white" pupilColor="#2D2D3A"
                  isBlinking={charcoalBlinking}
                  forceLookX={isPeeking ? -4 : lookEachOther ? 0 : undefined}
                  forceLookY={isPeeking ? -4 : lookEachOther ? -4 : undefined}
                />
                <EyeBall
                  size={16} pupilSize={6} maxDistance={4}
                  eyeColor="white" pupilColor="#2D2D3A"
                  isBlinking={charcoalBlinking}
                  forceLookX={isPeeking ? -4 : lookEachOther ? 0 : undefined}
                  forceLookY={isPeeking ? -4 : lookEachOther ? -4 : undefined}
                />
              </div>
            </div>

            {/* ③ Cream semi-circle — innocent little one (front-left) */}
            <div
              ref={creamRef}
              className="absolute bottom-0 transition-all duration-700 ease-in-out"
              style={{
                left: '0px',
                width: '228px',
                height: '188px',
                backgroundColor: '#FDFCF8',
                borderRadius: '114px 114px 0 0',
                zIndex: 3,
                transform: isPeeking ? 'skewX(0deg)' : `skewX(${crp.bodySkew}deg)`,
                transformOrigin: 'bottom center',
              }}
            >
              <div
                className="absolute flex gap-7 transition-all duration-200 ease-out"
                style={{
                  left: isPeeking ? '46px' : `${78 + crp.faceX}px`,
                  top: isPeeking ? '78px' : `${84 + crp.faceY}px`,
                }}
              >
                <Pupil size={12} maxDistance={5} pupilColor="#2D2D3A"
                  forceLookX={isPeeking ? -5 : undefined}
                  forceLookY={isPeeking ? -4 : undefined}
                />
                <Pupil size={12} maxDistance={5} pupilColor="#2D2D3A"
                  forceLookX={isPeeking ? -5 : undefined}
                  forceLookY={isPeeking ? -4 : undefined}
                />
              </div>
            </div>

            {/* ④ Sage rounded tall — smiling one (front-right) */}
            <div
              ref={sageRef}
              className="absolute bottom-0 transition-all duration-700 ease-in-out"
              style={{
                left: '294px',
                width: '136px',
                height: '222px',
                backgroundColor: '#8EBC8E',
                borderRadius: '68px 68px 0 0',
                zIndex: 4,
                transform: isPeeking ? 'skewX(0deg)' : `skewX(${sp.bodySkew}deg)`,
                transformOrigin: 'bottom center',
              }}
            >
              <div
                className="absolute flex gap-5 transition-all duration-200 ease-out"
                style={{
                  left: isPeeking ? '18px' : `${50 + sp.faceX}px`,
                  top: isPeeking ? '30px' : `${36 + sp.faceY}px`,
                }}
              >
                <Pupil size={11} maxDistance={5} pupilColor="#1B3A5C"
                  forceLookX={isPeeking ? -5 : undefined}
                  forceLookY={isPeeking ? -4 : undefined}
                />
                <Pupil size={11} maxDistance={5} pupilColor="#1B3A5C"
                  forceLookX={isPeeking ? -5 : undefined}
                  forceLookY={isPeeking ? -4 : undefined}
                />
              </div>
              {/* Smile */}
              <div
                className="absolute rounded-full transition-all duration-200 ease-out"
                style={{
                  width: 52, height: 4, backgroundColor: '#1B3A5C',
                  left: isPeeking ? '8px' : `${42 + sp.faceX}px`,
                  top: isPeeking ? '84px' : `${82 + sp.faceY}px`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Footer links */}
        <div className="relative z-10 flex items-center gap-8 text-sm text-white/50">
          <a href="#" className="hover:text-white transition-colors">Gizlilik</a>
          <a href="#" className="hover:text-white transition-colors">Kullanım Koşulları</a>
          <a href="#" className="hover:text-white transition-colors">İletişim</a>
        </div>
      </div>

      {/* ── Right: Form Panel ─────────────────────────────────────────────── */}
      <div className="flex items-center justify-center p-8 bg-cream min-h-screen">
        <div className="w-full max-w-[420px]">

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center gap-2.5 mb-10">
            <div className="w-9 h-9 rounded-xl border border-[#EDE9E4] overflow-hidden bg-white flex items-center justify-center">
              <Image src="/logo.png" alt="Logo" width={36} height={36} className="object-contain p-1" />
            </div>
            <div>
              <p className="font-serif font-bold text-sm text-navy-700">Bebek Arabacınız</p>
              <p className="text-[10px] text-charcoal/40 tracking-wider">PREMİUM İKİNCİ EL</p>
            </div>
          </div>

          {/* Mode tabs */}
          <div className="flex rounded-2xl border border-[#EDE9E4] bg-white p-1 mb-8 w-fit">
            {(['giris', 'kayit'] as const).map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setErrors({}); }}
                className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  mode === m ? 'bg-orange-500 text-white shadow-sm' : 'text-charcoal/60 hover:text-charcoal'
                }`}
              >
                {m === 'giris' ? 'Giriş Yap' : 'Üye Ol'}
              </button>
            ))}
          </div>

          {/* Card */}
          <div className="bg-white rounded-3xl border border-[#EDE9E4] p-8 shadow-card">
            <h1 className="font-serif text-2xl font-bold text-navy-900 mb-2">
              {mode === 'giris' ? 'Tekrar Hoş Geldiniz!' : 'Hesap Oluşturun'}
            </h1>
            <p className="text-charcoal/55 text-sm mb-7">
              {mode === 'giris' ? 'Bilgilerinizi girerek alışverişe devam edin.' : 'Birkaç adımda ücretsiz kayıt olun.'}
            </p>

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>

              {/* Name (register only) */}
              {mode === 'kayit' && (
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-charcoal mb-1.5">
                    Ad Soyad <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal/35 pointer-events-none" />
                    <input
                      id="name"
                      type="text"
                      autoComplete="name"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className={`input-field pl-10 ${errors.name ? 'border-red-400' : ''}`}
                      placeholder="Adınızı girin"
                    />
                  </div>
                  {errors.name && <p className="text-red-500 text-xs mt-1.5">{errors.name}</p>}
                </div>
              )}

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-charcoal mb-1.5">
                  E-posta <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal/35 pointer-events-none" />
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    onFocus={() => setIsTyping(true)}
                    onBlur={() => setIsTyping(false)}
                    className={`input-field pl-10 ${errors.email ? 'border-red-400' : ''}`}
                    placeholder="ornek@email.com"
                  />
                </div>
                {errors.email && <p className="text-red-500 text-xs mt-1.5">{errors.email}</p>}
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="password" className="text-sm font-semibold text-charcoal">
                    Şifre <span className="text-red-500">*</span>
                  </label>
                  {mode === 'giris' && (
                    <button type="button" className="text-xs text-orange-500 hover:text-orange-600 font-medium transition-colors">
                      Şifremi Unuttum
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal/35 pointer-events-none" />
                  <input
                    id="password"
                    type={showPw ? 'text' : 'password'}
                    autoComplete={mode === 'giris' ? 'current-password' : 'new-password'}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className={`input-field pl-10 pr-12 ${errors.password ? 'border-red-400' : ''}`}
                    placeholder="En az 6 karakter"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    aria-label={showPw ? 'Şifreyi gizle' : 'Şifreyi göster'}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-charcoal/40 hover:text-charcoal transition-colors"
                  >
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1.5">{errors.password}</p>}
              </div>

              {/* Confirm password (register only) */}
              {mode === 'kayit' && (
                <div>
                  <label htmlFor="confirmPw" className="block text-sm font-semibold text-charcoal mb-1.5">
                    Şifre Tekrar <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal/35 pointer-events-none" />
                    <input
                      id="confirmPw"
                      type={showPw ? 'text' : 'password'}
                      autoComplete="new-password"
                      value={form.confirmPw}
                      onChange={(e) => setForm({ ...form, confirmPw: e.target.value })}
                      className={`input-field pl-10 ${errors.confirmPw ? 'border-red-400' : ''}`}
                      placeholder="Şifreyi tekrar girin"
                    />
                  </div>
                  {errors.confirmPw && <p className="text-red-500 text-xs mt-1.5">{errors.confirmPw}</p>}
                </div>
              )}

              {/* Remember me (login only) */}
              {mode === 'giris' && (
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="remember"
                    className="w-4 h-4 rounded border-[#EDE9E4] cursor-pointer"
                    style={{ accentColor: '#F4723A' }}
                  />
                  <label htmlFor="remember" className="text-sm text-charcoal/65 cursor-pointer select-none">
                    30 gün beni hatırla
                  </label>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="btn-orange w-full py-3.5 rounded-xl text-base disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Lütfen bekleyin...
                  </>
                ) : mode === 'giris' ? 'Giriş Yap' : 'Hesap Oluştur'}
              </button>
            </form>

            {/* Switch mode */}
            <div className="mt-6 pt-6 border-t border-[#EDE9E4] text-center">
              <p className="text-sm text-charcoal/55">
                {mode === 'giris' ? 'Hesabınız yok mu?' : 'Zaten hesabınız var mı?'}{' '}
                <button
                  onClick={() => { setMode(mode === 'giris' ? 'kayit' : 'giris'); setErrors({}); }}
                  className="text-orange-500 font-semibold hover:text-orange-600 transition-colors"
                >
                  {mode === 'giris' ? 'Üye Olun' : 'Giriş Yapın'}
                </button>
              </p>
            </div>
          </div>

          {/* Admin link */}
          <p className="text-center text-xs text-charcoal/35 mt-5">
            Admin paneli için{' '}
            <Link href="/admin/login" className="text-navy-700/60 hover:text-navy-700 transition-colors">
              /admin/login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
