import { getStats, getOrders, getProducts } from '@/lib/db';
import DashboardClient from '@/components/admin/DashboardClient';

export default function AdminDashboardPage() {
  const stats = getStats();
  const orders = getOrders();
  const products = getProducts();

  return <DashboardClient stats={stats} orders={orders} products={products} />;
}
