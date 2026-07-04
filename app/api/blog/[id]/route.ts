import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getBlogPost, updateBlogPost, deleteBlogPost } from '@/lib/blog';
import { blogPostSchema } from '@/lib/validations';

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  const post = await getBlogPost(id, { includeDrafts: !!session });
  if (!post) return NextResponse.json({ error: 'Bulunamadı' }, { status: 404 });
  return NextResponse.json(post);
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });

  const { id } = await params;
  try {
    const body = await req.json();
    const parsed = blogPostSchema.partial().safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Geçersiz veri', details: parsed.error.flatten() }, { status: 400 });
    }

    const post = await updateBlogPost(id, parsed.data);
    return NextResponse.json(post);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  return PUT(req, { params });
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });

  const { id } = await params;
  try {
    await deleteBlogPost(id);
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}
