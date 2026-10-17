import json

with open('scripts/articles_summary.json', 'r', encoding='utf-8') as f:
    articles = json.load(f)

print(f"Total articles: {len(articles)}")
for idx, a in enumerate(articles, 1):
    print(f"{idx:03d} | {a['category']} | {a['slug']} | {a['title']}")
