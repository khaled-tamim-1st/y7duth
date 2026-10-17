import type { APIRoute } from 'astro';
import { getDb, articlesTable } from '@/db';
import { remember } from '@/lib/cache';
import { and, eq, lte, or, desc } from 'drizzle-orm';
import { optimizeImageUrl } from '@/lib/seo';

export const GET: APIRoute = async () => {
  const searchIndex = await remember('api_search_index', 120, async () => {
    const db = getDb();
    if (!db) return [];

    try {
      const now = new Date();
      const rows = await db
        .select({
          slug: articlesTable.slug,
          title: articlesTable.title,
          excerpt: articlesTable.excerpt,
          category: articlesTable.category,
          author: articlesTable.authorName,
          location: articlesTable.location,
          read: articlesTable.readTime,
          image: articlesTable.coverImage,
        })
        .from(articlesTable)
        .where(
          or(
            eq(articlesTable.status, 'published'),
            and(
              eq(articlesTable.status, 'scheduled'),
              lte(articlesTable.scheduledFor, now)
            )
          )
        )
        .orderBy(desc(articlesTable.createdAt));

      return rows.map((s) => ({
        slug: s.slug,
        title: s.title,
        excerpt: s.excerpt,
        category: s.category,
        author: s.author,
        location: s.location || 'الكويت',
        read: s.read || '٥ دقائق',
        image: optimizeImageUrl(s.image, 200),
      }));
    } catch (e) {
      console.error('Search API error:', e);
      return [];
    }
  });

  return new Response(JSON.stringify(searchIndex), {
    status: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=120, s-maxage=600, stale-while-revalidate=86400',
    },
  });
};
