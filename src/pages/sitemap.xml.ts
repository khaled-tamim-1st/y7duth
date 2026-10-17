import type { APIRoute } from 'astro';
import { getDb, articlesTable } from '@/db';
import { categories } from '@/data/stories';
import { and, eq, lte, or, desc } from 'drizzle-orm';

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '&':
        return '&amp;';
      case "'":
        return '&apos;';
      case '"':
        return '&quot;';
      default:
        return c;
    }
  });
}

export const GET: APIRoute = async (context) => {
  const siteUrl = (context.site?.toString() || 'https://yahduth-fi-al-kuwait.com').replace(/\/$/, '');
  const db = getDb();
  let articles: any[] = [];

  if (db) {
    try {
      const now = new Date();
      articles = await db
        .select({
          slug: articlesTable.slug,
          updatedAt: articlesTable.updatedAt,
          publishedAt: articlesTable.publishedAt,
          createdAt: articlesTable.createdAt,
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
    } catch (e) {
      console.error('Sitemap DB query error:', e);
    }
  }

  // Filter out 'الكل' to keep the 5 main categories
  const targetCategories = categories.filter((cat) => cat !== 'الكل');

  const urls: string[] = [];

  // 1. Homepage
  urls.push(`  <url>
    <loc>${siteUrl}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>`);

  // 2. Category Pages
  for (const cat of targetCategories) {
    const loc = `${siteUrl}/category/${encodeURIComponent(cat)}`;
    urls.push(`  <url>
    <loc>${escapeXml(loc)}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`);
  }

  // 3. Article Pages
  for (const art of articles) {
    const lastmodDate = art.updatedAt || art.publishedAt || art.createdAt || new Date();
    const lastmodIso = new Date(lastmodDate).toISOString();
    const loc = `${siteUrl}/story/${art.slug}`;
    urls.push(`  <url>
    <loc>${escapeXml(loc)}</loc>
    <lastmod>${lastmodIso}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>`);
  }

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
};
