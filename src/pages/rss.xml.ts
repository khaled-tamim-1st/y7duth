import type { APIRoute } from 'astro';
import { stories } from '@/data/stories';

export const GET: APIRoute = async (context) => {
  const siteUrl = context.site?.toString() || 'https://yahduth-fi-al-kuwait.com';

  const items = stories
    .map((story) => `
    <item>
      <title><![CDATA[${story.title}]]></title>
      <link>${siteUrl.replace(/\/$/, '')}/story/${story.slug}</link>
      <guid>${siteUrl.replace(/\/$/, '')}/story/${story.slug}</guid>
      <description><![CDATA[${story.excerpt}]]></description>
      <category>${story.category}</category>
      <author><![CDATA[${story.author}]]></author>
    </item>
  `)
    .join('');

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>يحدث في الكويت</title>
    <description>مجلة مستقلة تنصت للمدينة، وتكتب عن تفاصيلها الصغيرة التي تصنع حكاية كبيرة.</description>
    <link>${siteUrl}</link>
    <atom:link href="${siteUrl.replace(/\/$/, '')}/rss.xml" rel="self" type="application/rss+xml" />
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
