import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getBlogPosts, createBlogPost } from '@/lib/blog';
import { blogPostSchema } from '@/lib/validations';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await auth();
  try {
    const posts = await getBlogPosts({ includeDrafts: !!session });
    return NextResponse.json(posts);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });

  try {
    const body = await req.json();
    const parsed = blogPostSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Geçersiz veri', details: parsed.error.flatten() }, { status: 400 });
    }

    const post = await createBlogPost(parsed.data);
    return NextResponse.json(post, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}
