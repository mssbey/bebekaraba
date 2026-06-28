import ComingSoon from '@/components/admin/ComingSoon';

export default async function AdminCatchAll({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  return <ComingSoon slug={slug.join('/')} />;
}
