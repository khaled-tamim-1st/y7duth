import { PGlite } from '@electric-sql/pglite';
import path from 'path';
import fs from 'fs';

async function analyze() {
  const dbPath = path.resolve(process.cwd(), 'local-data', 'pglite');
  const db = new PGlite(dbPath);

  console.log('=== فحص وتدقيق قاعدة البيانات المحلية (PGlite) ===\n');

  // 1. Tables check
  const tablesRes = await db.query("SELECT table_name FROM information_schema.tables WHERE table_schema='public'");
  console.log('الجداول الموجودة:');
  for (const t of tablesRes.rows) {
    const countRes = await db.query(`SELECT count(*) as count FROM ${t.table_name}`);
    console.log(` - جدول [${t.table_name}]: ${countRes.rows[0].count} سجل`);
  }

  // 2. Subscribers & Admins
  const subs = await db.query('SELECT * FROM subscribers');
  console.log(`\nالمشتركون (subscribers): ${subs.rows.length}`);
  subs.rows.forEach(s => console.log(` - ${s.email} (Active: ${s.is_active})`));

  const admins = await db.query('SELECT id, username, name, role, created_at FROM admin_users');
  console.log(`\nالمسؤولون (admin_users): ${admins.rows.length}`);
  admins.rows.forEach(a => console.log(` - ${a.username} (${a.name}) [دور: ${a.role}]`));

  // 3. Articles Analysis
  const articlesRes = await db.query(`
    SELECT 
      id, slug, title, excerpt, content, category, location, 
      author_name, author_role, cover_image, status, 
      scheduled_for, published_at, is_featured, read_time, views_count, 
      created_at, updated_at,
      length(content) as content_length,
      length(excerpt) as excerpt_length
    FROM articles 
    ORDER BY created_at ASC
  `);

  const articles = articlesRes.rows;
  console.log(`\n=========================================`);
  console.log(`إجمالي المقالات: ${articles.length}`);
  console.log(`=========================================`);

  const catCount = {};
  const statusCount = {};
  let totalLength = 0;
  let totalWords = 0;
  let featuredCount = 0;
  let missingLocation = 0;
  let brokenImages = 0;

  const articleDetails = [];

  for (const a of articles) {
    catCount[a.category] = (catCount[a.category] || 0) + 1;
    statusCount[a.status] = (statusCount[a.status] || 0) + 1;
    if (a.is_featured) featuredCount++;
    let isBroken = false;
    if (!a.cover_image) {
      isBroken = true;
    } else if (a.cover_image.startsWith('/')) {
      const fullPath = path.join(process.cwd(), 'public', a.cover_image);
      if (!fs.existsSync(fullPath)) isBroken = true;
    } else if (!a.cover_image.startsWith('http')) {
      isBroken = true;
    }
    if (isBroken) brokenImages++;

    const words = a.content.trim().split(/\s+/).length;
    totalWords += words;
    totalLength += a.content.length;

    // Headings analysis
    const h2Count = (a.content.match(/<h2/gi) || []).length;
    const h3Count = (a.content.match(/<h3/gi) || []).length;
    const pCount = (a.content.match(/<p/gi) || []).length;
    const liCount = (a.content.match(/<li/gi) || []).length;
    const blockquoteCount = (a.content.match(/<blockquote/gi) || []).length;

    articleDetails.push({
      id: a.id,
      title: a.title,
      slug: a.slug,
      category: a.category,
      status: a.status,
      author: `${a.author_name} (${a.author_role || 'بدون مسمى'})`,
      location: a.location || 'غير محدد',
      words,
      chars: a.content.length,
      excerptLength: a.excerpt.length,
      isFeatured: a.is_featured,
      views: a.views_count,
      scheduledFor: a.scheduled_for,
      publishedAt: a.published_at,
      coverImage: a.cover_image,
      h2Count,
      h3Count,
      pCount,
      liCount,
      blockquoteCount
    });
  }

  console.log('\n--- التوزيع حسب الأقسام (Categories) ---');
  console.table(catCount);

  console.log('\n--- التوزيع حسب الحالة (Status) ---');
  console.table(statusCount);

  console.log('\n--- إحصائيات المحتوى ---');
  console.log(`متوسط عدد الكلمات لكل مقال: ${Math.round(totalWords / (articles.length || 1))} كلمة`);
  console.log(`متوسط عدد الأحرف لكل مقال: ${Math.round(totalLength / (articles.length || 1))} حرف`);
  console.log(`عدد المقالات المميزة (Featured): ${featuredCount}`);
  console.log(`مقالات بدون موقع جغرافي: ${missingLocation}`);
  console.log(`صور غير صالحة أو بدون رابط: ${brokenImages}`);

  console.log('\n--- تفاصيل المقالات (41 مقالاً) ---');
  articles.forEach((a, idx) => {
    const words = a.content.trim().split(/\s+/).length;
    const dateStr = a.scheduled_for ? new Date(a.scheduled_for).toISOString().slice(0, 10) : (a.published_at ? new Date(a.published_at).toISOString().slice(0, 10) : 'بدون تاريخ');
    console.log(`${String(idx + 1).padStart(2, '0')}. [${a.category}] [${a.status}] ${a.title}`);
    console.log(`    الكاتب: ${a.author_name} | الموقع: ${a.location || 'غير محدد'} | الكلمات: ${words} (${a.content_length} حرف) | التاريخ: ${dateStr}`);
  });


  process.exit(0);
}

analyze().catch(err => {
  console.error('Error during analysis:', err);
  process.exit(1);
});
