import json

with open('scripts/articles_summary.json', 'r', encoding='utf-8') as f:
    articles = json.load(f)

with open('scripts/articles_catalog.md', 'w', encoding='utf-8') as out:
    out.write('# فهرس المقالات الـ 100 في قاعدة البيانات\n\n')
    current_cat = ''
    for idx, a in enumerate(articles, 1):
        if a['category'] != current_cat:
            current_cat = a['category']
            out.write(f'\n## قسم: {current_cat}\n\n')
        out.write(f"- **{idx:03d}** | `{a['slug']}`\n")
        out.write(f"  - **العنوان:** {a['title']}\n")
        out.write(f"  - **الموقع:** {a.get('location') or 'غير محدد'}\n")
        out.write(f"  - **المقدمة:** {a.get('excerpt')[:120]}...\n\n")

print(f"Catalog written to scripts/articles_catalog.md for {len(articles)} articles.")
