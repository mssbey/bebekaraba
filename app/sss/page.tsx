import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { buildMetadata } from '@/lib/seo';
import { breadcrumbSchema, faqSchema } from '@/lib/schema';
import FaqAccordion, { type FaqCategory } from '@/components/FaqAccordion';

export const dynamic = 'force-dynamic';

export function generateMetadata(): Metadata {
  return buildMetadata({
    title: 'Sıkça Sorulan Sorular',
    description:
      'İkinci el bebek arabası satın alma, kargo, ödeme, iade ve garanti hakkında merak ettiğiniz her şey. Bebek Arabacınız SSS sayfası.',
    path: '/sss',
    keywords: [
      'ikinci el bebek arabası güvenli mi',
      'bebek arabası kargo süresi',
      'bebek arabası iade koşulları',
      'sıkça sorulan sorular',
    ],
  });
}

const FAQ_CATEGORIES: FaqCategory[] = [
  {
    title: 'Sipariş & Ödeme',
    slug: 'siparis-odeme',
    items: [
      {
        question: 'Siparişimi nasıl verebilirim?',
        answer:
          'Ürünü sepete ekleyip "Siparişi Tamamla" adımından teslimat ve ödeme bilgilerinizi girerek siparişinizi birkaç dakika içinde tamamlayabilirsiniz. Sipariş sonrası e-posta ile onay alırsınız.',
      },
      {
        question: 'Hangi ödeme yöntemlerini kullanabilirim?',
        answer:
          'Tüm banka ve kredi kartlarıyla güvenli ödeme yapabilir, uygun kartlarda taksit imkânından faydalanabilirsiniz. Ödemeleriniz SSL ile şifrelenerek işlenir, kart bilgileriniz sistemimizde saklanmaz.',
      },
      {
        question: 'Ürünler neden tek adet olarak satılıyor?',
        answer:
          'Sattığımız ürünler ikinci el ve her biri tektir; aynı üründen ikinci bir adet bulunmayabilir. Bu yüzden beğendiğiniz bir modeli görür görmez sipariş vermenizi öneririz.',
      },
      {
        question: 'Siparişimi verdikten sonra iptal edebilir miyim?',
        answer:
          'Kargoya verilmeden önce siparişinizi WhatsApp veya e-posta üzerinden bize bildirerek ücretsiz iptal edebilirsiniz. Kargo sonrası talepler iade politikamız kapsamında değerlendirilir.',
      },
    ],
  },
  {
    title: 'Ürünler & Kalite Kontrolü',
    slug: 'urunler-kalite',
    items: [
      {
        question: 'İkinci el ürünler güvenli mi?',
        answer:
          'Evet. Her ürün sitede yayınlanmadan önce yapısal sağlamlık, fren sistemi, tekerlek ve kumaş temizliği açısından uzman ekibimiz tarafından kontrol edilir. Sadece bu kontrolden geçen ürünler satışa sunulur.',
      },
      {
        question: 'Ürünlerin gerçek fotoğrafları mı kullanılıyor?',
        answer:
          'Evet, her ürün kendi gerçek fotoğrafları ile listelenir; stok görseli kullanılmaz. Ürünün mevcut kozmetik durumu (varsa küçük kullanım izleri) ürün açıklamasında dürüstçe belirtilir.',
      },
      {
        question: 'Ürünlerde eksik parça veya hasar olur mu?',
        answer:
          'Kontrolden geçen her ürünün eksiksiz ve çalışır durumda olmasına özen gösteriyoruz. Üründe belirtilmemiş bir eksik ya da hasar fark ederseniz teslimat sonrası 24 saat içinde bize bildirmeniz yeterli.',
      },
      {
        question: 'Bebek arabası, oto koltuğu ve aksesuar dışında ürün satıyor musunuz?',
        answer:
          'Şu anda kategori aralığımız bebek arabaları, oto koltukları, travel sistemler, ikiz bebek arabaları ve ilgili aksesuarlarla sınırlı. Ürün yelpazemiz düzenli olarak güncellenmektedir.',
      },
    ],
  },
  {
    title: 'Kargo & Teslimat',
    slug: 'kargo-teslimat',
    items: [
      {
        question: 'Kargo ne kadar sürede elime ulaşır?',
        answer:
          'Siparişleriniz onaylandıktan sonra ortalama 1-3 iş günü içinde anlaşmalı kargo firmalarımızla Türkiye genelinde teslim edilir. Kargoya verildiğinde takip numaranız e-posta ile tarafınıza iletilir.',
      },
      {
        question: 'Kargo ücreti var mı?',
        answer:
          'Kargo ücreti sipariş özetinde ödeme adımından önce açıkça gösterilir; sürpriz ek ücret uygulanmaz.',
      },
      {
        question: 'Türkiye\'nin her yerine gönderim yapıyor musunuz?',
        answer:
          'Evet, Türkiye genelinde tüm illere gönderim yapıyoruz.',
      },
      {
        question: 'Kargom hasarlı gelirse ne yapmalıyım?',
        answer:
          'Kargo firmasından teslim alırken paketi kontrol etmenizi, hasar durumunda tutanak tutturmanızı öneririz. Ardından bizimle iletişime geçtiğinizde ürünü ücretsiz değişim veya iade sürecine dahil ederiz.',
      },
    ],
  },
  {
    title: 'İade & Değişim',
    slug: 'iade-degisim',
    items: [
      {
        question: 'İade süresi ve koşulları nedir?',
        answer:
          'Ürünü teslim aldığınız tarihten itibaren 7 gün içinde, kullanılmamış ve orijinal durumuyla iade edebilirsiniz. İade talebiniz onaylandıktan sonra ücret iadeniz aynı ödeme yöntemine yapılır.',
      },
      {
        question: 'İade kargo ücretini kim karşılıyor?',
        answer:
          'Ürün açıklamasıyla uyumsuz veya hasarlı geldiyse kargo ücreti tarafımızca karşılanır. Cayma hakkı kapsamındaki iadelerde kargo ücreti alıcıya aittir; detaylar iade onayı sırasında paylaşılır.',
      },
      {
        question: 'Ürünü iade etmek yerine değişim yapabilir miyim?',
        answer:
          'Stok tek adet olduğu için aynı üründe değişim mümkün değildir, ancak iade sonrası sitemizdeki başka bir ürünle yeniden sipariş oluşturabilirsiniz.',
      },
    ],
  },
  {
    title: 'Hesap & Güvenlik',
    slug: 'hesap-guvenlik',
    items: [
      {
        question: 'Sipariş vermek için üye olmak zorunlu mu?',
        answer:
          'Hayır, üye olmadan da sipariş verebilirsiniz. Üye olarak sipariş geçmişinizi ve favori ürünlerinizi tek yerden takip edebilirsiniz.',
      },
      {
        question: 'Kişisel ve ödeme bilgilerim güvende mi?',
        answer:
          'Tüm site trafiği SSL ile şifrelenir, ödeme bilgileriniz sunucularımızda saklanmaz. Kişisel verileriniz yalnızca sipariş ve teslimat sürecinde kullanılır.',
      },
      {
        question: 'Sorularım için sizinle nasıl iletişime geçebilirim?',
        answer:
          'WhatsApp veya admin@bebekarabaciniz.com adresi üzerinden bize ulaşabilirsiniz; destek ekibimiz sorularınızı en kısa sürede yanıtlar.',
      },
    ],
  },
];

