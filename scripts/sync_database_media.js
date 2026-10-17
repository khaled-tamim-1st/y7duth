import { PGlite } from '@electric-sql/pglite';
import path from 'path';
import fs from 'fs';

async function syncDatabase() {
  console.log('=== مزامنة قاعدة البيانات المحلية (PGlite) مع مسارات Media SEO الجديدة ===\n');

  const manifestPath = path.resolve(process.cwd(), 'scripts', 'all_articles_media_manifest.json');
  if (!fs.existsSync(manifestPath)) {
    console.error(`خطأ: لم يتم العثور على ملف البيان: ${manifestPath}`);
    process.exit(1);
  }

  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
  console.log(`تم تحميل بيان الوسائط: ${manifest.length} صورة مسجلة.`);

  const dbPath = path.resolve(process.cwd(), 'local-data', 'pglite');
  const db = new PGlite(dbPath);

  let updatedCount = 0;
  let notFoundCount = 0;

  for (const item of manifest) {
    const slug = item.slug;
    const coverImage = item.saved_path;

    // Check if article exists
    const checkRes = await db.query('SELECT id, title, slug, cover_image FROM articles WHERE slug = $1', [slug]);
    if (checkRes.rows.length === 0) {
      console.warn(`⚠️ لم يتم العثور على المقال بالسلاج: ${slug}`);
      notFoundCount++;
      continue;
    }

    // Update cover_image
    await db.query(
      'UPDATE articles SET cover_image = $1, updated_at = NOW() WHERE slug = $2',
      [coverImage, slug]
    );
    updatedCount++;
  }

  console.log(`\nتم تحديث ${updatedCount} مقالاً بنجاح في قاعدة البيانات.`);
  if (notFoundCount > 0) {
    console.warn(`عدد المقالات التي لم يتم العثور عليها: ${notFoundCount}`);
  }

  // Verification queries
  const totalRes = await db.query('SELECT count(*) as total FROM articles');
  const localRes = await db.query("SELECT count(*) as local_count FROM articles WHERE cover_image LIKE '/images/articles/%'");
  const httpRes = await db.query("SELECT count(*) as http_count FROM articles WHERE cover_image LIKE 'http%'");

  console.log('\n--- نتائج فحص التحقق من قاعدة البيانات ---');
  console.log(`إجمالي المقالات: ${totalRes.rows[0].total}`);
  console.log(`مقالات بصور محلية محسنة (/images/articles/...): ${localRes.rows[0].local_count}`);
  console.log(`مقالات بروابط خارجية (unsplash / http): ${httpRes.rows[0].http_count}`);

  // Sample check
  const sample = await db.query('SELECT slug, title, category, cover_image FROM articles ORDER BY category, title LIMIT 10');
  console.log('\nعينة من السجلات بعد التحديث:');
  console.table(sample.rows);

  console.log('\n✓ تمت المزامنة بنجاح وبشكل نهائي!');
  process.exit(0);
}

syncDatabase().catch((err) => {
  console.error('فشل في مزامنة قاعدة البيانات:', err);
  process.exit(1);
});
