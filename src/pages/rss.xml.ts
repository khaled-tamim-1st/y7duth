import type { APIRoute } from 'astro';
import { getPublishedArticles } from '@/lib/articles';

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
  const origin = context.url?.origin;
  const siteUrl = (origin && !origin.includes('localhost') && !origin.includes('127.0.0.1')
    ? origin
    : context.site?.toString() || 'https://y7duth.com'
  ).replace(/\/$/, '');

  const articles = await getPublishedArticles();

  const items = articles
    .map((art) => {
      const storyUrl = `${siteUrl}/story/${encodeURIComponent(art.slug)}`;
      let pubDate = '';
      try {
        pubDate = new Date(art.publishedAt || art.createdAt).toUTCString();
      } catch {
        pubDate = new Date().toUTCString();
      }

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
    <description>مجلة وثائقية كويتية مستقلة؛ نوثق حكايات أهل الديرة، أسرار الفرجان القديمة، وأكلات وتراث وتاريخ الكويت الأصيل.</description>
    <link>${siteUrl}</link>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml" />
    <language>ar-KW</language>
${items}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400',
    },
  });
};