export default function FaqPage() {
  const flatFaq = FAQ_CATEGORIES.flatMap((c) => c.items);
  const schemas = [
    breadcrumbSchema([
      { name: 'Ana Sayfa', path: '/' },
      { name: 'Sıkça Sorulan Sorular', path: '/sss' },
    ]),
    faqSchema(flatFaq),
  ];

  return (
    <div className="bg-cream min-h-screen">
      {schemas.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}

      <div className="bg-white border-b border-[#EDE9E4] pt-24 pb-12">
        <div className="container mx-auto px-4 sm:px-6">
          <p className="text-xs font-bold uppercase tracking-widest text-orange-500 mb-2">SSS</p>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-navy-900 mb-3">Sıkça Sorulan Sorular</h1>
          <p className="text-charcoal/55 max-w-2xl text-sm sm:text-base">
            Sipariş, kargo, ödeme, iade ve ürün kalitesi hakkında en çok merak edilen soruları sizin için derledik.
            Aradığınız cevabı bulamazsanız destek ekibimizle iletişime geçebilirsiniz.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-12 max-w-3xl">
        <FaqAccordion categories={FAQ_CATEGORIES} />

        <div className="mt-16 rounded-[32px] overflow-hidden relative" style={{ background: 'linear-gradient(135deg, #0A1E35 0%, #163356 60%, #1F4A7A 100%)', padding: '48px 40px' }}>
          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
            <div>
              <h3 className="font-serif font-bold text-2xl mb-2 text-white">Başka bir sorunuz mu var?</h3>
              <p className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
                Destek ekibimiz WhatsApp ve e-posta üzerinden yardımcı olmaya hazır.
              </p>
            </div>
            <Link
              href="/urunler"
              className="flex items-center gap-2 font-bold text-white px-6 py-3 rounded-2xl shrink-0"
              style={{ background: 'linear-gradient(135deg, #F47A3C, #D4571F)' }}
            >
              Ürünleri Gör <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
