import { PGlite } from '@electric-sql/pglite';
import fs from 'node:fs';

async function main() {
  const articles = JSON.parse(fs.readFileSync('./src/data/articles-data.json', 'utf8'));
  const pg = new PGlite('./local-data/pglite');

  console.log(`Updating ${articles.length} articles in PGlite...`);
  let updated = 0;

  for (const art of articles) {
    await pg.query(
      `UPDATE articles SET content = $1, old_slug = $2 WHERE slug = $3 OR id = $4;`,
      [art.content, art.old_slug || null, art.slug, art.id]
    ).catch(async () => {
      // If old_slug column doesn't exist, update just content
      await pg.query(
        `UPDATE articles SET content = $1 WHERE slug = $2 OR id = $3;`,
        [art.content, art.slug, art.id]
      );
    });
    updated++;
  }

  console.log(`Successfully synced ${updated} articles to local PGlite!`);
}

main().catch(console.error);
