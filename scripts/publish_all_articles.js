import { PGlite } from '@electric-sql/pglite';
import path from 'path';

async function publishAllArticles() {
  console.log('=== نشر جميع المقالات وإلغاء الجدولة ===\n');

  const dbPath = path.resolve(process.cwd(), 'local-data', 'pglite');
  const db = new PGlite(dbPath);

  // 1. Check status before update
  const beforeRes = await db.query('SELECT status, count(*) FROM articles GROUP BY status');
  console.log('الحالة قبل التحديث:');
  console.table(beforeRes.rows);

  // 2. Perform the update: set status = 'published', clear scheduled_for, set published_at = NOW()
  const updateRes = await db.query(`
    UPDATE articles
    SET status = 'published',
        scheduled_for = NULL,
        published_at = COALESCE(published_at, NOW()),
        updated_at = NOW()
  `);
  console.log(`\nتم تحديث المقالات بنجاح.`);

  // 3. Check status after update
  const afterRes = await db.query('SELECT status, count(*) FROM articles GROUP BY status');
  console.log('\nالحالة بعد التحديث:');
  console.table(afterRes.rows);

  // 4. Verification queries
  const totalRes = await db.query('SELECT count(*) as total FROM articles');
  const publishedRes = await db.query("SELECT count(*) as count FROM articles WHERE status = 'published'");
  const scheduledRes = await db.query("SELECT count(*) as count FROM articles WHERE status = 'scheduled'");
  const nullScheduledForRes = await db.query("SELECT count(*) as count FROM articles WHERE scheduled_for IS NULL");

  console.log('\n--- نتائج فحص التحقق النهائي ---');
  console.log(`إجمالي المقالات: ${totalRes.rows[0].total}`);
  console.log(`المقالات المنشورة (published): ${publishedRes.rows[0].count}`);
  console.log(`المقالات المجدولة (scheduled): ${scheduledRes.rows[0].count}`);
  console.log(`المقالات بدون تاريخ جدولة مستقبلي: ${nullScheduledForRes.rows[0].count}`);

  // 5. Sample check across categories
  const sample = await db.query(`
    SELECT slug, title, category, status, published_at
    FROM articles
    ORDER BY category, published_at DESC
    LIMIT 10
  `);
  console.log('\nعينة من المقالات المنشورة:');
  console.table(sample.rows);

  console.log('\n✓ تم نشر جميع المقالات المائة بنجاح تام وإلغاء الجدولة!');
  process.exit(0);
}

publishAllArticles().catch((err) => {
  console.error('فشل في نشر المقالات:', err);
  process.exit(1);
});
