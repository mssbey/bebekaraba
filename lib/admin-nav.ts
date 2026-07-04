import {
  LayoutDashboard, BarChart3, FileBarChart,
  Package, FolderTree, Tag, Boxes, Image as ImageIcon,
  ShoppingBag, Users, Ticket, Megaphone, Star,
  FileText, Newspaper, Search, Mail,
  Settings, UserCog, Shield, ScrollText, DatabaseBackup,
  type LucideIcon,
} from 'lucide-react';

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  real?: boolean;
  badge?: 'orders' | 'messages';
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

export const NAV: NavGroup[] = [
  {
    title: 'Genel',
    items: [
      { label: 'Dashboard', href: '/admin', icon: LayoutDashboard, real: true },
      { label: 'İstatistikler', href: '/admin/istatistikler', icon: BarChart3 },
      { label: 'Raporlar', href: '/admin/raporlar', icon: FileBarChart },
    ],
  },
  {
    title: 'Katalog',
    items: [
      { label: 'Ürünler', href: '/admin/urunler', icon: Package, real: true },
      { label: 'Kategoriler', href: '/admin/kategoriler', icon: FolderTree, real: true },
      { label: 'Markalar', href: '/admin/markalar', icon: Tag },
      { label: 'Stok Yönetimi', href: '/admin/stok', icon: Boxes },
      { label: 'Medya Kütüphanesi', href: '/admin/medya', icon: ImageIcon },
    ],
  },
  {
    title: 'Satış',
    items: [
      { label: 'Siparişler', href: '/admin/siparisler', icon: ShoppingBag, real: true, badge: 'orders' },
      { label: 'Müşteriler', href: '/admin/musteriler', icon: Users, real: true },
      { label: 'Kuponlar', href: '/admin/kuponlar', icon: Ticket },
      { label: 'Kampanyalar', href: '/admin/kampanyalar', icon: Megaphone },
      { label: 'Yorumlar', href: '/admin/yorumlar', icon: Star },
    ],
  },
  {
    title: 'İçerik',
    items: [
      { label: 'Sayfalar', href: '/admin/sayfalar', icon: FileText },
      { label: 'Blog', href: '/admin/blog', icon: Newspaper, real: true },
      { label: 'SEO', href: '/admin/seo', icon: Search },
      { label: 'İletişim Mesajları', href: '/admin/mesajlar', icon: Mail, badge: 'messages' },
    ],
  },
  {
    title: 'Sistem',
    items: [
      { label: 'Site Ayarları', href: '/admin/ayarlar', icon: Settings, real: true },
      { label: 'Kullanıcılar', href: '/admin/kullanicilar', icon: UserCog },
      { label: 'Roller', href: '/admin/roller', icon: Shield },
      { label: 'Log Kayıtları', href: '/admin/loglar', icon: ScrollText },
      { label: 'Yedekleme', href: '/admin/yedekleme', icon: DatabaseBackup },
    ],
  },
];

export const ALL_ITEMS: NavItem[] = NAV.flatMap(g => g.items);
