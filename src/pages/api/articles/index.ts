import type { APIRoute } from 'astro';
import { getDb, articlesTable } from '@/db';
import { requireAuth } from '@/lib/auth';
import { desc, lte, and, eq } from 'drizzle-orm';

// Automatically publish any scheduled articles whose time has arrived
async function checkScheduledArticles(db: ReturnType<typeof getDb>) {
  if (!db) return;
  try {
    const now = new Date();
    await db
      .update(articlesTable)
      .set({
        status: 'published',
        publishedAt: now,
        updatedAt: now,
      })
      .where(
        and(
          eq(articlesTable.status, 'scheduled'),
          lte(articlesTable.scheduledFor, now)
        )
      );
  } catch (e) {
    console.debug('Scheduled check notice:', e);
  }
}

export const GET: APIRoute = async ({ request, cookies }) => {
  const db = getDb();
  if (!db) {
    return new Response(JSON.stringify({ articles: [], warning: 'DATABASE_URL_NOT_CONFIGURED' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    await checkScheduledArticles(db);

    const url = new URL(request.url);
    const category = url.searchParams.get('category');
    const status = url.searchParams.get('status');

    let query = db.select().from(articlesTable).orderBy(desc(articlesTable.createdAt));
    const articles = await query;

    let filtered = articles;
    if (category && category !== 'الكل') {
      filtered = filtered.filter((a) => a.category === category);
    }
    if (status && status !== 'all') {
      filtered = filtered.filter((a) => a.status === status);
    }

    return new Response(JSON.stringify({ articles: filtered }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching articles:', error);
    return new Response(JSON.stringify({ error: 'تعذر جلب المقالات من قاعدة البيانات' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const POST: APIRoute = async ({ request, cookies }) => {
  const session = requireAuth(cookies);
  if (!session) {
    return new Response(JSON.stringify({ error: 'غير مصرح لك بالقيام بهذه العملية' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const db = getDb();
  if (!db) {
    return new Response(
      JSON.stringify({ error: 'يرجى ربط قاعدة بيانات Supabase أولاً في ملف .env' }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  try {
    const data = await request.json();

    if (!data.title || !data.content || !data.category) {
      return new Response(JSON.stringify({ error: 'العنوان، المحتوى، والتصنيف حقول مطلوبة' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Auto-generate slug if not provided
    const slug = (data.slug || data.title)
      .trim()
      .toLowerCase()
      .replace(/[^\u0621-\u064A\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .slice(0, 100) + '-' + Date.now().toString().slice(-4);

    const now = new Date();
    const scheduledFor = data.scheduledFor ? new Date(data.scheduledFor) : null;
    const isScheduled = data.status === 'scheduled' && scheduledFor && scheduledFor > now;

    const newArticle = await db
      .insert(articlesTable)
      .values({
        slug,
        title: data.title.trim(),
        excerpt: data.excerpt?.trim() || data.content.slice(0, 150),
        content: data.content,
        category: data.category,
        location: data.location?.trim() || 'الكويت',
        authorName: data.authorName?.trim() || session.name || 'هيئة التحرير',
        authorRole: data.authorRole?.trim() || 'محرر',
        coverImage: data.coverImage?.trim() || '/images/kuwait-souq.jpg',
        status: isScheduled ? 'scheduled' : data.status || 'draft',
        scheduledFor: isScheduled ? scheduledFor : null,
        publishedAt: data.status === 'published' ? now : null,
        isFeatured: Boolean(data.isFeatured),
        readTime: data.readTime || '٥ دقائق',
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    return new Response(JSON.stringify({ success: true, article: newArticle[0] }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error creating article:', error);
    return new Response(JSON.stringify({ error: 'حدث خطأ أثناء حفظ المقال' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
