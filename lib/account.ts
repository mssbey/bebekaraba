'use client';

export interface AccountUser {
  name: string;
  email: string;
}

export interface LocalOrderItem {
  product_id: number;
  product_name: string;
  price: number;
  quantity: number;
}

export interface LocalOrder {
  order_number: string;
  email: string;
  total: number;
  items: LocalOrderItem[];
  created_at: string;
}

const USER_KEY = 'ba_user';
const ORDERS_KEY = 'ba_orders';

export function getUser(): AccountUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as AccountUser) : null;
  } catch {
    return null;
  }
}

export function setUser(user: AccountUser): void {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  window.dispatchEvent(new Event('ba_auth'));
}

export function logoutUser(): void {
  localStorage.removeItem(USER_KEY);
  window.dispatchEvent(new Event('ba_auth'));
}

export function getOrders(email?: string): LocalOrder[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    const all = raw ? (JSON.parse(raw) as LocalOrder[]) : [];
    return email ? all.filter((o) => o.email === email) : all;
  } catch {
    return [];
  }
}

export function addOrder(order: LocalOrder): void {
  const raw = localStorage.getItem(ORDERS_KEY);
  const all = raw ? (JSON.parse(raw) as LocalOrder[]) : [];
  all.unshift(order);
  localStorage.setItem(ORDERS_KEY, JSON.stringify(all));
}
