import { PGlite } from '@electric-sql/pglite';
import fs from 'fs';
import path from 'path';

async function seedMemoryAlbum() {
  const dbPath = path.resolve(process.cwd(), 'local-data', 'pglite');
  const db = new PGlite(dbPath);
  const dirPath = path.resolve(process.cwd(), 'ألبوم-الذاكرة');

  console.log('=== زراعة ومزامنة مقالات «ألبوم الذاكرة» الـ 20 في قاعدة البيانات ===\n');

  const files = fs.readdirSync(dirPath)
    .filter(f => f.startsWith('مقال-') && f.endsWith('.md'))
    .sort();

  console.log(`تم العثور على ${files.length} مقالاً في مجلد [ألبوم-الذاكرة]...\n`);

  const locationsMap = {
    '01': 'العاصمة - نقعة وقصر السيف القديم',
    '02': 'العاصمة - المعتمدية البريطانية وبادية الكويت',
    '03': 'العاصمة - ساحة الصفاة وسوق واقف',
    '04': 'العاصمة - أسواق المباركية وسوق الغربللي',
    '05': 'العاصمة - فرجان النواخذة وحسابات الهيرات',
    '06': 'العاصمة - المحكمة الشرعية وحي الوسط',
    '07': 'العاصمة - كشك مبارك وقصر السيف',
    '08': 'العاصمة - سكة عنزة والمدرسة المباركية',
    '09': 'العاصمة - سوق الصفافير وكشك مبارك',
    '10': 'العاصمة - مجلس النقد وميناء الشويخ',
    '11': 'العاصمة - بيت ديكسون على شارع الخليج',
    '12': 'العاصمة - ساحل الفرضة ودائرة الأمن العام',
    '13': 'العاصمة - ساحة الصفاة وبوابة نايف',
    '14': 'محافظة حولي - مهبط النقرة القديم',
    '15': 'العاصمة - قصر السيف ومبنى المقسم القديم',
    '16': 'العاصمة - ساحل القبلة وحي الشرق',
    '17': 'محافظة حولي - سينما الشرق وسينما حولي الصيفية',
    '18': 'العاصمة - قصر نايف بساحة الصفاة',
    '19': 'العاصمة - حي المرقاب واستوديو التلفزيون',
    '20': 'العاصمة - مطبعة المعارف وشارع الأمير'
  };

  const imagesMap = [
    '/images/historical-place.jpg',
    '/images/street.jpg',
    '/images/hero.jpg',
    '/images/historical-place.jpg',
    '/images/street.jpg'
  ];

  let insertedCount = 0;

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const fullPath = path.join(dirPath, file);
    const rawContent = fs.readFileSync(fullPath, 'utf-8');

    // Extract Title
    const titleMatch = rawContent.match(/^#\s+(.+)$/m);
    const title = titleMatch ? titleMatch[1].trim() : file.replace('.md', '');

    // Extract Slug
    const slugMatch = rawContent.match(/\*\*Slug:\*\*\s*([^\r\n]+)/);
    const slug = slugMatch ? slugMatch[1].trim() : `memory-album-${i + 1}`;

    // Extract Excerpt
    const excerptMatch = rawContent.match(/\*\*Excerpt:\*\*\s*([^\r\n]+)/);
    const excerpt = excerptMatch ? excerptMatch[1].trim() : title;

    // Determine Location
    const prefix = file.substring(5, 7);
    const location = locationsMap[prefix] || 'مدينة الكويت التاريخية';

    const coverImage = imagesMap[i % imagesMap.length];
    const readTime = '٧ دقائق';

    // Schedule dates spread across November and December 2026
    const baseDate = new Date('2026-11-01T10:00:00+03:00');
    baseDate.setDate(baseDate.getDate() + (i * 3));

    // Check if exists
    const existing = await db.query('SELECT id FROM articles WHERE slug = $1', [slug]);

    if (existing.rows.length > 0) {
      await db.query(`
        UPDATE articles SET
          title = $1,
          excerpt = $2,
          content = $3,
          category = $4,
          location = $5,
          author_name = $6,
          author_role = $7,
          cover_image = $8,
          read_time = $9,
          status = 'scheduled',
          scheduled_for = $10,
          updated_at = NOW()
        WHERE slug = $11
      `, [
        title,
        excerpt,
        rawContent,
        'ألبوم الذاكرة',
        location,
        'خالد تميم',
        'باحث ومحرر التراث والتوثيق الأرشيفي',
        coverImage,
        readTime,
        baseDate.toISOString(),
        slug
      ]);
      console.log(`[${i + 1}/20] تم تحديث: ${title}`);
    } else {
      await db.query(`
        INSERT INTO articles (
          slug, title, excerpt, content, category, location,
          author_name, author_role, cover_image, read_time,
          status, scheduled_for, created_at, updated_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6,
          $7, $8, $9, $10,
          'scheduled', $11, NOW(), NOW()
        )
      `, [
        slug,
        title,
        excerpt,
        rawContent,
        'ألبوم الذاكرة',
        location,
        'خالد تميم',
        'باحث ومحرر التراث والتوثيق الأرشيفي',
        coverImage,
        readTime,
        baseDate.toISOString()
      ]);
      console.log(`[${i + 1}/20] تم إدراج: ${title}`);
    }
    insertedCount++;
  }

  const resCount = await db.query("SELECT count(*) FROM articles WHERE category = 'ألبوم الذاكرة'");
  console.log(`\nتم بنجاح! إجمالي مقالات قسم «ألبوم الذاكرة» في قاعدة البيانات الآن: ${resCount.rows[0].count}`);
}

seedMemoryAlbum().catch(err => {
  console.error('حدث خطأ أثناء الزراعة:', err);
  process.exit(1);
});
