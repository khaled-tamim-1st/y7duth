import type { APIRoute } from 'astro';
import { getDb, articlesTable } from '@/db';
import { requireAuth } from '@/lib/auth';
import { eq } from 'drizzle-orm';

export const GET: APIRoute = async ({ params }) => {
  const { id } = params;
  if (!id) return new Response(JSON.stringify({ error: 'المعرف غير صالح' }), { status: 400 });

  const db = getDb();
  if (!db) return new Response(JSON.stringify({ error: 'قاعدة البيانات غير متصلة' }), { status: 400 });

  try {
    const articles = await db.select().from(articlesTable).where(eq(articlesTable.id, id)).limit(1);
    if (articles.length === 0) {
      return new Response(JSON.stringify({ error: 'المقال غير موجود' }), { status: 404 });
    }
    return new Response(JSON.stringify({ article: articles[0] }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'خطأ في جلب المقال' }), { status: 500 });
  }
};

export const PUT: APIRoute = async ({ params, request, cookies }) => {
  const session = requireAuth(cookies);
  if (!session) {
    return new Response(JSON.stringify({ error: 'غير مصرح لك' }), { status: 401 });
  }

  const { id } = params;
  if (!id) return new Response(JSON.stringify({ error: 'المعرف غير صالح' }), { status: 400 });

  const db = getDb();
  if (!db) return new Response(JSON.stringify({ error: 'قاعدة البيانات غير متصلة' }), { status: 400 });

  try {
    const data = await request.json();
    const now = new Date();
    const scheduledFor = data.scheduledFor ? new Date(data.scheduledFor) : null;
    const isScheduled = data.status === 'scheduled' && scheduledFor && scheduledFor > now;

    const updated = await db
      .update(articlesTable)
      .set({
        title: data.title?.trim(),
        excerpt: data.excerpt?.trim(),
        content: data.content,
        category: data.category,
        location: data.location?.trim(),
        authorName: data.authorName?.trim(),
        authorRole: data.authorRole?.trim(),
        coverImage: data.coverImage?.trim(),
        status: isScheduled ? 'scheduled' : data.status,
        scheduledFor: isScheduled ? scheduledFor : null,
        publishedAt: data.status === 'published' ? (data.publishedAt ? new Date(data.publishedAt) : now) : null,
        isFeatured: Boolean(data.isFeatured),
        readTime: data.readTime,
        updatedAt: now,
      })
      .where(eq(articlesTable.id, id))
      .returning();

    return new Response(JSON.stringify({ success: true, article: updated[0] }), { status: 200 });
  } catch (error) {
    console.error('Update article error:', error);
    return new Response(JSON.stringify({ error: 'حدث خطأ أثناء تعديل المقال' }), { status: 500 });
  }
};

export const DELETE: APIRoute = async ({ params, cookies }) => {
  const session = requireAuth(cookies);
  if (!session) {
    return new Response(JSON.stringify({ error: 'غير مصرح لك' }), { status: 401 });
  }

  const { id } = params;
  if (!id) return new Response(JSON.stringify({ error: 'المعرف غير صالح' }), { status: 400 });

  const db = getDb();
  if (!db) return new Response(JSON.stringify({ error: 'قاعدة البيانات غير متصلة' }), { status: 400 });

  try {
    await db.delete(articlesTable).where(eq(articlesTable.id, id));
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error('Delete article error:', error);
    return new Response(JSON.stringify({ error: 'تعذر حذف المقال' }), { status: 500 });
  }
};
