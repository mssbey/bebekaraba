import { z } from 'zod';

// ── Ürün ──────────────────────────────────────────────────────────────────────
export const productSchema = z.object({
  name: z.string().min(2, 'En az 2 karakter').max(200),
  slug: z.string().min(2).max(200).regex(/^[a-z0-9-]+$/, 'Sadece küçük harf, rakam ve tire').optional(),
  description: z.string().optional(),
  price: z.coerce.number().min(0, 'Geçerli bir fiyat girin'),
  salePrice: z.coerce.number().min(0).optional().nullable(),
  stock: z.coerce.number().int().min(0),
  categoryId: z.string().min(1, 'Kategori seçin'),
  brand: z.string().optional(),
  model: z.string().optional(),
  condition: z.enum(['NEW_LIKE', 'VERY_GOOD', 'GOOD']),
  featured: z.boolean().default(false),
  campaign: z.boolean().default(false),
  gradient: z.string().optional(),
  sortOrder: z.coerce.number().int().default(0),
  image: z.string().optional().nullable(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});

export type ProductFormData = z.infer<typeof productSchema>;

// ── Sipariş ────────────────────────────────────────────────────────────────────
export const checkoutSchema = z.object({
  customer_name: z.string().min(2, 'Ad soyad gerekli'),
  customer_email: z.string().email('Geçerli e-posta girin'),
  customer_phone: z.string().min(10, 'Telefon numarası gerekli').optional().or(z.literal('')),
  customer_address: z.string().min(5, 'Adres gerekli'),
  city: z.string().min(2, 'Şehir gerekli'),
  notes: z.string().optional(),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;

// ── Müşteri ───────────────────────────────────────────────────────────────────
export const customerSchema = z.object({
  name: z.string().min(2, 'Ad soyad gerekli'),
  email: z.string().email('Geçerli e-posta girin').optional().or(z.literal('')),
  phone: z.string().optional(),
  city: z.string().optional(),
  address: z.string().optional(),
  tags: z.array(z.string()).default([]),
});

export type CustomerFormData = z.infer<typeof customerSchema>;

// ── Kategori ──────────────────────────────────────────────────────────────────
export const categorySchema = z.object({
  name: z.string().min(2, 'Kategori adı gerekli'),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/, 'Sadece küçük harf, rakam ve tire'),
  description: z.string().optional(),
  icon: z.string().optional(),
  sortOrder: z.coerce.number().int().default(0),
});

export type CategoryFormData = z.infer<typeof categorySchema>;

// ── Login ─────────────────────────────────────────────────────────────────────
export const loginSchema = z.object({
  email: z.string().email('Geçerli e-posta girin'),
  password: z.string().min(1, 'Şifre gerekli'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// ── Blog ──────────────────────────────────────────────────────────────────────
export const blogPostSchema = z.object({
  title: z.string().min(4, 'En az 4 karakter').max(200),
  slug: z.string().min(2).max(200).regex(/^[a-z0-9-]+$/, 'Sadece küçük harf, rakam ve tire').optional(),
  excerpt: z.string().min(10, 'Kısa açıklama gerekli'),
  content: z.string().min(20, 'İçerik gerekli'),
  coverImage: z.string().optional().nullable(),
  category: z.string().optional(),
  tags: z.array(z.string()).default([]),
  authorName: z.string().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
  faq: z.array(z.object({ question: z.string(), answer: z.string() })).default([]),
  sortOrder: z.coerce.number().int().default(0),
});

export type BlogPostFormData = z.infer<typeof blogPostSchema>;

// ── Sipariş Durum ─────────────────────────────────────────────────────────────
export const orderStatusSchema = z.object({
  status: z.enum(['PENDING', 'PREPARING', 'SHIPPED', 'DELIVERED', 'CANCELLED']),
});
