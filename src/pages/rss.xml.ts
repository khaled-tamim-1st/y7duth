import type { APIRoute } from 'astro';
import { getDb, articlesTable } from '@/db';
import { and, eq, lte, or, sql } from 'drizzle-orm';

function cdata(str: string): string {
  return `<![CDATA[${(str || '').replace(/]]>/g, ']]]]><![CDATA[>')}]]>`;
}

function escapeXml(unsafe: string): string {
  return (unsafe || '').replace(/[<>&'"]/g, (c) => {
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
          title: articlesTable.title,
          excerpt: articlesTable.excerpt,
          category: articlesTable.category,
          authorName: articlesTable.authorName,
          coverImage: articlesTable.coverImage,
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
        .orderBy(sql`COALESCE(${articlesTable.publishedAt}, ${articlesTable.createdAt}) DESC`)
        .limit(50);
    } catch (e) {
      console.error('RSS DB query error:', e);
    }
  }

  const items = articles
    .map((art) => {
      const storyUrl = `${siteUrl}/story/${art.slug}`;
      const pubDate = new Date(art.publishedAt || art.createdAt).toUTCString();
      const coverUrl = art.coverImage
        ? art.coverImage.startsWith('http')
          ? art.coverImage
          : `${siteUrl}${art.coverImage.startsWith('/') ? '' : '/'}${art.coverImage}`
        : '';

      const enclosureTag = coverUrl ? `\n      <enclosure url="${escapeXml(coverUrl)}" type="image/webp" />` : '';

      return `    <item>
      <title>${cdata(art.title)}</title>
      <link>${escapeXml(storyUrl)}</link>
      <guid isPermaLink="true">${escapeXml(storyUrl)}</guid>
      <description>${cdata(art.excerpt)}</description>
      <category>${escapeXml(art.category)}</category>
      <author>${cdata(art.authorName)}</author>
      <pubDate>${pubDate}</pubDate>${enclosureTag}
    </item>`;
    })
    .join('\n');

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>يحدث في الكويت — حكايات المكان وأهله</title>
    <description>مجلة مستقلة تنصت للمدينة، وتكتب عن تفاصيلها الصغيرة التي تصنع حكاية كبيرة.</description>
    <link>${siteUrl}</link>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml" />
    <language>ar-KW</language>
${items}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
};
