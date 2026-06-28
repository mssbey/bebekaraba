import Link from 'next/link';
import { CheckCircle, ShoppingBag } from 'lucide-react';

export default async function TesekkurlerPage({
  searchParams,
}: {
  searchParams: Promise<{ siparis?: string }>;
}) {
  const { siparis } = await searchParams;

  return (
    <div className="min-h-screen bg-cream pt-24 flex items-center justify-center">
      <div className="max-w-lg w-full mx-auto px-4 text-center py-12">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={48} className="text-green-600" />
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-navy-700 mb-3">
          Siparişiniz Alındı!
        </h1>

        {siparis && (
          <div className="bg-navy-50 rounded-2xl px-6 py-4 mb-6 inline-block">
            <p className="text-sm text-gray-500">Sipariş No</p>
            <p className="font-bold text-navy-700 text-lg">{siparis}</p>
          </div>
        )}

        <p className="text-gray-600 text-lg leading-relaxed mb-8">
          Teşekkürler! Siparişiniz başarıyla alındı. En kısa sürede sizinle iletişime geçeceğiz.
        </p>

        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-8 text-left">
          <h3 className="font-semibold text-amber-800 mb-2">Sonraki Adımlar</h3>
          <ul className="space-y-2 text-sm text-amber-700">
            <li className="flex items-start gap-2">
              <span className="font-bold">1.</span>
              E-posta adresinize sipariş özeti gönderilecek.
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold">2.</span>
              Satıcı 24 saat içinde sizi arayacak veya WhatsApp ile ulaşacak.
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold">3.</span>
              Ödeme sonrası ürün kargoya verilecek.
            </li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-navy-700 text-white font-semibold hover:bg-navy-800 transition-colors"
          >
            Ana Sayfaya Dön
          </Link>
          <Link
            href="/urunler"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl border-2 border-navy-700 text-navy-700 font-semibold hover:bg-navy-50 transition-colors"
          >
            <ShoppingBag size={18} />
            Alışverişe Devam Et
          </Link>
        </div>
      </div>
    </div>
  );
}
