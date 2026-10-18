import type { APIRoute } from 'astro';
import { getPublishedArticles } from '@/lib/articles';
import { CATEGORIES_CONFIG } from '@/lib/categories';

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
    : context.site?.toString() || 'https://y7duth.online'
  ).replace(/\/$/, '');

  const articles = await getPublishedArticles();

  const urls: string[] = [];

  // 1. Homepage
  urls.push(`  <url>
    <loc>${siteUrl}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>`);

  // 2. Category Hub Pages (High Priority Pillar Architecture)
  for (const cat of CATEGORIES_CONFIG) {
    const loc = `${siteUrl}/category/${cat.slug}`;
    urls.push(`  <url>
    <loc>${escapeXml(loc)}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`);
  }

  // 3. Article Pages with Google Image Sitemap Extension
  for (const art of articles) {
    const lastmodDate = art.publishedAt || art.createdAt || new Date().toISOString();
    let lastmodIso = '';
    try {
      lastmodIso = new Date(lastmodDate).toISOString().split('T')[0];
    } catch {
      lastmodIso = new Date().toISOString().split('T')[0];
    }

    const loc = `${siteUrl}/story/${encodeURIComponent(art.slug)}`;

    let imageTag = '';
    if (art.coverImage) {
      const imgUrl = art.coverImage.startsWith('http')
        ? art.coverImage
        : `${siteUrl}${art.coverImage.startsWith('/') ? '' : '/'}${art.coverImage}`;

      imageTag = `
    <image:image>
      <image:loc>${escapeXml(imgUrl)}</image:loc>
      <image:title>${escapeXml(art.title)}</image:title>
      <image:caption>${escapeXml(art.excerpt || art.title)}</image:caption>
    </image:image>`;
    }

    urls.push(`  <url>
    <loc>${escapeXml(loc)}</loc>
    <lastmod>${lastmodIso}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.85</priority>${imageTag}
  </url>`);
  }

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls.join('\n')}
</urlset>`;

  return new Response(sitemap, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400',
    },
  });
};
