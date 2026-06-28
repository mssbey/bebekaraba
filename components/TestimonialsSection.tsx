'use client';

import * as React from 'react';
import { motion } from 'framer-motion';

interface Testimonial {
  id: number;
  testimonial: string;
  author: string;
  city: string;
}

const TESTIMONIALS: Testimonial[] = [
  { id: 1, testimonial: "Stokke Explorer'ı mükemmel durumda aldım. Gerçek fotoğraflar, hızlı kargo. Çok memnunum!", author: 'Ayşe K.', city: 'İstanbul' },
  { id: 2, testimonial: 'İkinci el ürün bu kadar kaliteli olur mu demedim ama olur. Detaylı açıklama ve güvenilir satıcı.', author: 'Fatma D.', city: 'Ankara' },
  { id: 3, testimonial: 'Bebek arabası tam beklediğim gibi geldi. Fiyat performans açısından çok uygun.', author: 'Zeynep M.', city: 'İzmir' },
];

function TestimonialCard({
  handleShuffle,
  testimonial,
  position,
  id,
  author,
  city,
}: {
  handleShuffle: () => void;
  testimonial: string;
  position: 'front' | 'middle' | 'back';
  id: number;
  author: string;
  city: string;
}) {
  const dragRef = React.useRef(0);
  const isFront = position === 'front';

  return (
    <motion.div
      style={{ zIndex: position === 'front' ? 2 : position === 'middle' ? 1 : 0 }}
      animate={{
        rotate: position === 'front' ? '-6deg' : position === 'middle' ? '0deg' : '6deg',
        x: position === 'front' ? '0%' : position === 'middle' ? '33%' : '66%',
      }}
      drag
      dragElastic={0.35}
      dragListener={isFront}
      dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
      onDragStart={(e) => {
        dragRef.current = (e as PointerEvent).clientX;
      }}
      onDragEnd={(e) => {
        if (dragRef.current - (e as PointerEvent).clientX > 150) {
          handleShuffle();
        }
        dragRef.current = 0;
      }}
      transition={{ duration: 0.35 }}
      className={`absolute left-0 top-0 grid h-[450px] w-[350px] select-none place-content-center space-y-6 rounded-[28px] border border-[#E6DFD4] bg-white/70 p-8 shadow-[0_24px_70px_rgba(30,53,86,0.12)] backdrop-blur-md ${
        isFront ? 'cursor-grab active:cursor-grabbing' : ''
      }`}
    >
      <img
        src={`https://i.pravatar.cc/128?img=${id + 10}`}
        alt={`${author} avatarı`}
        className="pointer-events-none mx-auto h-28 w-28 rounded-full border-2 border-[#EF742C]/40 bg-[#FAF8F4] object-cover"
      />
      <div className="flex justify-center gap-0.5" aria-hidden>
        {[...Array(5)].map((_, i) => (
          <span key={i} style={{ color: '#EF742C' }}>★</span>
        ))}
      </div>
      <span className="text-center font-serif text-lg italic leading-relaxed" style={{ color: '#4A4A5A' }}>
        “{testimonial}”
      </span>
      <div className="text-center">
        <p className="font-semibold text-sm" style={{ color: '#1E3556' }}>{author}</p>
        <p className="text-xs" style={{ color: '#9A9A9A' }}>{city}</p>
      </div>
    </motion.div>
  );
}

export default function TestimonialsSection() {
  const [order, setOrder] = React.useState(TESTIMONIALS);

  const handleShuffle = () => {
    setOrder((prev) => {
      const next = [...prev];
      next.unshift(next.pop()!);
      return next;
    });
  };

  const positions: ('front' | 'middle' | 'back')[] = ['front', 'middle', 'back'];

  return (
    <section className="section bg-white overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: heading */}
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[4px] mb-4" style={{ color: '#EF742C' }}>Yorumlar</p>
            <h2 className="font-serif font-bold leading-[1.05] mb-5" style={{ fontSize: 'clamp(34px, 4.5vw, 56px)', color: '#1E3556' }}>
              Müşterilerimiz<br />ne diyor?
            </h2>
            <p className="text-base leading-relaxed max-w-md" style={{ color: 'rgba(74,74,90,0.7)' }}>
              Gerçek ailelerin gerçek deneyimleri. Karta dokunup sürükleyerek diğer yorumları görebilirsiniz.
            </p>
          </div>

          {/* Right: card stack */}
          <div className="relative h-[480px] w-full flex items-center justify-center">
            <div className="relative h-[450px] w-[350px]">
              {order.map((t, i) => (
                <TestimonialCard
                  key={t.id}
                  handleShuffle={handleShuffle}
                  testimonial={t.testimonial}
                  author={t.author}
                  city={t.city}
                  id={t.id}
                  position={positions[i]}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
