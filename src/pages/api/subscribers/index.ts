import type { APIRoute } from 'astro';
import { getDb, subscribersTable } from '@/db';
import { requireAuth } from '@/lib/auth';
import { desc } from 'drizzle-orm';

export const GET: APIRoute = async ({ cookies }) => {
  const session = requireAuth(cookies);
  if (!session) {
    return new Response(JSON.stringify({ error: 'غير مصرح' }), { status: 401 });
  }

  const db = getDb();
  if (!db) {
    return new Response(JSON.stringify({ subscribers: [] }), { status: 200 });
  }

  try {
    const list = await db.select().from(subscribersTable).orderBy(desc(subscribersTable.subscribedAt));
    return new Response(JSON.stringify({ subscribers: list }), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'خطأ في جلب المشتركين' }), { status: 500 });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const { email } = await request.json();
    if (!email || !email.includes('@')) {
      return new Response(JSON.stringify({ error: 'البريد الإلكتروني غير صحيح' }), { status: 400 });
    }

    const db = getDb();
    if (db) {
      await db
        .insert(subscribersTable)
        .values({
          email: email.trim().toLowerCase(),
        })
        .onConflictDoNothing();
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'تعذر تسجيل الاشتراك' }), { status: 500 });
  }
};
