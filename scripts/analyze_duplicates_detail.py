import json
import os
import hashlib

with open('scripts/all_articles_media_manifest.json', 'r', encoding='utf-8') as f:
    manifest = json.load(f)

# Group by image file hash
hashes = {}
for item in manifest:
    path = os.path.join("public", item["saved_path"].lstrip("/\\"))
    if os.path.exists(path):
        with open(path, "rb") as img_f:
            h = hashlib.md5(img_f.read()).hexdigest()
        hashes.setdefault(h, []).append(item)

print(f"Total articles: {len(manifest)}")
print(f"Number of unique images currently: {len(hashes)}")

duplicates_list = []
unique_list = []

for h, items in hashes.items():
    if len(items) == 1:
        unique_list.append(items[0])
    else:
        # The first one might be legitimate, the rest are bogus copies!
        duplicates_list.append(items)

print(f"\nUnique images: {len(unique_list)}")
print(f"Duplicate clusters: {len(duplicates_list)}")

total_dup_articles = sum(len(items) for items in duplicates_list)
print(f"Total articles involved in duplicate clusters: {total_dup_articles}")

output = {
    "unique_articles": [{"slug": x["slug"], "category": x["category"], "title_or_fn": x["clean_filename"]} for x in unique_list],
    "duplicate_clusters": []
}

for cluster in duplicates_list:
    output["duplicate_clusters"].append([
        {"slug": x["slug"], "category": x["category"], "filename": x["clean_filename"], "saved_path": x["saved_path"]}
        for x in cluster
    ])

with open("scripts/duplicates_analysis.json", "w", encoding="utf-8") as f:
    json.dump(output, f, ensure_ascii=False, indent=2)

print("\nSaved analysis to scripts/duplicates_analysis.json")
