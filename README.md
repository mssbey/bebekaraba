# 🍼 Bebek Arabacınız — Full-Stack CRM & E-Ticaret

Premium ikinci el bebek arabası e-ticaret + CRM + admin panel sistemi.

## 🛠 Teknolojiler

- **Next.js 15** — App Router
- **TypeScript** — Tam tip güvenliği
- **Tailwind CSS** — Stil sistemi
- **Prisma ORM** — Veritabanı katmanı
- **PostgreSQL** — Ana veritabanı
- **Auth.js (NextAuth v5)** — Kimlik doğrulama
- **Zustand** — Client-side durum yönetimi
- **Zod** — Form validasyonu
- **React Hook Form** — Form yönetimi
- **Recharts** — Admin grafikleri
- **Resend** — E-posta bildirimleri
- **UploadThing** — Görsel yükleme
- **Framer Motion** — Animasyonlar

## 🚀 Kurulum

### 1. Projeyi kopyalayın

```bash
cd "bebek arabacınız"
```

### 2. Bağımlılıkları yükleyin

```bash
npm install
```

### 3. Ortam değişkenlerini ayarlayın

> **Önemli:** Prisma CLI ortam değişkenlerini `.env` dosyasından okur (`.env.local` değil).

```bash
cp .env.example .env
```

`.env` dosyasını açın ve gerekli değerleri doldurun:

- `DATABASE_URL` — PostgreSQL bağlantı URL'niz (aşağıya bakın)
- `AUTH_SECRET` — Rastgele güvenli bir string (`openssl rand -base64 32`)
- `RESEND_API_KEY` — [resend.com](https://resend.com) API anahtarı (opsiyonel, boşsa mail atlanır)

### 4. PostgreSQL veritabanı oluşturun

**Önerilen — ücretsiz bulut (Neon):**

1. [neon.tech](https://neon.tech) üzerinde ücretsiz hesap açın
2. Yeni proje oluşturun (region: Europe / Frankfurt)
3. **Connection string**'i kopyalayın:
   `postgresql://kullanici:sifre@ep-xxx.eu-central-1.aws.neon.tech/neondb?sslmode=require`
4. Bu değeri `.env` dosyasındaki `DATABASE_URL`'ye yapıştırın

**Alternatif — yerel PostgreSQL:**

```bash
createdb bebekarabaciniz
# VEYA: psql -U postgres -c "CREATE DATABASE bebekarabaciniz;"
# DATABASE_URL="postgresql://postgres:sifre@localhost:5432/bebekarabaciniz"
```

### 5. Prisma şemasını veritabanına uygulayın

```bash
npm run db:push
```

### 6. Demo verilerle doldurun

```bash
npm run db:seed
```

Bu komut şunları oluşturur:
- 👤 Admin kullanıcısı: `admin@bebekarabaciniz.com` / `123456`
- 📦 10 örnek ürün
- 👥 3 örnek müşteri
- 📋 5 örnek sipariş
- ⚙️ Site ayarları

### 7. Geliştirme sunucusunu başlatın

```bash
npm run dev
```

Uygulama [http://localhost:3000](http://localhost:3000) adresinde açılacaktır.

## 🔐 Admin Paneli

[http://localhost:3000/admin](http://localhost:3000/admin)

| Alan     | Değer                         |
|----------|-------------------------------|
| E-posta  | admin@bebekarabaciniz.com     |
| Şifre    | 123456                        |

## 📁 Proje Yapısı

```
bebek-arabaciniz/
├── app/
│   ├── (shop)/          # Alışveriş sitesi
│   │   ├── page.tsx     # Ana sayfa
│   │   ├── urunler/     # Ürün listeleme
│   │   ├── urun/        # Ürün detay
│   │   ├── sepet/       # Sepet
│   │   └── siparis-ver/ # Ödeme
│   ├── admin/           # Yönetim paneli
│   │   ├── page.tsx     # Dashboard
│   │   ├── urunler/     # Ürün yönetimi
│   │   ├── siparisler/  # Sipariş yönetimi
│   │   ├── musteriler/  # Müşteri CRM
│   │   ├── kategoriler/ # Kategori yönetimi
│   │   └── ayarlar/     # Site ayarları
│   └── api/             # API route'ları
├── components/
│   ├── admin/           # Admin bileşenleri
│   └── shop/            # Alışveriş bileşenleri
├── lib/
│   ├── auth.ts          # NextAuth yapılandırması
│   ├── prisma.ts        # Prisma client
│   ├── mail.ts          # Resend e-posta
│   └── validations.ts   # Zod şemaları
├── prisma/
│   ├── schema.prisma    # Veritabanı şeması
│   └── seed.ts          # Demo veriler
├── store/
│   └── cart.ts          # Zustand sepet
└── types/
    └── index.ts         # TypeScript tipleri
```

## 🗄 Faydalı Komutlar

```bash
# Prisma Studio (veritabanı görsel arayüzü)
npm run db:studio

# Veritabanını sıfırla ve yeniden doldur
npm run db:reset

# TypeScript kontrol
npx tsc --noEmit

# Production build
npm run build
```

## 📧 E-posta Kurulumu (Opsiyonel)

1. [resend.com](https://resend.com) üzerinde hesap açın
2. API key oluşturun
3. `.env.local` dosyasına `RESEND_API_KEY` ekleyin
4. Domain doğrulaması yapın

## 🖼 Görsel Yükleme (Opsiyonel)

1. [uploadthing.com](https://uploadthing.com) üzerinde hesap açın
2. Token alın
3. `.env.local` dosyasına `UPLOADTHING_TOKEN` ekleyin

## 🚢 Production Deploy

```bash
npm run build
npm start
```

Vercel deploy için: `DATABASE_URL` ve `AUTH_SECRET` environment variable'larını Vercel dashboard'una ekleyin.
