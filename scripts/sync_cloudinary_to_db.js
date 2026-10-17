import { PGlite } from '@electric-sql/pglite';
import path from 'path';
import fs from 'fs';

async function syncCloudinaryToDb() {
  console.log('=== مزامنة قاعدة البيانات المحلية (PGlite) مع روابط Cloudinary CDN الجديدة ===\n');

  const manifestPath = path.resolve(process.cwd(), 'scripts', 'cloudinary_manifest.json');
  if (!fs.existsSync(manifestPath)) {
    console.error(`خطأ: لم يتم العثور على ملف بيان Cloudinary: ${manifestPath}`);
    process.exit(1);
  }

  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
  const entries = Object.values(manifest);
  console.log(`تم تحميل بيان Cloudinary: ${entries.length} صورة مسجلة.`);

  const dbPath = path.resolve(process.cwd(), 'local-data', 'pglite');
  const db = new PGlite(dbPath);

  let updatedCount = 0;
  let notFoundCount = 0;

  for (const item of entries) {
    const slug = item.slug;
    const secureUrl = item.secure_url;

    // Check if article exists
    const checkRes = await db.query('SELECT id, title, slug, cover_image FROM articles WHERE slug = $1', [slug]);
    if (checkRes.rows.length === 0) {
      console.warn(`⚠️ لم يتم العثور على المقال بالسلاج: ${slug}`);
      notFoundCount++;
      continue;
    }

    // Update cover_image to Cloudinary secure_url
    await db.query(
      'UPDATE articles SET cover_image = $1, updated_at = NOW() WHERE slug = $2',
      [secureUrl, slug]
    );
    updatedCount++;
  }

  console.log(`\nتم تحديث ${updatedCount} مقالاً بنجاح في قاعدة البيانات.`);
  if (notFoundCount > 0) {
    console.warn(`عدد المقالات التي لم يتم العثور عليها: ${notFoundCount}`);
  }

  // Verification queries
  const totalRes = await db.query('SELECT count(*) as total FROM articles');
  const cloudinaryRes = await db.query("SELECT count(*) as cdn_count FROM articles WHERE cover_image LIKE 'https://res.cloudinary.com/%'");
  const localRes = await db.query("SELECT count(*) as local_count FROM articles WHERE cover_image LIKE '/images/%'");

  console.log('\n--- نتائج فحص التحقق من قاعدة البيانات بعد التحديث ---');
  console.log(`إجمالي المقالات: ${totalRes.rows[0].total}`);
  console.log(`مقالات بروابط Cloudinary CDN فائقة السرعة: ${cloudinaryRes.rows[0].cdn_count}`);
  console.log(`مقالات بصور محلية: ${localRes.rows[0].local_count}`);

  // Sample check
  const sample = await db.query('SELECT slug, title, category, cover_image FROM articles ORDER BY category, title LIMIT 10');
  console.log('\nعينة من السجلات بعد التحديث:');
  console.table(sample.rows);

  console.log('\n✓ تمت المزامنة مع Cloudinary بنجاح تام!');
  process.exit(0);
}

syncCloudinaryToDb().catch((err) => {
  console.error('فشل في مزامنة قاعدة البيانات:', err);
  process.exit(1);
});
